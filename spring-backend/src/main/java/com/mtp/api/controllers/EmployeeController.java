package com.mtp.api.controllers;

import com.mtp.api.models.Employee;
import com.mtp.api.events.MtpEvents;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.DepartmentRepository;
import com.mtp.api.repositories.PositionRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/employees")
@Slf4j
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private com.mtp.api.repositories.AttendanceRepository attendanceRepository;

    @Autowired
    private com.mtp.api.repositories.LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private com.mtp.api.services.ImageUploadService imageUploadService;

    @Autowired
    private com.mtp.api.repositories.UserRepository userRepository;

    @Autowired
    private com.mtp.api.services.AuditLogService auditLogService;

    // DTO for user-link candidates
    public static class UserLinkDTO {
        public String id;
        public String firstName;
        public String lastName;
        public String email;
        public String avatarUrl;
        public String userName;
        public java.util.List<String> roles;

        public UserLinkDTO(String id, String firstName, String lastName, String email,
                String avatarUrl, String userName, java.util.List<String> roles) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.avatarUrl = avatarUrl;
            this.userName = userName;
            this.roles = roles;
        }
    }

    @Autowired
    private com.mtp.api.repositories.SystemSettingRepository systemSettingRepository;

    @GetMapping("/generate-id")
    public ResponseEntity<java.util.Map<String, String>> generateStaffId() {
        String format = systemSettingRepository.findById("HR_STAFF_ID_FORMAT")
                .map(com.mtp.api.models.SystemSetting::getValue)
                .orElse("EMP-{YYYY}-{SEQ}");

        Integer maxId = employeeRepository.findMaxId();
        int nextId = maxId + 1;
        String seq = String.format("%04d", nextId);
        String year = String.valueOf(java.time.Year.now().getValue());

        String generatedId = format.replace("{SEQ}", seq).replace("{YYYY}", year);

        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("idNo", generatedId);
        return ResponseEntity.ok(response);
    }

    /**
     * Returns admin users whose email does NOT yet have an Employee record.
     * Used by the HR "Import from Users" feature.
     */
    @GetMapping("/link-candidates")
    public java.util.List<UserLinkDTO> getLinkCandidates() {
        java.util.Set<String> existingEmails = employeeRepository.findAll()
                .stream()
                .filter(e -> e.getEmail() != null)
                .map(e -> e.getEmail().trim().toLowerCase())
                .collect(java.util.stream.Collectors.toSet());

        return userRepository.findAll()
                .stream()
                .filter(u -> u.getEmail() != null && !existingEmails.contains(u.getEmail().trim().toLowerCase()))
                .map(u -> new UserLinkDTO(
                        u.getId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getEmail(),
                        u.getAvatarUrl(),
                        u.getUserName(),
                        u.getRoles() == null ? java.util.Collections.emptyList()
                                : u.getRoles().stream()
                                        .map(r -> r.getName())
                                        .collect(java.util.stream.Collectors.toList())))
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentEmployeeProfile() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        log.info("Fetching profile for currently logged-in user from DB: {}", username);
        var userOpt = userRepository.findByUserName(username);
        String email = userOpt.map(com.mtp.api.models.User::getEmail).orElse(username);

        return employeeRepository.findByEmailIgnoreCase(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> employeeRepository.findByEmailIgnoreCase(username)
                        .map(ResponseEntity::ok)
                        .orElseGet(() -> {
                            // Fallback to first employee to ensure a valid profile page
                            java.util.List<Employee> all = employeeRepository.findAll();
                            if (!all.isEmpty()) {
                                return ResponseEntity.ok(all.get(0));
                            }
                            return ResponseEntity.notFound().build();
                        }));
    }

    @GetMapping
    public Page<?> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String contractType,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EmployeeRepository.EmployeeSummary> page = (Page<EmployeeRepository.EmployeeSummary>) employeeRepository
                .findAllSummaries(search, department, status, contractType, pageable);
        if (!page.isEmpty()) {
            String photo = page.getContent().get(0).getPhoto();
            log.info("Employee list fetched. Count: {}, First photo length: {}", page.getTotalElements(),
                    (photo != null ? photo.length() : "NULL"));
        }
        return page;
    }

    @GetMapping("/{id}")
    @Cacheable(value = "employees", key = "#id")
    public ResponseEntity<Employee> getById(@PathVariable Integer id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @PostMapping
    @Transactional
    @CacheEvict(value = "employees", allEntries = true)
    public Employee create(@Valid @RequestBody EmployeeDTO dto) {
        log.info("Creating employee: {} {}", dto.getFirstNameEnglish(), dto.getLastNameEnglish());

        // Proactive check for duplicate ID to avoid generic 500
        if (employeeRepository.findByIdNo(dto.getIdNo()).isPresent()) {
            throw new org.springframework.dao.DataIntegrityViolationException(
                    "Duplicate employee ID number: " + dto.getIdNo());
        }

        Employee employee = new Employee();
        updateEmployeeFromDTO(employee, dto);
        Employee saved = employeeRepository.save(employee);

        // Trigger Message Queue / Event System
        eventPublisher.publishEvent(new MtpEvents.EmployeeOnboardedEvent(
                saved.getId(),
                saved.getFirstNameEnglish() + " " + saved.getLastNameEnglish(),
                saved.getDepartment() != null ? saved.getDepartment().getName() : "N/A",
                saved.getEmail()));

        log.info("Employee created with ID: {} and notification broadcasted", saved.getId());
        auditLogService.logActivity("Created Employee",
                saved.getFirstNameEnglish() + " " + saved.getLastNameEnglish() + " (" + saved.getIdNo() + ")",
                "success");
        return saved;
    }

    @PutMapping("/{id}")
    @Transactional
    @CacheEvict(value = "employees", allEntries = true)
    public ResponseEntity<Employee> update(@PathVariable Integer id, @Valid @RequestBody EmployeeDTO dto) {
        log.info("Updating employee ID: {}", id);
        return employeeRepository.findById(id).map(e -> {
            updateEmployeeFromDTO(e, dto);
            Employee saved = employeeRepository.save(e);
            log.info("Employee ID {} updated successfully", id);
            auditLogService.logActivity("Updated Employee",
                    saved.getFirstNameEnglish() + " " + saved.getLastNameEnglish() + " (" + saved.getIdNo() + ")",
                    "info");
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    @CacheEvict(value = "employees", allEntries = true)
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        log.warn("Deleting employee ID: {}", id);
        return employeeRepository.findById(id).map(e -> {
            // 1. Delete associated Attendance records
            java.util.List<com.mtp.api.models.Attendance> attendances = attendanceRepository.findByEmployeeId(id);
            if (attendances != null && !attendances.isEmpty()) {
                log.info("Deleting {} attendance records for employee ID {}", attendances.size(), id);
                attendanceRepository.deleteAll(attendances);
            }

            // 2. Delete associated LeaveRequest records
            java.util.List<com.mtp.api.models.LeaveRequest> leaves = leaveRequestRepository
                    .findByEmployeeIdOrderByCreatedAtDesc(id);
            if (leaves != null && !leaves.isEmpty()) {
                log.info("Deleting {} leave request records for employee ID {}", leaves.size(), id);
                leaveRequestRepository.deleteAll(leaves);
            }

            // Assets are now managed by mtp-stock-service. No longer unassigned here.

            // 4. Delete the employee
            String empDetails = e.getFirstNameEnglish() + " " + e.getLastNameEnglish() + " (" + e.getIdNo() + ")";
            employeeRepository.delete(e);
            log.warn("Employee ID {} permanently removed along with all dependencies", id);
            auditLogService.logActivity("Deleted Employee", empDetails, "critical");
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    private void updateEmployeeFromDTO(Employee e, EmployeeDTO dto) {
        e.setFirstNameEnglish(dto.getFirstNameEnglish());
        e.setLastNameEnglish(dto.getLastNameEnglish());
        e.setEmail(dto.getEmail());
        e.setIdNo(dto.getIdNo());
        e.setStatus(dto.getStatus());
        e.setBasicSalary(dto.getBasicSalary());
        e.setGender(dto.getGender());
        e.setPhoneNumber(dto.getPhoneNumber());
        e.setAddress(dto.getAddress());
        e.setContractType(dto.getContractType());
        e.setBankName(dto.getBankName());
        e.setBankAccountNumber(dto.getBankAccountNumber());
        e.setEmergencyContactName(dto.getEmergencyContactName());
        e.setEmergencyContact(dto.getEmergencyContact());
        e.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        e.setFirstNameKhmer(dto.getFirstNameKhmer());
        e.setLastNameKhmer(dto.getLastNameKhmer());
        e.setBiometricStatus(dto.getBiometricStatus());
        e.setBiometricId(dto.getBiometricId());

        log.info("Updating employee {}: KH_First={}, KH_Last={}, Address={}, ID={}",
                e.getId(), dto.getFirstNameKhmer(), dto.getLastNameKhmer(), dto.getAddress(),
                dto.getIdentityCardNumber());

        // Handle Custom Fields as JSON string
        if (dto.getCustomFields() != null) {
            try {
                e.setCustomFields(
                        new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(dto.getCustomFields()));
            } catch (Exception ex) {
                log.error("Failed to serialize custom fields", ex);
            }
        }

        // Handle Cloudinary Upload
        if (dto.getPhoto() != null && dto.getPhoto().startsWith("data:image")) {
            try {
                String imageUrl = imageUploadService.uploadBase64Image(dto.getPhoto(), "employees");
                e.setPhoto(imageUrl);
            } catch (Exception ex) {
                log.error("Cloudinary upload failed for employee photo", ex);
                e.setPhoto(dto.getPhoto()); // Fallback to base64 if upload fails
            }
        } else {
            e.setPhoto(dto.getPhoto());
        }

        // Handle attachment uploads
        if (dto.getPhotoIdAttachment() != null && dto.getPhotoIdAttachment().startsWith("data:")) {
            try {
                e.setPhotoIdAttachment(
                        imageUploadService.uploadBase64File(dto.getPhotoIdAttachment(), "employee_docs"));
            } catch (Exception ex) {
                log.error("Cloudinary upload failed for Photo ID", ex);
                e.setPhotoIdAttachment(dto.getPhotoIdAttachment());
            }
        } else if (dto.getPhotoIdAttachment() != null) {
            e.setPhotoIdAttachment(dto.getPhotoIdAttachment());
        }

        if (dto.getContractAttachment() != null && dto.getContractAttachment().startsWith("data:")) {
            try {
                e.setContractAttachment(
                        imageUploadService.uploadBase64File(dto.getContractAttachment(), "employee_docs"));
            } catch (Exception ex) {
                log.error("Cloudinary upload failed for Contract", ex);
                e.setContractAttachment(dto.getContractAttachment());
            }
        } else if (dto.getContractAttachment() != null) {
            e.setContractAttachment(dto.getContractAttachment());
        }

        if (dto.getIdPoorAttachment() != null && dto.getIdPoorAttachment().startsWith("data:")) {
            try {
                e.setIdPoorAttachment(imageUploadService.uploadBase64File(dto.getIdPoorAttachment(), "employee_docs"));
            } catch (Exception ex) {
                log.error("Cloudinary upload failed for ID Poor", ex);
                e.setIdPoorAttachment(dto.getIdPoorAttachment());
            }
        } else if (dto.getIdPoorAttachment() != null) {
            e.setIdPoorAttachment(dto.getIdPoorAttachment());
        }

        if (dto.getCvAttachment() != null && dto.getCvAttachment().startsWith("data:")) {
            try {
                e.setCvAttachment(imageUploadService.uploadBase64File(dto.getCvAttachment(), "employee_docs"));
            } catch (Exception ex) {
                log.error("Cloudinary upload failed for CV", ex);
                e.setCvAttachment(dto.getCvAttachment());
            }
        } else if (dto.getCvAttachment() != null) {
            e.setCvAttachment(dto.getCvAttachment());
        }

        e.setTitle(dto.getTitle() != null ? dto.getTitle() : "Mr/Ms");
        e.setPlaceOfBirth(dto.getPlaceOfBirth());
        e.setCountry(dto.getCountry());
        e.setNationality(dto.getNationality());
        e.setBloodGroup(dto.getBloodGroup());
        e.setManager(dto.getManager());
        e.setMaritalStatus(dto.getMaritalStatus());
        e.setChildren(dto.getChildren());
        e.setIdentityCardNumber(dto.getIdentityCardNumber());
        e.setIdentityCardType(dto.getIdentityCardType());
        e.setNote(dto.getNote());

        try {
            e.setDateOfBirth(dto.getDateOfBirth() != null && !dto.getDateOfBirth().isEmpty()
                    ? java.time.LocalDate.parse(dto.getDateOfBirth())
                    : null);
            e.setJoinDate(dto.getJoinDate() != null && !dto.getJoinDate().isEmpty()
                    ? java.time.LocalDate.parse(dto.getJoinDate())
                    : null);
            e.setContractStartDate(dto.getContractStartDate() != null && !dto.getContractStartDate().isEmpty()
                    ? java.time.LocalDate.parse(dto.getContractStartDate())
                    : null);
            e.setContractEndDate(dto.getContractEndDate() != null && !dto.getContractEndDate().isEmpty()
                    ? java.time.LocalDate.parse(dto.getContractEndDate())
                    : null);
            e.setProbationEndDate(dto.getProbationEndDate() != null && !dto.getProbationEndDate().isEmpty()
                    ? java.time.LocalDate.parse(dto.getProbationEndDate())
                    : null);
        } catch (Exception ex) {
            log.error("Date parsing error for employee mapping", ex);
        }

        if (dto.getDepartment() != null && !dto.getDepartment().trim().isEmpty()) {
            departmentRepository.findFirstByName(dto.getDepartment().trim())
                    .ifPresentOrElse(e::setDepartment, () -> {
                        log.info("Creating new Department '{}'", dto.getDepartment().trim());
                        com.mtp.api.models.Department newDept = new com.mtp.api.models.Department();
                        newDept.setName(dto.getDepartment().trim());
                        e.setDepartment(departmentRepository.save(newDept));
                    });
        } else {
            departmentRepository.findAll().stream().findFirst().ifPresent(e::setDepartment);
        }

        if (dto.getPosition() != null && !dto.getPosition().trim().isEmpty()) {
            positionRepository.findFirstByName(dto.getPosition().trim())
                    .ifPresentOrElse(e::setPosition, () -> {
                        log.info("Creating new Position '{}'", dto.getPosition().trim());
                        com.mtp.api.models.Position newPos = new com.mtp.api.models.Position();
                        newPos.setName(dto.getPosition().trim());
                        e.setPosition(positionRepository.save(newPos));
                    });
        } else {
            positionRepository.findAll().stream().findFirst().ifPresent(e::setPosition);
        }
    }

    public static class EmployeeDTO {
        @NotBlank(message = "First name is required")
        @Size(max = 100, message = "First name cannot exceed 100 characters")
        private String firstNameEnglish;

        @NotBlank(message = "Last name is required")
        @Size(max = 100, message = "Last name cannot exceed 100 characters")
        private String lastNameEnglish;

        private String firstNameKhmer;
        private String lastNameKhmer;

        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "ID number is required")
        private String idNo;

        private String status;
        private String position;
        private String department;

        @DecimalMin(value = "0.0", message = "Salary cannot be negative")
        private Double basicSalary;

        private String gender;
        private String dateOfBirth;

        @Pattern(regexp = "^(\\+?[0-9\\s\\-\\.\\(\\)]{0,30})$", message = "Invalid phone number format")
        private String phoneNumber;

        private String address;
        private String joinDate;
        private String contractType;
        private String bankName;
        private String bankAccountNumber;
        private String emergencyContactName;
        private String emergencyContact;

        @Pattern(regexp = "^(\\+?[0-9\\s\\-\\.\\(\\)]{0,30})$", message = "Invalid emergency phone number format")
        private String emergencyContactPhone;

        private String photo; // Base64 — validated by size at Tomcat level
        private Object customFields; // List or Map from frontend

        private String title;
        private String placeOfBirth;
        private String country;
        private String nationality;
        private String bloodGroup;
        private String contractStartDate;
        private String contractEndDate;
        private String probationEndDate;
        private String manager;
        private String maritalStatus;
        private String children;
        private String identityCardNumber;
        private String identityCardType;
        private String note;
        private String biometricStatus;
        private String biometricId;

        private String photoIdAttachment;
        private String contractAttachment;
        private String idPoorAttachment;
        private String cvAttachment;

        // Getters and Setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getPlaceOfBirth() {
            return placeOfBirth;
        }

        public void setPlaceOfBirth(String placeOfBirth) {
            this.placeOfBirth = placeOfBirth;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getNationality() {
            return nationality;
        }

        public void setNationality(String nationality) {
            this.nationality = nationality;
        }

        public String getBloodGroup() {
            return bloodGroup;
        }

        public void setBloodGroup(String bloodGroup) {
            this.bloodGroup = bloodGroup;
        }

        public String getContractStartDate() {
            return contractStartDate;
        }

        public void setContractStartDate(String contractStartDate) {
            this.contractStartDate = contractStartDate;
        }

        public String getContractEndDate() {
            return contractEndDate;
        }

        public void setContractEndDate(String contractEndDate) {
            this.contractEndDate = contractEndDate;
        }

        public String getProbationEndDate() {
            return probationEndDate;
        }

        public void setProbationEndDate(String probationEndDate) {
            this.probationEndDate = probationEndDate;
        }

        public String getManager() {
            return manager;
        }

        public void setManager(String manager) {
            this.manager = manager;
        }

        public String getMaritalStatus() {
            return maritalStatus;
        }

        public void setMaritalStatus(String maritalStatus) {
            this.maritalStatus = maritalStatus;
        }

        public String getChildren() {
            return children;
        }

        public void setChildren(String children) {
            this.children = children;
        }

        public String getIdentityCardNumber() {
            return identityCardNumber;
        }

        public void setIdentityCardNumber(String identityCardNumber) {
            this.identityCardNumber = identityCardNumber;
        }

        public String getIdentityCardType() {
            return identityCardType;
        }

        public void setIdentityCardType(String identityCardType) {
            this.identityCardType = identityCardType;
        }

        public String getNote() {
            return note;
        }

        public void setNote(String note) {
            this.note = note;
        }

        public String getFirstNameEnglish() {
            return firstNameEnglish;
        }

        public void setFirstNameEnglish(String firstNameEnglish) {
            this.firstNameEnglish = firstNameEnglish;
        }

        public String getLastNameEnglish() {
            return lastNameEnglish;
        }

        public void setLastNameEnglish(String lastNameEnglish) {
            this.lastNameEnglish = lastNameEnglish;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getIdNo() {
            return idNo;
        }

        public void setIdNo(String idNo) {
            this.idNo = idNo;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getPosition() {
            return position;
        }

        public void setPosition(String position) {
            this.position = position;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public Double getBasicSalary() {
            return basicSalary;
        }

        public void setBasicSalary(Double basicSalary) {
            this.basicSalary = basicSalary;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(String dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }

        public String getPhoneNumber() {
            return phoneNumber;
        }

        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getJoinDate() {
            return joinDate;
        }

        public void setJoinDate(String joinDate) {
            this.joinDate = joinDate;
        }

        public String getContractType() {
            return contractType;
        }

        public void setContractType(String contractType) {
            this.contractType = contractType;
        }

        public String getBankName() {
            return bankName;
        }

        public void setBankName(String bankName) {
            this.bankName = bankName;
        }

        public String getBankAccountNumber() {
            return bankAccountNumber;
        }

        public void setBankAccountNumber(String bankAccountNumber) {
            this.bankAccountNumber = bankAccountNumber;
        }

        public String getEmergencyContactName() {
            return emergencyContactName;
        }

        public void setEmergencyContactName(String emergencyContactName) {
            this.emergencyContactName = emergencyContactName;
        }

        public String getEmergencyContact() {
            return emergencyContact;
        }

        public void setEmergencyContact(String emergencyContact) {
            this.emergencyContact = emergencyContact;
        }

        public String getEmergencyContactPhone() {
            return emergencyContactPhone;
        }

        public void setEmergencyContactPhone(String emergencyContactPhone) {
            this.emergencyContactPhone = emergencyContactPhone;
        }

        public String getPhoto() {
            return photo;
        }

        public void setPhoto(String photo) {
            this.photo = photo;
        }

        public String getFirstNameKhmer() {
            return firstNameKhmer;
        }

        public void setFirstNameKhmer(String firstNameKhmer) {
            this.firstNameKhmer = firstNameKhmer;
        }

        public String getLastNameKhmer() {
            return lastNameKhmer;
        }

        public void setLastNameKhmer(String lastNameKhmer) {
            this.lastNameKhmer = lastNameKhmer;
        }

        public Object getCustomFields() {
            return customFields;
        }

        public void setCustomFields(Object customFields) {
            this.customFields = customFields;
        }

        public String getPhotoIdAttachment() {
            return photoIdAttachment;
        }

        public void setPhotoIdAttachment(String photoIdAttachment) {
            this.photoIdAttachment = photoIdAttachment;
        }

        public String getContractAttachment() {
            return contractAttachment;
        }

        public void setContractAttachment(String contractAttachment) {
            this.contractAttachment = contractAttachment;
        }

        public String getIdPoorAttachment() {
            return idPoorAttachment;
        }

        public void setIdPoorAttachment(String idPoorAttachment) {
            this.idPoorAttachment = idPoorAttachment;
        }

        public String getCvAttachment() {
            return cvAttachment;
        }

        public void setCvAttachment(String cvAttachment) {
            this.cvAttachment = cvAttachment;
        }

        public String getBiometricStatus() {
            return biometricStatus;
        }

        public void setBiometricStatus(String biometricStatus) {
            this.biometricStatus = biometricStatus;
        }

        public String getBiometricId() {
            return biometricId;
        }

        public void setBiometricId(String biometricId) {
            this.biometricId = biometricId;
        }
    }
}

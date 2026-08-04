package com.mtp.api.services;

import com.mtp.api.dtos.EmployeeDTO;
import com.mtp.api.dtos.UserLinkDTO;
import com.mtp.api.events.MtpEvents;
import com.mtp.api.models.Employee;
import com.mtp.api.repositories.DepartmentRepository;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.PositionRepository;
import com.mtp.api.repositories.SystemSettingRepository;
import com.mtp.api.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private AuditLogService auditLogService;

    public Map<String, String> generateStaffId() {
        String format = systemSettingRepository.findById("HR_STAFF_ID_FORMAT")
                .map(com.mtp.api.models.SystemSetting::getValue)
                .orElse("EMP-{YYYY}-{SEQ}");

        Integer maxId = employeeRepository.findMaxId();
        int nextId = (maxId != null ? maxId : 0) + 1;
        String seq = String.format("%04d", nextId);
        String year = String.valueOf(Year.now().getValue());

        String generatedId = format.replace("{SEQ}", seq).replace("{YYYY}", year);

        Map<String, String> response = new HashMap<>();
        response.put("idNo", generatedId);
        return response;
    }

    public List<UserLinkDTO> getLinkCandidates() {
        return userRepository.findUsersNotLinkedToEmployee()
                .stream()
                .map(u -> new UserLinkDTO(
                        u.getId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getEmail(),
                        u.getAvatarUrl(),
                        u.getUserName(),
                        u.getRoles() == null ? Collections.emptyList()
                                : u.getRoles().stream()
                                        .map(r -> r.getName())
                                        .collect(Collectors.toList())))
                .collect(Collectors.toList());
    }

    public Optional<Employee> getCurrentEmployeeProfile(String username) {
        log.info("Fetching profile for currently logged-in user from DB: {}", username);
        var userOpt = userRepository.findByUserName(username);
        String email = userOpt.map(com.mtp.api.models.User::getEmail).orElse(username);

        Optional<Employee> emp = employeeRepository.findByEmailIgnoreCase(email);
        if (emp.isPresent()) return emp;

        Optional<Employee> byUsername = employeeRepository.findByEmailIgnoreCase(username);
        if (byUsername.isPresent()) return byUsername;

        return Optional.empty();
    }

    @Transactional
    public Employee createEmployee(EmployeeDTO dto) {
        log.info("Creating employee: {} {}", dto.getFirstNameEnglish(), dto.getLastNameEnglish());

        if (employeeRepository.findByIdNo(dto.getIdNo()).isPresent()) {
            throw new org.springframework.dao.DataIntegrityViolationException(
                    "Duplicate employee ID number: " + dto.getIdNo());
        }

        Employee employee = new Employee();
        updateEmployeeFromDTO(employee, dto);
        Employee saved = employeeRepository.save(employee);

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

    @Transactional
    public Optional<Employee> updateEmployee(Integer id, EmployeeDTO dto) {
        log.info("Updating employee ID: {}", id);
        return employeeRepository.findById(id).map(e -> {
            updateEmployeeFromDTO(e, dto);
            Employee saved = employeeRepository.save(e);
            log.info("Employee ID {} updated successfully", id);
            auditLogService.logActivity("Updated Employee",
                    saved.getFirstNameEnglish() + " " + saved.getLastNameEnglish() + " (" + saved.getIdNo() + ")",
                    "info");
            return saved;
        });
    }

    public void updateEmployeeFromDTO(Employee e, EmployeeDTO dto) {
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

        if (dto.getCustomFields() != null) {
            try {
                e.setCustomFields(
                        new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(dto.getCustomFields()));
            } catch (Exception ex) {
                log.error("Failed to serialize custom fields", ex);
            }
        }

        if (dto.getPhoto() != null && dto.getPhoto().startsWith("data:image")) {
            try {
                String imageUrl = imageUploadService.uploadBase64Image(dto.getPhoto(), "employees");
                e.setPhoto(imageUrl);
            } catch (Exception ex) {
                log.error("Cloudinary upload failed for employee photo", ex);
                e.setPhoto(dto.getPhoto());
            }
        } else {
            e.setPhoto(dto.getPhoto());
        }

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
                    ? LocalDate.parse(dto.getDateOfBirth())
                    : null);
            e.setJoinDate(dto.getJoinDate() != null && !dto.getJoinDate().isEmpty()
                    ? LocalDate.parse(dto.getJoinDate())
                    : null);
            e.setContractStartDate(dto.getContractStartDate() != null && !dto.getContractStartDate().isEmpty()
                    ? LocalDate.parse(dto.getContractStartDate())
                    : null);
            e.setContractEndDate(dto.getContractEndDate() != null && !dto.getContractEndDate().isEmpty()
                    ? LocalDate.parse(dto.getContractEndDate())
                    : null);
            e.setProbationEndDate(dto.getProbationEndDate() != null && !dto.getProbationEndDate().isEmpty()
                    ? LocalDate.parse(dto.getProbationEndDate())
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
}

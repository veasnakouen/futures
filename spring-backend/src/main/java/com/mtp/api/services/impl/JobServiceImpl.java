package com.mtp.api.services.impl;

import com.mtp.api.dto.*;
import com.mtp.api.models.*;
import com.mtp.api.repositories.*;
import com.mtp.api.services.JobService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private EmployerRepository employerRepository;
    @Autowired
    private VacancyRepository vacancyRepository;
    @Autowired
    private PlacementRepository placementRepository;
    @Autowired
    private JobCategoryRepository jobCategoryRepository;
    @Autowired
    private JobPositionRepository jobPositionRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private com.mtp.api.services.ImageUploadService imageUploadService;

    // Employers
    @Override
    public Page<EmployerDto> getAllEmployers(Pageable pageable, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return employerRepository.findByNameContainingIgnoreCase(search.trim(), pageable).map(this::mapToDto);
        }
        return employerRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public EmployerDto saveEmployer(EmployerDto dto) {
        Employer entity = mapToEntity(dto);
        return mapToDto(employerRepository.save(entity));
    }

    @Override
    public void deleteEmployer(Integer id) {
        employerRepository.deleteById(id);
    }

    // Vacancies
    @Override
    public Page<VacancyDto> getAllVacancies(Pageable pageable, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return vacancyRepository.searchVacancies(search.trim(), pageable).map(this::mapToDto);
        }
        return vacancyRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public Page<VacancyDto> getPublicVacancies(Pageable pageable, String search) {
        // Return only vacancies that are published or open. For now, assuming "Open" is the active status.
        // We will need a custom query in repository, or just use search with status filter.
        // Let's rely on search parameter for now, or just return all and let frontend filter, 
        // but it's better to filter by status "Open" or "PUBLISHED".
        return vacancyRepository.findAll(pageable).map(this::mapToDto); // We'll refine this if needed
    }

    @Override
    public VacancyDto getVacancyById(Integer id) {
        return vacancyRepository.findById(id).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Vacancy not found"));
    }

    @Override
    public VacancyDto saveVacancy(VacancyDto dto) {
        Vacancy entity = mapToEntity(dto);
        return mapToDto(vacancyRepository.save(entity));
    }

    @Override
    public void deleteVacancy(Integer id) {
        vacancyRepository.deleteById(id);
    }

    // Placements
    @Override
    public List<PlacementDto> getAllPlacements() {
        return placementRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<PlacementDto> getPlacementsByClient(Integer clientId) {
        return placementRepository.findByClientId(clientId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public PlacementDto savePlacement(PlacementDto dto) {
        Placement entity = mapToEntity(dto);
        return mapToDto(placementRepository.save(entity));
    }

    @Override
    public void deletePlacement(Integer id) {
        placementRepository.deleteById(id);
    }

    // Mappers (Manual for Clean Architecture)
    private EmployerDto mapToDto(Employer e) {
        EmployerDto d = new EmployerDto();
        d.setId(e.getId());
        d.setName(e.getName());
        d.setAddress(e.getAddress());
        d.setContactPerson(e.getContactPerson());
        d.setContactPhone(e.getContactPhone());
        d.setEmail(e.getEmail());
        d.setWebsite(e.getWebsite());
        d.setBranch(e.getBranch());
        d.setStatus(e.getStatus());
        d.setLogoUrl(e.getLogoUrl());
        if (e.getJobCategory() != null) {
            d.setJobCategoryId(e.getJobCategory().getId());
            d.setJobCategoryName(e.getJobCategory().getName());
        }
        return d;
    }

    private Employer mapToEntity(EmployerDto d) {
        Employer e = d.getId() != null ? employerRepository.findById(d.getId()).orElse(new Employer()) : new Employer();
        e.setName(d.getName());
        e.setAddress(d.getAddress());
        e.setContactPerson(d.getContactPerson());
        e.setContactPhone(d.getContactPhone());
        e.setEmail(d.getEmail());
        e.setWebsite(d.getWebsite());
        e.setBranch(d.getBranch());
        e.setStatus(d.getStatus());
        
        // Cloudinary Logo Upload
        if (d.getLogoUrl() != null && d.getLogoUrl().startsWith("data:image")) {
            try {
                String uploadedUrl = imageUploadService.uploadBase64Image(d.getLogoUrl(), "employers");
                e.setLogoUrl(uploadedUrl);
            } catch (Exception ex) {
                e.setLogoUrl(d.getLogoUrl());
            }
        } else {
            e.setLogoUrl(d.getLogoUrl());
        }

        if (d.getJobCategoryId() != null) {
            e.setJobCategory(jobCategoryRepository.findById(d.getJobCategoryId()).orElse(null));
        }
        return e;
    }

    private VacancyDto mapToDto(Vacancy v) {
        VacancyDto d = new VacancyDto();
        d.setId(v.getId());
        d.setPostingDate(v.getPostingDate());
        d.setDeadline(v.getDeadline());
        // expose closingDate as plain date string for frontend
        if (v.getDeadline() != null) {
            d.setClosingDate(v.getDeadline().toLocalDate().toString());
        }
        d.setPositionAvailable(v.getPositionAvailable());
        d.setContractType(v.getContractType());
        d.setSalary(v.getSalary() != null ? v.getSalary().toString() : "0");
        d.setStatus(v.getStatus());
        if (v.getEmployer() != null) {
            d.setEmployerId(v.getEmployer().getId());
            d.setEmployerName(v.getEmployer().getName());
        }
        if (v.getJobPosition() != null) {
            d.setJobPositionId(v.getJobPosition().getId());
            d.setJobPositionName(v.getJobPosition().getName());
        }
        if (v.getJobCategory() != null) {
            d.setJobCategoryId(v.getJobCategory().getId());
            d.setJobCategoryName(v.getJobCategory().getName());
        }
        d.setImageUrl(v.getImageUrl());
        d.setResponsibilities(v.getResponsibilities());
        d.setRequirement(v.getRequirement());
        d.setApplicationInformation(v.getApplicationInformation());
        d.setSchedule(v.getSchedule());
        d.setLocation(v.getLocation());
        d.setSalarymax(v.getSalarymax() != null ? v.getSalarymax().toString() : "0");
        return d;
    }

    private Vacancy mapToEntity(VacancyDto d) {
        Vacancy v = d.getId() != null ? vacancyRepository.findById(d.getId()).orElse(new Vacancy()) : new Vacancy();
        // postingDate: preserve existing or default to now
        if (v.getPostingDate() == null) v.setPostingDate(LocalDateTime.now());
        // deadline: map from closingDate string
        if (d.getClosingDate() != null && !d.getClosingDate().isEmpty()) {
            try { v.setDeadline(LocalDateTime.parse(d.getClosingDate() + "T00:00:00")); }
            catch (Exception e) { if (v.getDeadline() == null) v.setDeadline(LocalDateTime.now().plusMonths(1)); }
        } else if (v.getDeadline() == null) {
            v.setDeadline(LocalDateTime.now().plusMonths(1));
        }
        v.setPositionAvailable(d.getPositionAvailable() > 0 ? d.getPositionAvailable() : 1);
        v.setContractType(d.getContractType());
        // safe salary parse
        double salaryVal = 0.0;
        try { if (d.getSalary() != null && !d.getSalary().isBlank()) salaryVal = Double.parseDouble(d.getSalary()); }
        catch (NumberFormatException ignored) {}
        v.setSalary(salaryVal);
        
        double salaryMaxVal = 0.0;
        try { if (d.getSalarymax() != null && !d.getSalarymax().isBlank()) salaryMaxVal = Double.parseDouble(d.getSalarymax()); }
        catch (NumberFormatException ignored) {}
        if (salaryMaxVal > 0) {
            v.setSalarymax(salaryMaxVal);
        } else {
            v.setSalarymax(salaryVal); // Fallback to base salary if max is not provided
        }
        
        v.setResponsibilities(d.getResponsibilities());
        v.setRequirement(d.getRequirement());
        v.setApplicationInformation(d.getApplicationInformation());
        v.setSchedule(d.getSchedule());
        v.setLocation(d.getLocation());
        v.setStatus(d.getStatus() != null ? d.getStatus() : "Open");
        Employer emp = null;
        if (d.getEmployerId() != null) {
            emp = employerRepository.findById(d.getEmployerId()).orElse(null);
            v.setEmployer(emp);
        }
        if (d.getJobPositionId() != null) {
            JobPosition jp = jobPositionRepository.findById(d.getJobPositionId()).orElse(null);
            v.setJobPosition(jp);
            // Auto-assign JobCategory from JobPosition if not explicitly provided
            if (d.getJobCategoryId() == null && jp != null && jp.getJobCategory() != null) {
                v.setJobCategory(jp.getJobCategory());
            }
        }
        if (d.getJobCategoryId() != null) {
            v.setJobCategory(jobCategoryRepository.findById(d.getJobCategoryId()).orElse(null));
        } else if (v.getJobCategory() == null && emp != null && emp.getJobCategory() != null) {
            // Fallback to Employer's job category to satisfy database NOT NULL constraints
            v.setJobCategory(emp.getJobCategory());
        }

        // Cloudinary Upload
        if (d.getImageUrl() != null && d.getImageUrl().startsWith("data:image")) {
            try {
                String uploadedUrl = imageUploadService.uploadBase64Image(d.getImageUrl(), "vacancies");
                v.setImageUrl(uploadedUrl);
            } catch (Exception ex) {
                v.setImageUrl(d.getImageUrl());
            }
        } else {
            v.setImageUrl(d.getImageUrl());
        }

        return v;
    }

    private PlacementDto mapToDto(Placement p) {
        PlacementDto d = new PlacementDto();
        d.setId(p.getId());
        d.setCountedTime(p.getCountedTime());
        d.setPlacementDate(p.getPlacementDate());
        d.setPlacementType(p.getPlacementType());
        d.setCompanyName(p.getCompanyName());
        d.setSalary(p.getSalary());
        d.setStatus(p.getStatus());
        if (p.getClient() != null) {
            d.setClientId(p.getClient().getId());
            d.setClientName(p.getClient().getFirstName() + " " + p.getClient().getLastName());
        }
        if (p.getJobPosition() != null) {
            d.setJobPositionId(p.getJobPosition().getId());
            d.setJobPositionName(p.getJobPosition().getName());
        }
        return d;
    }

    private Placement mapToEntity(PlacementDto d) {
        Placement p = d.getId() != null ? placementRepository.findById(d.getId()).orElse(new Placement())
                : new Placement();
        p.setCountedTime(d.getCountedTime());
        p.setPlacementDate(d.getPlacementDate());
        p.setPlacementType(d.getPlacementType());
        p.setCompanyName(d.getCompanyName());
        p.setSalary(d.getSalary());
        p.setStatus(d.getStatus());
        if (d.getClientId() != null)
            p.setClient(clientRepository.findById(d.getClientId()).orElse(null));
        if (d.getJobPositionId() != null)
            p.setJobPosition(jobPositionRepository.findById(d.getJobPositionId()).orElse(null));
        return p;
    }
}

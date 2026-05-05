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
    @Cacheable(value = "employers", key = "#pageable")
    public Page<EmployerDto> getAllEmployers(Pageable pageable) {
        return employerRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @CacheEvict(value = "employers", allEntries = true)
    public EmployerDto saveEmployer(EmployerDto dto) {
        Employer entity = mapToEntity(dto);
        return mapToDto(employerRepository.save(entity));
    }

    @Override
    @CacheEvict(value = "employers", allEntries = true)
    public void deleteEmployer(Integer id) {
        employerRepository.deleteById(id);
    }

    // Vacancies
    @Override
    @Cacheable(value = "vacancies", key = "#pageable")
    public Page<VacancyDto> getAllVacancies(Pageable pageable) {
        return vacancyRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @CacheEvict(value = "vacancies", allEntries = true)
    public VacancyDto saveVacancy(VacancyDto dto) {
        Vacancy entity = mapToEntity(dto);
        return mapToDto(vacancyRepository.save(entity));
    }

    @Override
    @CacheEvict(value = "vacancies", allEntries = true)
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
        if (v.getSalarymax() == null || v.getSalarymax() == 0.0) v.setSalarymax(salaryVal);
        v.setStatus(d.getStatus() != null ? d.getStatus() : "Open");
        if (d.getEmployerId() != null)
            v.setEmployer(employerRepository.findById(d.getEmployerId()).orElse(null));
        if (d.getJobPositionId() != null)
            v.setJobPosition(jobPositionRepository.findById(d.getJobPositionId()).orElse(null));
        if (d.getJobCategoryId() != null)
            v.setJobCategory(jobCategoryRepository.findById(d.getJobCategoryId()).orElse(null));

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

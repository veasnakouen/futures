package com.mtp.api.mappers;

import com.mtp.api.dto.EmployerDto;
import com.mtp.api.dto.PlacementDto;
import com.mtp.api.dto.VacancyDto;
import com.mtp.api.models.Employer;
import com.mtp.api.models.JobPosition;
import com.mtp.api.models.Placement;
import com.mtp.api.models.Vacancy;
import com.mtp.api.repositories.ClientRepository;
import com.mtp.api.repositories.EmployerRepository;
import com.mtp.api.repositories.JobCategoryRepository;
import com.mtp.api.repositories.JobPositionRepository;
import com.mtp.api.repositories.PlacementRepository;
import com.mtp.api.repositories.VacancyRepository;
import com.mtp.api.services.ImageUploadService;

import java.time.LocalDateTime;

public class JobMapper {

    public static EmployerDto mapToDto(Employer e) {
        if (e == null) return null;
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

    public static Employer mapToEntity(EmployerDto d, EmployerRepository employerRepository, JobCategoryRepository jobCategoryRepository, ImageUploadService imageUploadService) {
        Employer e = d.getId() != null ? employerRepository.findById(d.getId()).orElse(new Employer()) : new Employer();
        e.setName(d.getName());
        e.setAddress(d.getAddress());
        e.setContactPerson(d.getContactPerson());
        e.setContactPhone(d.getContactPhone());
        e.setEmail(d.getEmail());
        e.setWebsite(d.getWebsite());
        e.setBranch(d.getBranch());
        e.setStatus(d.getStatus());

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

    public static VacancyDto mapToDto(Vacancy v) {
        if (v == null) return null;
        VacancyDto d = new VacancyDto();
        d.setId(v.getId());
        d.setPostingDate(v.getPostingDate());
        d.setDeadline(v.getDeadline());
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

    public static Vacancy mapToEntity(VacancyDto d, VacancyRepository vacancyRepository, EmployerRepository employerRepository, JobPositionRepository jobPositionRepository, JobCategoryRepository jobCategoryRepository, ImageUploadService imageUploadService) {
        Vacancy v = d.getId() != null ? vacancyRepository.findById(d.getId()).orElse(new Vacancy()) : new Vacancy();
        if (v.getPostingDate() == null) v.setPostingDate(LocalDateTime.now());
        if (d.getClosingDate() != null && !d.getClosingDate().isEmpty()) {
            try { v.setDeadline(LocalDateTime.parse(d.getClosingDate() + "T00:00:00")); }
            catch (Exception e) { if (v.getDeadline() == null) v.setDeadline(LocalDateTime.now().plusMonths(1)); }
        } else if (v.getDeadline() == null) {
            v.setDeadline(LocalDateTime.now().plusMonths(1));
        }
        v.setPositionAvailable(d.getPositionAvailable() > 0 ? d.getPositionAvailable() : 1);
        v.setContractType(d.getContractType());
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
            v.setSalarymax(salaryVal);
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
            if (d.getJobCategoryId() == null && jp != null && jp.getJobCategory() != null) {
                v.setJobCategory(jp.getJobCategory());
            }
        }
        if (d.getJobCategoryId() != null) {
            v.setJobCategory(jobCategoryRepository.findById(d.getJobCategoryId()).orElse(null));
        } else if (v.getJobCategory() == null && emp != null && emp.getJobCategory() != null) {
            v.setJobCategory(emp.getJobCategory());
        }

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

    public static PlacementDto mapToDto(Placement p) {
        if (p == null) return null;
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

    public static Placement mapToEntity(PlacementDto d, PlacementRepository placementRepository, ClientRepository clientRepository, JobPositionRepository jobPositionRepository) {
        Placement p = d.getId() != null ? placementRepository.findById(d.getId()).orElse(new Placement()) : new Placement();
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

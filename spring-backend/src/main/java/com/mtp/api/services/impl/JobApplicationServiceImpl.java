package com.mtp.api.services.impl;

import com.mtp.api.dto.JobApplicationDto;
import com.mtp.api.models.Client;
import com.mtp.api.models.JobApplication;
import com.mtp.api.models.Vacancy;
import com.mtp.api.models.Placement;
import com.mtp.api.repositories.ClientRepository;
import com.mtp.api.repositories.JobApplicationRepository;
import com.mtp.api.repositories.VacancyRepository;
import com.mtp.api.repositories.PlacementRepository;
import com.mtp.api.services.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private VacancyRepository vacancyRepository;

    @Autowired
    private PlacementRepository placementRepository;

    @Override
    public JobApplicationDto createApplication(JobApplicationDto dto) {
        Vacancy vacancy = vacancyRepository.findById(dto.getVacancyId())
                .orElseThrow(() -> new RuntimeException("Vacancy not found"));

        Client client;
        if (dto.getClientId() != null) {
            client = clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
        } else {
            // Check if client exists by email (simplified) or create new
            client = new Client();
            String[] names = dto.getClientName() != null ? dto.getClientName().split(" ", 2) : new String[]{"Guest", "User"};
            client.setFirstName(names[0]);
            client.setLastName(names.length > 1 ? names[1] : "");
            client.setEmail(dto.getClientEmail());
            client.setContactPhone("N/A");
            client.setBranch("ONLINE");
            client.setAspUserId("GUEST");
            client.setClientCode("GUEST-" + System.currentTimeMillis());
            client = clientRepository.save(client);
        }

        JobApplication application = new JobApplication();
        application.setClient(client);
        application.setVacancy(vacancy);
        application.setAppliedDate(LocalDateTime.now());
        application.setStatus("PENDING");
        application.setCoverLetter(dto.getCoverLetter());
        application.setCvUrl(dto.getCvUrl());

        JobApplication saved = jobApplicationRepository.save(application);
        return mapToDto(saved);
    }

    @Override
    public JobApplicationDto updateApplicationStatus(Integer id, String status) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("JobApplication not found"));
        application.setStatus(status);
        JobApplication updated = jobApplicationRepository.save(application);

        if ("HIRED".equalsIgnoreCase(status)) {
            Placement placement = new Placement();
            placement.setClient(application.getClient());
            placement.setClientId(application.getClient().getId());
            if (application.getVacancy().getJobPosition() != null) {
                placement.setJobPosition(application.getVacancy().getJobPosition());
                placement.setJobPositionId(application.getVacancy().getJobPosition().getId());
            }
            placement.setPlacementDate(LocalDateTime.now());
            placement.setPlacementType(application.getVacancy().getContractType());
            placement.setCompanyName(application.getVacancy().getEmployer() != null ? application.getVacancy().getEmployer().getName() : "");
            placement.setSalary(application.getVacancy().getSalary() != null ? application.getVacancy().getSalary().toString() : "0");
            placement.setStatus("Active");
            placementRepository.save(placement);
        }

        return mapToDto(updated);
    }

    @Override
    public JobApplicationDto getApplicationById(Integer id) {
        return jobApplicationRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("JobApplication not found"));
    }

    @Override
    public Page<JobApplicationDto> getApplicationsByVacancyId(Integer vacancyId, Pageable pageable) {
        return jobApplicationRepository.findByVacancyId(vacancyId, pageable)
                .map(this::mapToDto);
    }

    @Override
    public Page<JobApplicationDto> getApplicationsByClientId(Integer clientId, Pageable pageable) {
        return jobApplicationRepository.findByClientId(clientId, pageable)
                .map(this::mapToDto);
    }

    @Override
    public Page<JobApplicationDto> getApplicationsByEmployerId(Integer employerId, Pageable pageable) {
        return jobApplicationRepository.findByVacancy_EmployerId(employerId, pageable)
                .map(this::mapToDto);
    }

    @Override
    public void deleteApplication(Integer id) {
        jobApplicationRepository.deleteById(id);
    }

    private JobApplicationDto mapToDto(JobApplication entity) {
        JobApplicationDto dto = new JobApplicationDto();
        dto.setId(entity.getId());
        dto.setClientId(entity.getClient().getId());
        dto.setVacancyId(entity.getVacancy().getId());
        dto.setAppliedDate(entity.getAppliedDate());
        dto.setStatus(entity.getStatus());
        dto.setCoverLetter(entity.getCoverLetter());
        dto.setCvUrl(entity.getCvUrl());
        
        dto.setClientName(entity.getClient().getFirstName() + " " + entity.getClient().getLastName());
        dto.setClientEmail(entity.getClient().getEmail());
        dto.setVacancyTitle(entity.getVacancy().getJobPosition() != null ? entity.getVacancy().getJobPosition().getName() : "");
        dto.setEmployerName(entity.getVacancy().getEmployer() != null ? entity.getVacancy().getEmployer().getName() : "");
        return dto;
    }
}

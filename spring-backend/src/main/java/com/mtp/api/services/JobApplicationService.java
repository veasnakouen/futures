package com.mtp.api.services;

import com.mtp.api.dto.JobApplicationDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobApplicationService {
    JobApplicationDto createApplication(JobApplicationDto jobApplicationDto);
    JobApplicationDto updateApplicationStatus(Integer id, String status);
    JobApplicationDto getApplicationById(Integer id);
    Page<JobApplicationDto> getApplicationsByVacancyId(Integer vacancyId, Pageable pageable);
    Page<JobApplicationDto> getApplicationsByClientId(Integer clientId, Pageable pageable);
    Page<JobApplicationDto> getApplicationsByEmployerId(Integer employerId, Pageable pageable);
    Page<JobApplicationDto> getAllApplications(Pageable pageable);
    void deleteApplication(Integer id);
}

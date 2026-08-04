package com.mtp.api.services.impl;

import com.mtp.api.dto.*;
import com.mtp.api.mappers.JobMapper;
import com.mtp.api.models.*;
import com.mtp.api.repositories.*;
import com.mtp.api.services.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
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
            return employerRepository.findByNameContainingIgnoreCase(search.trim(), pageable).map(JobMapper::mapToDto);
        }
        return employerRepository.findAll(pageable).map(JobMapper::mapToDto);
    }

    @Override
    @Transactional
    public EmployerDto saveEmployer(EmployerDto dto) {
        Employer entity = JobMapper.mapToEntity(dto, employerRepository, jobCategoryRepository, imageUploadService);
        return JobMapper.mapToDto(employerRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteEmployer(Integer id) {
        employerRepository.deleteById(id);
    }

    // Vacancies
    @Override
    public Page<VacancyDto> getAllVacancies(Pageable pageable, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return vacancyRepository.searchVacancies(search.trim(), pageable).map(JobMapper::mapToDto);
        }
        return vacancyRepository.findAll(pageable).map(JobMapper::mapToDto);
    }

    @Override
    public Page<VacancyDto> getPublicVacancies(Pageable pageable, String search) {
        return vacancyRepository.findAll(pageable).map(JobMapper::mapToDto);
    }

    @Override
    public VacancyDto getVacancyById(Integer id) {
        return vacancyRepository.findById(id).map(JobMapper::mapToDto)
                .orElseThrow(() -> new RuntimeException("Vacancy not found"));
    }

    @Override
    @Transactional
    public VacancyDto saveVacancy(VacancyDto dto) {
        Vacancy entity = JobMapper.mapToEntity(dto, vacancyRepository, employerRepository, jobPositionRepository, jobCategoryRepository, imageUploadService);
        return JobMapper.mapToDto(vacancyRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteVacancy(Integer id) {
        vacancyRepository.deleteById(id);
    }

    // Placements
    @Override
    public List<PlacementDto> getAllPlacements() {
        return placementRepository.findAll().stream().map(JobMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<PlacementDto> getPlacementsByClient(Integer clientId) {
        return placementRepository.findByClientId(clientId).stream().map(JobMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PlacementDto savePlacement(PlacementDto dto) {
        Placement entity = JobMapper.mapToEntity(dto, placementRepository, clientRepository, jobPositionRepository);
        return JobMapper.mapToDto(placementRepository.save(entity));
    }

    @Override
    @Transactional
    public void deletePlacement(Integer id) {
        placementRepository.deleteById(id);
    }
}

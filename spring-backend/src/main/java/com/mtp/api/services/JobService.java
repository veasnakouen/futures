package com.mtp.api.services;

import com.mtp.api.dto.EmployerDto;
import com.mtp.api.dto.VacancyDto;
import com.mtp.api.dto.PlacementDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface JobService {
    // Employers
    Page<EmployerDto> getAllEmployers(Pageable pageable, String search);
    EmployerDto saveEmployer(EmployerDto dto);
    void deleteEmployer(Integer id);
    
    // Vacancies
    Page<VacancyDto> getAllVacancies(Pageable pageable, String search);
    Page<VacancyDto> getPublicVacancies(Pageable pageable, String search);
    VacancyDto getVacancyById(Integer id);
    VacancyDto saveVacancy(VacancyDto dto);
    void deleteVacancy(Integer id);
    
    // Placements
    List<PlacementDto> getAllPlacements();
    List<PlacementDto> getPlacementsByClient(Integer clientId);
    PlacementDto savePlacement(PlacementDto dto);
    void deletePlacement(Integer id);
}

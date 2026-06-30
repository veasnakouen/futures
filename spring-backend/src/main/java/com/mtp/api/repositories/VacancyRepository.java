package com.mtp.api.repositories;

import com.mtp.api.models.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Integer> {
    
    @Query("SELECT v.status, COUNT(v) FROM Vacancy v GROUP BY v.status")
    List<Object[]> countByStatus();

    @Query("SELECT v FROM Vacancy v " +
           "LEFT JOIN v.jobPosition jp " +
           "LEFT JOIN v.employer emp " +
           "WHERE :search IS NULL OR :search = '' OR " +
           "LOWER(jp.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(emp.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.location) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.contractType) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Vacancy> searchVacancies(@Param("search") String search, Pageable pageable);
}

package com.mtp.api.repositories;

import com.mtp.api.models.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Integer> {
    Page<Employer> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

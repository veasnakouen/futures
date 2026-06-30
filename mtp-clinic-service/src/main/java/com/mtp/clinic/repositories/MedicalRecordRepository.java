package com.mtp.clinic.repositories;

import com.mtp.clinic.models.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, String> {
    
    @EntityGraph(attributePaths = {"patient", "doctor"})
    Page<MedicalRecord> findAll(Pageable pageable);
}

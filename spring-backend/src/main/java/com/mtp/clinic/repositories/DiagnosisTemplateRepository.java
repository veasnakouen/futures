package com.mtp.clinic.repositories;

import com.mtp.clinic.models.DiagnosisTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiagnosisTemplateRepository extends JpaRepository<DiagnosisTemplate, String> {
}

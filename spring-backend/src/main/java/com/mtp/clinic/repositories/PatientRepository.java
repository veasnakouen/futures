package com.mtp.clinic.repositories;

import com.mtp.clinic.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, String> {
}

package com.mtp.clinic.repositories;

import com.mtp.clinic.models.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    java.util.List<Prescription> findByPatientId(String patientId);
}

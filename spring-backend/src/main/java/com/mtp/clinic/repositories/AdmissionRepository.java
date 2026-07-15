package com.mtp.clinic.repositories;

import com.mtp.clinic.models.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, String> {
    List<Admission> findByPatientId(String patientId);
    List<Admission> findByRoomId(String roomId);
}

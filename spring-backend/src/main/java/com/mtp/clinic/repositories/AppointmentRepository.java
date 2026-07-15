package com.mtp.clinic.repositories;

import com.mtp.clinic.models.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {

    @EntityGraph(attributePaths = { "patient", "provider", "room" })
    Page<Appointment> findAll(Pageable pageable);
}

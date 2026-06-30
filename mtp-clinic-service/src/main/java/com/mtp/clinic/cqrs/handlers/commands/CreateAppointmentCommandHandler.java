package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.CreateAppointmentCommand;
import com.mtp.clinic.cqrs.dto.AppointmentQueryResultDto;
import com.mtp.clinic.cqrs.mappers.AppointmentMapper;
import com.mtp.clinic.models.Appointment;
import com.mtp.clinic.repositories.AppointmentRepository;
import com.mtp.clinic.repositories.PatientRepository;
import com.mtp.clinic.repositories.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateAppointmentCommandHandler {

    private final AppointmentRepository repository;
    private final PatientRepository patientRepository;
    private final ProviderRepository doctorRepository;
    private final AppointmentMapper mapper;

    @Transactional
    public AppointmentQueryResultDto handle(CreateAppointmentCommand command) {
        Appointment entity = mapper.toEntity(command);
        
        entity.setPatient(patientRepository.findById(command.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found")));
                
        entity.setProvider(doctorRepository.findById(command.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found")));
                
        Appointment savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}

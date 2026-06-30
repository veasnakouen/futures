package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.UpdateAppointmentCommand;
import com.mtp.clinic.cqrs.dto.AppointmentQueryResultDto;
import com.mtp.clinic.cqrs.mappers.AppointmentMapper;
import com.mtp.clinic.repositories.AppointmentRepository;
import com.mtp.clinic.repositories.PatientRepository;
import com.mtp.clinic.repositories.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateAppointmentCommandHandler {

    private final AppointmentRepository repository;
    private final PatientRepository patientRepository;
    private final ProviderRepository doctorRepository;
    private final AppointmentMapper mapper;

    @Transactional
    public Optional<AppointmentQueryResultDto> handle(UpdateAppointmentCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setAppointmentDate(command.getAppointmentDate());
            entity.setAppointmentTime(command.getAppointmentTime());
            entity.setStatus(command.getStatus());
            entity.setNotes(command.getNotes());
            entity.setPatient(patientRepository.findById(command.getPatientId())
                    .orElseThrow(() -> new IllegalArgumentException("Patient not found")));
                    
            entity.setProvider(doctorRepository.findById(command.getDoctorId())
                    .orElseThrow(() -> new IllegalArgumentException("Doctor not found")));
                    
            return mapper.toDto(repository.save(entity));
        });
    }
}

package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.CreateMedicalRecordCommand;
import com.mtp.clinic.cqrs.dto.MedicalRecordQueryResultDto;
import com.mtp.clinic.cqrs.mappers.MedicalRecordMapper;
import com.mtp.clinic.models.MedicalRecord;
import com.mtp.clinic.repositories.MedicalRecordRepository;
import com.mtp.clinic.repositories.PatientRepository;
import com.mtp.clinic.repositories.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateMedicalRecordCommandHandler {

    private final MedicalRecordRepository repository;
    private final PatientRepository patientRepository;
    private final ProviderRepository doctorRepository;
    private final MedicalRecordMapper mapper;

    @Transactional
    public MedicalRecordQueryResultDto handle(CreateMedicalRecordCommand command) {
        MedicalRecord entity = mapper.toEntity(command);
        
        entity.setPatient(patientRepository.findById(command.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found")));
                
        entity.setDoctor(doctorRepository.findById(command.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found")));
                
        MedicalRecord savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}

package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.UpdateMedicalRecordCommand;
import com.mtp.clinic.cqrs.dto.MedicalRecordQueryResultDto;
import com.mtp.clinic.cqrs.mappers.MedicalRecordMapper;
import com.mtp.clinic.repositories.MedicalRecordRepository;
import com.mtp.clinic.repositories.PatientRepository;
import com.mtp.clinic.repositories.ProviderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateMedicalRecordCommandHandler {

    private final MedicalRecordRepository repository;
    private final PatientRepository patientRepository;
    private final ProviderRepository doctorRepository;
    private final MedicalRecordMapper mapper;

    @Transactional
    public Optional<MedicalRecordQueryResultDto> handle(UpdateMedicalRecordCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setRecordDate(command.getRecordDate());
            entity.setDiagnosis(command.getDiagnosis());
            entity.setTreatment(command.getTreatment());
            entity.setPrescription(command.getPrescription());
            entity.setPatient(patientRepository.findById(command.getPatientId())
                    .orElseThrow(() -> new IllegalArgumentException("Patient not found")));
                    
            entity.setDoctor(doctorRepository.findById(command.getDoctorId())
                    .orElseThrow(() -> new IllegalArgumentException("Doctor not found")));
                    
            return mapper.toDto(repository.save(entity));
        });
    }
}

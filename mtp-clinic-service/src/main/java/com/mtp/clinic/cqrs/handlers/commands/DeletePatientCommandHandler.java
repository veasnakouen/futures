package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.DeletePatientCommand;
import com.mtp.clinic.repositories.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeletePatientCommandHandler {

    private final PatientRepository repository;

    @Transactional
    public void handle(DeletePatientCommand command) {
        if (repository.existsById(command.getId())) {
            repository.deleteById(command.getId());
        }
    }
}

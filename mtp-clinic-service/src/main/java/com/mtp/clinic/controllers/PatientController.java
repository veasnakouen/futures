package com.mtp.clinic.controllers;

import com.mtp.clinic.cqrs.commands.*;
import com.mtp.clinic.cqrs.dto.PatientQueryResultDto;
import com.mtp.clinic.cqrs.handlers.commands.*;
import com.mtp.clinic.cqrs.handlers.queries.*;
import com.mtp.clinic.cqrs.queries.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clinic/patients")
@RequiredArgsConstructor
public class PatientController {

    private final CreatePatientCommandHandler createHandler;
    private final UpdatePatientCommandHandler updateHandler;
    private final GetAllPatientsQueryHandler getAllHandler;
    private final GetPatientByIdQueryHandler getByIdHandler;
    private final DeletePatientCommandHandler deleteHandler;

    @GetMapping
    public Page<PatientQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllPatientsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetPatientByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PatientQueryResultDto create(@Valid @RequestBody CreatePatientCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdatePatientCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        deleteHandler.handle(new DeletePatientCommand(id));
        return ResponseEntity.noContent().build();
    }
}

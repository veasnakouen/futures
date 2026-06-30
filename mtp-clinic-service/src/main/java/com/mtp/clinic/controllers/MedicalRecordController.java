package com.mtp.clinic.controllers;

import com.mtp.clinic.cqrs.commands.*;
import com.mtp.clinic.cqrs.dto.MedicalRecordQueryResultDto;
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
@RequestMapping("/api/clinic/records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final CreateMedicalRecordCommandHandler createHandler;
    private final UpdateMedicalRecordCommandHandler updateHandler;
    private final GetAllMedicalRecordsQueryHandler getAllHandler;
    private final GetMedicalRecordByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<MedicalRecordQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllMedicalRecordsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetMedicalRecordByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MedicalRecordQueryResultDto create(@Valid @RequestBody CreateMedicalRecordCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecordQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateMedicalRecordCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

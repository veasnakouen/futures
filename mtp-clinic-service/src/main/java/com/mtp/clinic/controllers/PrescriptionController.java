package com.mtp.clinic.controllers;

import com.mtp.clinic.cqrs.commands.*;
import com.mtp.clinic.cqrs.dto.PrescriptionQueryResultDto;
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
@RequestMapping("/api/clinic/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final CreatePrescriptionCommandHandler createHandler;
    private final UpdatePrescriptionCommandHandler updateHandler;
    private final GetAllPrescriptionsQueryHandler getAllHandler;
    private final GetPrescriptionByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<PrescriptionQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllPrescriptionsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetPrescriptionByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PrescriptionQueryResultDto create(@Valid @RequestBody CreatePrescriptionCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdatePrescriptionCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

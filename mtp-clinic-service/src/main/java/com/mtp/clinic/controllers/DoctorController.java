package com.mtp.clinic.controllers;

import com.mtp.clinic.cqrs.commands.*;
import com.mtp.clinic.cqrs.dto.ProviderQueryResultDto;
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
@RequestMapping("/api/clinic/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final CreateProviderCommandHandler createHandler;
    private final UpdateProviderCommandHandler updateHandler;
    private final GetAllProvidersQueryHandler getAllHandler;
    private final GetProviderByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<ProviderQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllDoctorsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProviderQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetDoctorByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProviderQueryResultDto create(@Valid @RequestBody CreateProviderCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProviderQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateProviderCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

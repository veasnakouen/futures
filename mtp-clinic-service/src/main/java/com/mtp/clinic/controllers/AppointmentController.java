package com.mtp.clinic.controllers;

import com.mtp.clinic.cqrs.commands.*;
import com.mtp.clinic.cqrs.dto.AppointmentQueryResultDto;
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
@RequestMapping("/api/clinic/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final CreateAppointmentCommandHandler createHandler;
    private final UpdateAppointmentCommandHandler updateHandler;
    private final GetAllAppointmentsQueryHandler getAllHandler;
    private final GetAppointmentByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<AppointmentQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllAppointmentsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetAppointmentByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public AppointmentQueryResultDto create(@Valid @RequestBody CreateAppointmentCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateAppointmentCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

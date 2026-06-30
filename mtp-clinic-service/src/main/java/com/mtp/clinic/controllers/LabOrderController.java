package com.mtp.clinic.controllers;

import com.mtp.clinic.cqrs.commands.*;
import com.mtp.clinic.cqrs.dto.LabOrderQueryResultDto;
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
@RequestMapping("/api/clinic/labOrders")
@RequiredArgsConstructor
public class LabOrderController {

    private final CreateLabOrderCommandHandler createHandler;
    private final UpdateLabOrderCommandHandler updateHandler;
    private final GetAllLabOrdersQueryHandler getAllHandler;
    private final GetLabOrderByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<LabOrderQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllLabOrdersQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabOrderQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetLabOrderByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public LabOrderQueryResultDto create(@Valid @RequestBody CreateLabOrderCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabOrderQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateLabOrderCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

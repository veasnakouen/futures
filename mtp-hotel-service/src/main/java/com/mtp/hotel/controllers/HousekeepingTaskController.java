package com.mtp.hotel.controllers;

import com.mtp.hotel.cqrs.commands.*;
import com.mtp.hotel.cqrs.dto.HousekeepingTaskQueryResultDto;
import com.mtp.hotel.cqrs.handlers.commands.*;
import com.mtp.hotel.cqrs.handlers.queries.*;
import com.mtp.hotel.cqrs.queries.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotel/housekeeping-tasks")
@RequiredArgsConstructor
public class HousekeepingTaskController {

    private final CreateHousekeepingTaskCommandHandler createHandler;
    private final UpdateHousekeepingTaskCommandHandler updateHandler;
    private final GetAllHousekeepingTasksQueryHandler getAllHandler;
    private final GetHousekeepingTaskByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<HousekeepingTaskQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllHousekeepingTasksQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HousekeepingTaskQueryResultDto> getById(@PathVariable String id) {
        try {
            Integer numericId = Integer.parseInt(id.replaceAll("[^0-9]", ""));
            return getByIdHandler.handle(new GetHousekeepingTaskByIdQuery(numericId))
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public HousekeepingTaskQueryResultDto create(@Valid @RequestBody CreateHousekeepingTaskCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HousekeepingTaskQueryResultDto> update(@PathVariable String id,
            @Valid @RequestBody UpdateHousekeepingTaskCommand command) {
        try {
            Integer numericId = Integer.parseInt(id.replaceAll("[^0-9]", ""));
            command.setId(numericId);
            return updateHandler.handle(command)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

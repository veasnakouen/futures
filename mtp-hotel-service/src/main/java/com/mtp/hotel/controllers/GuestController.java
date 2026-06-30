package com.mtp.hotel.controllers;

import com.mtp.hotel.cqrs.commands.*;
import com.mtp.hotel.cqrs.dto.GuestQueryResultDto;
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
@RequestMapping("/api/hotel/guests")
@RequiredArgsConstructor
public class GuestController {

    private final CreateGuestCommandHandler createHandler;
    private final UpdateGuestCommandHandler updateHandler;
    private final GetAllGuestsQueryHandler getAllHandler;
    private final GetGuestByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<GuestQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllGuestsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuestQueryResultDto> getById(@PathVariable Integer id) {
        return getByIdHandler.handle(new GetGuestByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public GuestQueryResultDto create(@Valid @RequestBody CreateGuestCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuestQueryResultDto> update(@PathVariable Integer id, @Valid @RequestBody UpdateGuestCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

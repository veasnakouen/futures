package com.mtp.hotel.controllers;

import com.mtp.hotel.cqrs.commands.*;
import com.mtp.hotel.cqrs.dto.BookingQueryResultDto;
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
@RequestMapping("/api/hotel/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final CreateBookingCommandHandler createHandler;
    private final UpdateBookingCommandHandler updateHandler;
    private final GetAllBookingsQueryHandler getAllHandler;
    private final GetBookingByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<BookingQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllBookingsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingQueryResultDto> getById(@PathVariable Integer id) {
        return getByIdHandler.handle(new GetBookingByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public BookingQueryResultDto create(@Valid @RequestBody CreateBookingCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingQueryResultDto> update(@PathVariable Integer id, @Valid @RequestBody UpdateBookingCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

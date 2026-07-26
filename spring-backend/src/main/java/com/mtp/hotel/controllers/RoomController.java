package com.mtp.hotel.controllers;

import com.mtp.hotel.cqrs.commands.*;
import com.mtp.hotel.cqrs.dto.RoomQueryResultDto;
import com.mtp.hotel.cqrs.handlers.commands.*;
import com.mtp.hotel.cqrs.handlers.queries.*;
import com.mtp.hotel.cqrs.queries.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.lang.annotation.ElementType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// @Target({ElementType.TYPE})
// @Retention(RetentionPolicy.RUNTIME)
// @Documented
@RestController
@RequestMapping("/api/hotel/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final CreateRoomCommandHandler createHandler;
    private final UpdateRoomCommandHandler updateHandler;
    private final GetAllRoomsQueryHandler getAllHandler;
    private final GetRoomByIdQueryHandler getByIdHandler;

    private static final java.util.Set<String> ALLOWED_SORT_FIELDS = java.util.Set.of("id", "roomNumber", "roomType", "status", "pricePerNight");

    @GetMapping
    public ResponseEntity<com.mtp.api.dto.ApiResponse<com.mtp.api.dto.pagination.PagedResponse<RoomQueryResultDto>>> getAll(
            @Valid @ModelAttribute com.mtp.api.dto.pagination.PaginationRequest request) {
        Pageable pageable = request.toPageable(ALLOWED_SORT_FIELDS);
        Page<RoomQueryResultDto> pageResult = getAllHandler.handle(new GetAllRoomsQuery(pageable));
        com.mtp.api.dto.pagination.PagedResponse<RoomQueryResultDto> response = com.mtp.api.dto.pagination.PagedResponse.from(pageResult, request.getSortBy(), request.getSortOrder());
        return ResponseEntity.ok(com.mtp.api.dto.ApiResponse.success("Rooms fetched successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomQueryResultDto> getById(@PathVariable Integer id) {
        return getByIdHandler.handle(new GetRoomByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public RoomQueryResultDto create(@Valid @RequestBody CreateRoomCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomQueryResultDto> update(@PathVariable Integer id,
            @Valid @RequestBody UpdateRoomCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

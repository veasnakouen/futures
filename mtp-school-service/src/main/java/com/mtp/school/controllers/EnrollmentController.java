package com.mtp.school.controllers;

import com.mtp.school.cqrs.commands.*;
import com.mtp.school.cqrs.dto.EnrollmentQueryResultDto;
import com.mtp.school.cqrs.handlers.commands.*;
import com.mtp.school.cqrs.handlers.queries.*;
import com.mtp.school.cqrs.queries.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/school/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final CreateEnrollmentCommandHandler createHandler;
    private final UpdateEnrollmentCommandHandler updateHandler;
    private final GetAllEnrollmentsQueryHandler getAllHandler;
    private final GetEnrollmentByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<EnrollmentQueryResultDto> getAll(Pageable pageable, @RequestParam(required = false) String courseId) {
        return getAllHandler.handle(new GetAllEnrollmentsQuery(pageable.getPageNumber(), pageable.getPageSize(), courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetEnrollmentByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EnrollmentQueryResultDto create(@Valid @RequestBody CreateEnrollmentCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateEnrollmentCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

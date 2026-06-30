package com.mtp.school.controllers;

import com.mtp.school.cqrs.commands.*;
import com.mtp.school.cqrs.dto.TeacherQueryResultDto;
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
@RequestMapping("/api/school/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final CreateTeacherCommandHandler createHandler;
    private final UpdateTeacherCommandHandler updateHandler;
    private final GetAllTeachersQueryHandler getAllHandler;
    private final GetTeacherByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<TeacherQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllTeachersQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetTeacherByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TeacherQueryResultDto create(@Valid @RequestBody CreateTeacherCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherQueryResultDto> update(@PathVariable String id,
            @Valid @RequestBody UpdateTeacherCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

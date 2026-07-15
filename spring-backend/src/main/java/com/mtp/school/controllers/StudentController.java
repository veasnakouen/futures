package com.mtp.school.controllers;

import com.mtp.school.cqrs.commands.*;
import com.mtp.school.cqrs.dto.StudentQueryResultDto;
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
@RequestMapping("/api/school/students")
@RequiredArgsConstructor
public class StudentController {

    private final CreateStudentCommandHandler createHandler;
    private final UpdateStudentCommandHandler updateHandler;
    private final DeleteStudentCommandHandler deleteHandler;
    private final GetAllStudentsQueryHandler getAllHandler;
    private final GetStudentByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<StudentQueryResultDto> getAll(
            Pageable pageable,
            @RequestParam(required = false) String outreachWorkerName) {
        return getAllHandler.handle(new GetAllStudentsQuery(pageable.getPageNumber(), pageable.getPageSize(), outreachWorkerName));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetStudentByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public StudentQueryResultDto create(@Valid @RequestBody CreateStudentCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateStudentCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        deleteHandler.handle(id);
        return ResponseEntity.noContent().build();
    }
}

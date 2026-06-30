package com.mtp.school.controllers;

import com.mtp.school.cqrs.commands.*;
import com.mtp.school.cqrs.dto.CourseQueryResultDto;
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
@RequestMapping("/api/school/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CreateCourseCommandHandler createHandler;
    private final UpdateCourseCommandHandler updateHandler;
    private final GetAllCoursesQueryHandler getAllHandler;
    private final GetCourseByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<CourseQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllCoursesQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")

    public ResponseEntity<CourseQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetCourseByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CourseQueryResultDto create(@Valid @RequestBody CreateCourseCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseQueryResultDto> update(@PathVariable String id,
            @Valid @RequestBody UpdateCourseCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.mtp.school.controllers;

import com.mtp.school.cqrs.commands.CreateCourseScheduleCommand;
import com.mtp.school.cqrs.commands.UpdateCourseScheduleCommand;
import com.mtp.school.cqrs.dto.CourseScheduleQueryResultDto;
import com.mtp.school.cqrs.handlers.commands.CreateCourseScheduleCommandHandler;
import com.mtp.school.cqrs.handlers.commands.UpdateCourseScheduleCommandHandler;
import com.mtp.school.cqrs.handlers.queries.GetAllCourseSchedulesQueryHandler;
import com.mtp.school.cqrs.handlers.queries.GetCourseScheduleByIdQueryHandler;
import com.mtp.school.cqrs.queries.GetAllCourseSchedulesQuery;
import com.mtp.school.cqrs.queries.GetCourseScheduleByIdQuery;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/school/course-schedules")
@RequiredArgsConstructor
public class CourseScheduleController {

    private final CreateCourseScheduleCommandHandler createHandler;
    private final UpdateCourseScheduleCommandHandler updateHandler;
    private final GetCourseScheduleByIdQueryHandler getByIdHandler;
    private final GetAllCourseSchedulesQueryHandler getAllHandler;

    @GetMapping
    public ResponseEntity<List<CourseScheduleQueryResultDto>> getAll() {
        return ResponseEntity.ok(getAllHandler.handle(new GetAllCourseSchedulesQuery()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseScheduleQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetCourseScheduleByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CourseScheduleQueryResultDto> create(@Valid @RequestBody CreateCourseScheduleCommand command) {
        return createHandler.handle(command)
                .map(dto -> ResponseEntity.status(HttpStatus.CREATED).body(dto))
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseScheduleQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateCourseScheduleCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.mtp.school.controllers;

import com.mtp.school.cqrs.commands.*;
import com.mtp.school.cqrs.dto.ExtracurricularQueryResultDto;
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
@RequestMapping("/api/school/extracurriculars")
@RequiredArgsConstructor
public class ExtracurricularController {

    private final CreateExtracurricularCommandHandler createHandler;
    private final UpdateExtracurricularCommandHandler updateHandler;
    private final GetAllExtracurricularsQueryHandler getAllHandler;
    private final GetExtracurricularByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<ExtracurricularQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllExtracurricularsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExtracurricularQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetExtracurricularByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ExtracurricularQueryResultDto create(@Valid @RequestBody CreateExtracurricularCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExtracurricularQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateExtracurricularCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.mtp.school.controllers;

import com.mtp.school.cqrs.commands.*;
import com.mtp.school.cqrs.dto.ParentQueryResultDto;
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
@RequestMapping("/api/school/parents")
@RequiredArgsConstructor
public class ParentController {

    private final CreateParentCommandHandler createHandler;
    private final UpdateParentCommandHandler updateHandler;
    private final GetAllParentsQueryHandler getAllHandler;
    private final GetParentByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<ParentQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllParentsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParentQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetParentByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ParentQueryResultDto create(@Valid @RequestBody CreateParentCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParentQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateParentCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

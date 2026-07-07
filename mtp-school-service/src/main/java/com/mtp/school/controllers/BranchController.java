package com.mtp.school.controllers;

import com.mtp.school.cqrs.dto.BranchQueryResultDto;
import com.mtp.school.cqrs.handlers.queries.GetAllBranchesQueryHandler;
import com.mtp.school.cqrs.queries.GetAllBranchesQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mtp.school.cqrs.commands.CreateBranchCommand;
import com.mtp.school.cqrs.commands.UpdateBranchCommand;
import com.mtp.school.cqrs.handlers.commands.CreateBranchCommandHandler;
import com.mtp.school.cqrs.handlers.commands.UpdateBranchCommandHandler;
import com.mtp.school.cqrs.handlers.commands.DeleteBranchCommandHandler;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/school/branches")
@RequiredArgsConstructor
public class BranchController {

    private final GetAllBranchesQueryHandler getAllHandler;
    private final CreateBranchCommandHandler createHandler;
    private final UpdateBranchCommandHandler updateHandler;
    private final DeleteBranchCommandHandler deleteHandler;

    @GetMapping
    public ResponseEntity<List<BranchQueryResultDto>> getAll() {
        return ResponseEntity.ok(getAllHandler.handle(new GetAllBranchesQuery()));
    }

    @PostMapping
    public ResponseEntity<BranchQueryResultDto> create(@Valid @RequestBody CreateBranchCommand command) {
        return ResponseEntity.ok(createHandler.handle(command));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BranchQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateBranchCommand command) {
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

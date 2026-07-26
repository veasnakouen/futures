package com.mtp.clinic.controllers;

import com.mtp.api.dto.ApiResponse;
import com.mtp.api.dto.pagination.PagedResponse;
import com.mtp.api.dto.pagination.PaginationRequest;
import com.mtp.clinic.cqrs.commands.*;
import com.mtp.clinic.cqrs.dto.PatientQueryResultDto;
import com.mtp.clinic.cqrs.handlers.commands.*;
import com.mtp.clinic.cqrs.handlers.queries.*;
import com.mtp.clinic.cqrs.queries.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/clinic/patients")
@RequiredArgsConstructor
public class PatientController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "firstName", "lastName", "medicalRecordNumber", "dateOfBirth", "contactNumber");

    private final CreatePatientCommandHandler createHandler;
    private final UpdatePatientCommandHandler updateHandler;
    private final GetAllPatientsQueryHandler getAllHandler;
    private final GetPatientByIdQueryHandler getByIdHandler;
    private final DeletePatientCommandHandler deleteHandler;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PatientQueryResultDto>>> getAll(@Valid @ModelAttribute PaginationRequest request) {
        Pageable pageable = request.toPageable(ALLOWED_SORT_FIELDS);
        Page<PatientQueryResultDto> pageResult = getAllHandler.handle(new GetAllPatientsQuery(pageable));
        PagedResponse<PatientQueryResultDto> response = PagedResponse.from(pageResult, request.getSortBy(), request.getSortOrder());
        return ResponseEntity.ok(ApiResponse.success("Patients fetched successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetPatientByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PatientQueryResultDto create(@Valid @RequestBody CreatePatientCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdatePatientCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        deleteHandler.handle(new DeletePatientCommand(id));
        return ResponseEntity.noContent().build();
    }
}

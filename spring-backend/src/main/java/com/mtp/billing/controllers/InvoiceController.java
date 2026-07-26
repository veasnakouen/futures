package com.mtp.billing.controllers;

import com.mtp.billing.cqrs.commands.*;
import com.mtp.billing.cqrs.dto.InvoiceQueryResultDto;
import com.mtp.billing.cqrs.handlers.commands.*;
import com.mtp.billing.cqrs.handlers.queries.*;
import com.mtp.billing.cqrs.queries.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final CreateInvoiceCommandHandler createHandler;
    private final UpdateInvoiceCommandHandler updateHandler;
    private final GetAllInvoicesQueryHandler getAllHandler;
    private final GetInvoiceByIdQueryHandler getByIdHandler;

    private static final java.util.Set<String> ALLOWED_SORT_FIELDS = java.util.Set.of("id", "invoiceNumber", "totalAmount", "status", "issueDate", "dueDate");

    @GetMapping
    public ResponseEntity<com.mtp.api.dto.ApiResponse<com.mtp.api.dto.pagination.PagedResponse<InvoiceQueryResultDto>>> getAll(
            @Valid @ModelAttribute com.mtp.api.dto.pagination.PaginationRequest request) {
        Pageable pageable = request.toPageable(ALLOWED_SORT_FIELDS);
        Page<InvoiceQueryResultDto> pageResult = getAllHandler.handle(new GetAllInvoicesQuery(pageable));
        com.mtp.api.dto.pagination.PagedResponse<InvoiceQueryResultDto> response = com.mtp.api.dto.pagination.PagedResponse.from(pageResult, request.getSortBy(), request.getSortOrder());
        return ResponseEntity.ok(com.mtp.api.dto.ApiResponse.success("Invoices fetched successfully", response));
    }

    @GetMapping("/modules")
    public com.mtp.billing.enums.ModuleSource[] getModules() {
        return com.mtp.billing.enums.ModuleSource.values();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetInvoiceByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public InvoiceQueryResultDto create(@Valid @RequestBody CreateInvoiceCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InvoiceQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdateInvoiceCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.mtp.billing.controllers;

import com.mtp.api.dto.ApiResponse;
import com.mtp.api.dto.pagination.PagedResponse;
import com.mtp.api.dto.pagination.PaginationRequest;
import com.mtp.billing.cqrs.commands.*;
import com.mtp.billing.cqrs.dto.PaymentQueryResultDto;
import com.mtp.billing.cqrs.handlers.commands.*;
import com.mtp.billing.cqrs.handlers.queries.*;
import com.mtp.billing.cqrs.queries.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Set;

@RestController
@RequestMapping("/api/billing/payments")
@RequiredArgsConstructor
public class PaymentController {

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "amount", "paymentDate", "status",
            "paymentMethod", "createdAt");

    private final CreatePaymentCommandHandler createHandler;
    private final UpdatePaymentCommandHandler updateHandler;
    private final GetAllPaymentsQueryHandler getAllHandler;
    private final GetPaymentByIdQueryHandler getByIdHandler;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PaymentQueryResultDto>>> getAll(
            @Valid @ModelAttribute PaginationRequest request) {
        Pageable pageable = request.toPageable(ALLOWED_SORT_FIELDS);
        Page<PaymentQueryResultDto> pageResult = getAllHandler.handle(new GetAllPaymentsQuery(pageable));
        PagedResponse<PaymentQueryResultDto> response = PagedResponse.from(pageResult, request.getSortBy(),
                request.getSortOrder());
        return ResponseEntity.ok(ApiResponse.success("Payments fetched successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentQueryResultDto>> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetPaymentByIdQuery(id))
                .map(dto -> ResponseEntity.ok(ApiResponse.success("Payment retrieved successfully", dto)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentQueryResultDto>> create(@Valid @RequestBody CreatePaymentCommand command) {
        PaymentQueryResultDto result = createHandler.handle(command);
        return ResponseEntity.ok(ApiResponse.success("Payment created successfully", result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentQueryResultDto>> update(
            @PathVariable String id,
            @Valid @RequestBody UpdatePaymentCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(dto -> ResponseEntity.ok(ApiResponse.success("Payment updated successfully", dto)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

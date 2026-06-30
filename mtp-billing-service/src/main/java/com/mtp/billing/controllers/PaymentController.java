package com.mtp.billing.controllers;

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

@RestController
@RequestMapping("/api/billing/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final CreatePaymentCommandHandler createHandler;
    private final UpdatePaymentCommandHandler updateHandler;
    private final GetAllPaymentsQueryHandler getAllHandler;
    private final GetPaymentByIdQueryHandler getByIdHandler;

    @GetMapping
    public Page<PaymentQueryResultDto> getAll(Pageable pageable) {
        return getAllHandler.handle(new GetAllPaymentsQuery(pageable.getPageNumber(), pageable.getPageSize()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentQueryResultDto> getById(@PathVariable String id) {
        return getByIdHandler.handle(new GetPaymentByIdQuery(id))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PaymentQueryResultDto create(@Valid @RequestBody CreatePaymentCommand command) {
        return createHandler.handle(command);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentQueryResultDto> update(@PathVariable String id, @Valid @RequestBody UpdatePaymentCommand command) {
        command.setId(id);
        return updateHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

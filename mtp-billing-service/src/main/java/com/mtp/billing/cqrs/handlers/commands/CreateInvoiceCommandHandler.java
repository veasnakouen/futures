package com.mtp.billing.cqrs.handlers.commands;

import com.mtp.billing.cqrs.commands.CreateInvoiceCommand;
import com.mtp.billing.cqrs.dto.InvoiceQueryResultDto;
import com.mtp.billing.cqrs.mappers.InvoiceMapper;
import com.mtp.billing.models.Invoice;
import com.mtp.billing.repositories.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateInvoiceCommandHandler {

    private final InvoiceRepository repository;
    private final InvoiceMapper mapper;

    @Transactional
    public InvoiceQueryResultDto handle(CreateInvoiceCommand command) {
        Invoice entity = mapper.toEntity(command);
        if (entity.getLineItems() != null) {
            entity.getLineItems().forEach(item -> item.setInvoice(entity));
        }
        Invoice savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}

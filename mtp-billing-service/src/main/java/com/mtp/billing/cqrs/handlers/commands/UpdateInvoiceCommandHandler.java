package com.mtp.billing.cqrs.handlers.commands;

import com.mtp.billing.cqrs.commands.UpdateInvoiceCommand;
import com.mtp.billing.cqrs.dto.InvoiceQueryResultDto;
import com.mtp.billing.cqrs.mappers.InvoiceMapper;
import com.mtp.billing.repositories.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateInvoiceCommandHandler {

    private final InvoiceRepository repository;
    private final InvoiceMapper mapper;

    @Transactional
    public Optional<InvoiceQueryResultDto> handle(UpdateInvoiceCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            // clear old line items and add new ones to let orphanRemoval work properly
            if (entity.getLineItems() != null) {
                entity.getLineItems().clear();
            }
            mapper.updateEntity(command, entity);
            if (entity.getLineItems() != null) {
                entity.getLineItems().forEach(item -> item.setInvoice(entity));
            }
            return mapper.toDto(repository.save(entity));
        });
    }
}

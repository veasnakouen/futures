package com.mtp.billing.cqrs.mappers;

import com.mtp.billing.cqrs.commands.CreateInvoiceCommand;
import com.mtp.billing.cqrs.commands.UpdateInvoiceCommand;
import com.mtp.billing.cqrs.dto.InvoiceQueryResultDto;
import com.mtp.billing.models.Invoice;
import com.mtp.billing.models.InvoiceLineItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InvoiceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    Invoice toEntity(CreateInvoiceCommand command);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    void updateEntity(UpdateInvoiceCommand command, @MappingTarget Invoice entity);

    InvoiceQueryResultDto toDto(Invoice entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    InvoiceLineItem toLineItemEntity(CreateInvoiceCommand.InvoiceLineItemCommand command);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    InvoiceLineItem toLineItemEntity(UpdateInvoiceCommand.InvoiceLineItemCommand command);

    InvoiceQueryResultDto.InvoiceLineItemDto toLineItemDto(InvoiceLineItem entity);
}

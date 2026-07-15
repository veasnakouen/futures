package com.mtp.billing.cqrs.mappers;

import com.mtp.billing.cqrs.commands.CreateInvoiceCommand;
import com.mtp.billing.cqrs.dto.InvoiceQueryResultDto;
import com.mtp.billing.cqrs.commands.UpdateInvoiceCommand;
import com.mtp.billing.models.Invoice;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InvoiceMapper {
    @Mapping(target = "id", ignore = true)
    Invoice toEntity(CreateInvoiceCommand command);

    @Mapping(target = "id", ignore = true)
    void updateEntity(UpdateInvoiceCommand command, @MappingTarget Invoice entity);

    InvoiceQueryResultDto toDto(Invoice entity);
}

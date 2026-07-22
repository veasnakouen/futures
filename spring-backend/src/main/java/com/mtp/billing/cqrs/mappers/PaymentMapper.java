package com.mtp.billing.cqrs.mappers;

import com.mtp.billing.cqrs.commands.CreatePaymentCommand;
import com.mtp.billing.cqrs.dto.PaymentQueryResultDto;
import com.mtp.billing.models.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PaymentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "tenantId", ignore = true)
    Payment toEntity(CreatePaymentCommand command);

    PaymentQueryResultDto toDto(Payment entity);
}

package com.mtp.clinic.cqrs.mappers;

import com.mtp.clinic.cqrs.commands.CreatePrescriptionCommand;
import com.mtp.clinic.cqrs.dto.PrescriptionQueryResultDto;
import com.mtp.clinic.models.Prescription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import org.mapstruct.AfterMapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PrescriptionMapper {
    @Mapping(target = "id", ignore = true)
    Prescription toEntity(CreatePrescriptionCommand command);

    PrescriptionQueryResultDto toDto(Prescription entity);

    com.mtp.clinic.models.PrescriptionItem toItemEntity(com.mtp.clinic.cqrs.dto.PrescriptionItemDto dto);

    com.mtp.clinic.cqrs.dto.PrescriptionItemDto toItemDto(com.mtp.clinic.models.PrescriptionItem entity);

    @AfterMapping
    default void linkItems(@MappingTarget Prescription prescription) {
        if (prescription.getItems() != null) {
            prescription.getItems().forEach(item -> item.setPrescription(prescription));
        }
    }
}

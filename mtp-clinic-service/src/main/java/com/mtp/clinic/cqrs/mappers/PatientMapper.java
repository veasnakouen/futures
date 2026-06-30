package com.mtp.clinic.cqrs.mappers;

import com.mtp.clinic.cqrs.commands.CreatePatientCommand;
import com.mtp.clinic.cqrs.dto.PatientQueryResultDto;
import com.mtp.clinic.models.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PatientMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    Patient toEntity(CreatePatientCommand command);

    PatientQueryResultDto toDto(Patient entity);
    
    com.mtp.clinic.models.Address toAddress(com.mtp.clinic.cqrs.dto.AddressDto dto);
}

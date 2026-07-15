package com.mtp.clinic.cqrs.mappers;

import com.mtp.clinic.cqrs.commands.CreateAppointmentCommand;
import com.mtp.clinic.cqrs.dto.AppointmentQueryResultDto;
import com.mtp.clinic.models.Appointment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AppointmentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "provider", ignore = true)
    Appointment toEntity(CreateAppointmentCommand command);

    @Mapping(source = "patient.id", target = "patientId")
    @Mapping(source = "provider.id", target = "doctorId")
    AppointmentQueryResultDto toDto(Appointment entity);
}

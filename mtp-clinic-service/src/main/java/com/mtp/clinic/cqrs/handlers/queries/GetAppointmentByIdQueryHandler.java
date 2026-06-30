package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.AppointmentQueryResultDto;
import com.mtp.clinic.cqrs.mappers.AppointmentMapper;
import com.mtp.clinic.cqrs.queries.GetAppointmentByIdQuery;
import com.mtp.clinic.repositories.AppointmentRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetAppointmentByIdQueryHandler {

    private final AppointmentRepository repository;
    private final AppointmentMapper mapper;

    public Optional<AppointmentQueryResultDto> handle(GetAppointmentByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}

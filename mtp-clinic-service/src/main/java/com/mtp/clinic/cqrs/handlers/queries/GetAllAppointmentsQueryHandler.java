package com.mtp.clinic.cqrs.handlers.queries;

import com.mtp.clinic.cqrs.dto.AppointmentQueryResultDto;
import com.mtp.clinic.cqrs.mappers.AppointmentMapper;
import com.mtp.clinic.cqrs.queries.GetAllAppointmentsQuery;
import com.mtp.clinic.repositories.AppointmentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllAppointmentsQueryHandler {

    private final AppointmentRepository repository;
    private final AppointmentMapper mapper;

    public Page<AppointmentQueryResultDto> handle(GetAllAppointmentsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}

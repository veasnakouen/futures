package com.mtp.hotel.cqrs.handlers.queries;

import com.mtp.hotel.cqrs.dto.HousekeepingTaskQueryResultDto;
import com.mtp.hotel.cqrs.mappers.HousekeepingTaskMapper;
import com.mtp.hotel.cqrs.queries.GetHousekeepingTaskByIdQuery;
import com.mtp.hotel.repositories.HousekeepingTaskRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetHousekeepingTaskByIdQueryHandler {

    private final HousekeepingTaskRepository repository;
    private final HousekeepingTaskMapper mapper;

    public Optional<HousekeepingTaskQueryResultDto> handle(GetHousekeepingTaskByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}

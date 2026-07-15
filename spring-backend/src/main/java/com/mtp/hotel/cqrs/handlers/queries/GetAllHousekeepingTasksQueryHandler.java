package com.mtp.hotel.cqrs.handlers.queries;

import com.mtp.hotel.cqrs.dto.HousekeepingTaskQueryResultDto;
import com.mtp.hotel.cqrs.mappers.HousekeepingTaskMapper;
import com.mtp.hotel.cqrs.queries.GetAllHousekeepingTasksQuery;
import com.mtp.hotel.repositories.HousekeepingTaskRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllHousekeepingTasksQueryHandler {

    private final HousekeepingTaskRepository repository;
    private final HousekeepingTaskMapper mapper;

    public Page<HousekeepingTaskQueryResultDto> handle(GetAllHousekeepingTasksQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}

package com.mtp.hotel.cqrs.handlers.queries;

import com.mtp.hotel.cqrs.dto.RoomQueryResultDto;
import com.mtp.hotel.cqrs.mappers.RoomMapper;
import com.mtp.hotel.cqrs.queries.GetAllRoomsQuery;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllRoomsQueryHandler {

    private final RoomRepository repository;
    private final RoomMapper mapper;

    public Page<RoomQueryResultDto> handle(GetAllRoomsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}

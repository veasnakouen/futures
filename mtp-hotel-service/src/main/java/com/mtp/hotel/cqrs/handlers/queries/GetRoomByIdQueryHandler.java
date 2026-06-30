package com.mtp.hotel.cqrs.handlers.queries;

import com.mtp.hotel.cqrs.dto.RoomQueryResultDto;
import com.mtp.hotel.cqrs.mappers.RoomMapper;
import com.mtp.hotel.cqrs.queries.GetRoomByIdQuery;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetRoomByIdQueryHandler {

    private final RoomRepository repository;
    private final RoomMapper mapper;

    public Optional<RoomQueryResultDto> handle(GetRoomByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}

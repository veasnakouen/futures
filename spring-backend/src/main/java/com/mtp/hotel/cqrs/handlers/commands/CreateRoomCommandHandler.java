package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.CreateRoomCommand;
import com.mtp.hotel.cqrs.dto.RoomQueryResultDto;
import com.mtp.hotel.cqrs.mappers.RoomMapper;
import com.mtp.hotel.models.Room;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateRoomCommandHandler {

    private final RoomRepository repository;
    private final RoomMapper mapper;

    @Transactional
    public RoomQueryResultDto handle(CreateRoomCommand command) {
        Room entity = mapper.toEntity(command);
        Room savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}

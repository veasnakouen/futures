package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.CreateHousekeepingTaskCommand;
import com.mtp.hotel.cqrs.dto.HousekeepingTaskQueryResultDto;
import com.mtp.hotel.cqrs.mappers.HousekeepingTaskMapper;
import com.mtp.hotel.models.HousekeepingTask;
import com.mtp.hotel.repositories.HousekeepingTaskRepository;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateHousekeepingTaskCommandHandler {

    private final HousekeepingTaskRepository repository;
    private final RoomRepository roomRepository;
    private final HousekeepingTaskMapper mapper;

    @Transactional
    public HousekeepingTaskQueryResultDto handle(CreateHousekeepingTaskCommand command) {
        HousekeepingTask entity = mapper.toEntity(command);
        
        entity.setRoom(roomRepository.findById(command.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found")));
                
        HousekeepingTask savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}

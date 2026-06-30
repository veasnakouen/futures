package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.UpdateHousekeepingTaskCommand;
import com.mtp.hotel.cqrs.dto.HousekeepingTaskQueryResultDto;
import com.mtp.hotel.cqrs.mappers.HousekeepingTaskMapper;
import com.mtp.hotel.repositories.HousekeepingTaskRepository;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateHousekeepingTaskCommandHandler {

    private final HousekeepingTaskRepository repository;
    private final RoomRepository roomRepository;
    private final HousekeepingTaskMapper mapper;

    @Transactional
    public Optional<HousekeepingTaskQueryResultDto> handle(UpdateHousekeepingTaskCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setTaskDate(command.getTaskDate());
            entity.setDescription(command.getDescription());
            entity.setStatus(command.getStatus());
            entity.setRoom(roomRepository.findById(command.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found")));
                    
            return mapper.toDto(repository.save(entity));
        });
    }
}

package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.UpdateRoomCommand;
import com.mtp.hotel.cqrs.dto.RoomQueryResultDto;
import com.mtp.hotel.cqrs.mappers.RoomMapper;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateRoomCommandHandler {

    private final RoomRepository repository;
    private final RoomMapper mapper;

    @Transactional
    public Optional<RoomQueryResultDto> handle(UpdateRoomCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setRoomNumber(command.getRoomNumber());
            entity.setRoomType(command.getRoomType());
            entity.setPricePerNight(command.getPricePerNight());
            entity.setStatus(command.getStatus());
            entity.setCapacity(command.getCapacity());
            entity.setBedType(command.getBedType());
            entity.setAmenities(command.getAmenities());
            entity.setFloorNumber(command.getFloorNumber());
            entity.setAddress(command.getAddress());
            entity.setBedrooms(command.getBedrooms());
            entity.setBathrooms(command.getBathrooms());
            return mapper.toDto(repository.save(entity));
        });
    }
}

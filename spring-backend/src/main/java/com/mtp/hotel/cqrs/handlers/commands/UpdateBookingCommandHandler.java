package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.UpdateBookingCommand;
import com.mtp.hotel.cqrs.dto.BookingQueryResultDto;
import com.mtp.hotel.cqrs.mappers.BookingMapper;
import com.mtp.hotel.repositories.BookingRepository;
import com.mtp.hotel.repositories.GuestRepository;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateBookingCommandHandler {

    private final BookingRepository repository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final BookingMapper mapper;

    @Transactional
    public Optional<BookingQueryResultDto> handle(UpdateBookingCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setCheckInDate(command.getCheckInDate());
            entity.setCheckOutDate(command.getCheckOutDate());
            entity.setTotalPrice(command.getTotalPrice());
            entity.setStatus(command.getStatus());
            entity.setGuest(guestRepository.findById(command.getGuestId())
                    .orElseThrow(() -> new IllegalArgumentException("Guest not found")));
                    
            entity.setRoom(roomRepository.findById(command.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found")));
                    
            return mapper.toDto(repository.save(entity));
        });
    }
}

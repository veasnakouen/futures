package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.CreateBookingCommand;
import com.mtp.hotel.cqrs.dto.BookingQueryResultDto;
import com.mtp.hotel.cqrs.mappers.BookingMapper;
import com.mtp.hotel.models.Booking;
import com.mtp.hotel.repositories.BookingRepository;
import com.mtp.hotel.repositories.GuestRepository;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateBookingCommandHandler {

    private final BookingRepository repository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final BookingMapper mapper;

    @Transactional
    public BookingQueryResultDto handle(CreateBookingCommand command) {
        Booking entity = mapper.toEntity(command);
        
        entity.setGuest(guestRepository.findById(command.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("Guest not found")));
                
        entity.setRoom(roomRepository.findById(command.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found")));
                
        Booking savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}

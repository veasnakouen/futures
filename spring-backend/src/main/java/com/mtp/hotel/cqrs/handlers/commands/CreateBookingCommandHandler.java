package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.CreateBookingCommand;
import com.mtp.hotel.cqrs.dto.BookingQueryResultDto;
import com.mtp.hotel.cqrs.mappers.BookingMapper;
import com.mtp.hotel.models.Booking;
import com.mtp.hotel.models.Guest;
import com.mtp.hotel.models.Room;
import com.mtp.hotel.repositories.BookingRepository;
import com.mtp.hotel.repositories.GuestRepository;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class CreateBookingCommandHandler {

    private final BookingRepository repository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final BookingMapper mapper;

    @Transactional
    public BookingQueryResultDto handle(CreateBookingCommand command) {
        // Double-Booking Protection Check: Ensure room is free for the date range
        long overlapCount = repository.countOverlappingBookings(
                command.getRoomId(),
                command.getCheckInDate(),
                command.getCheckOutDate(),
                null
        );

        if (overlapCount > 0) {
            throw new org.springframework.dao.DataIntegrityViolationException(
                    "Room [ID: " + command.getRoomId() + "] is already reserved for the selected dates"
            );
        }

        Guest guest = guestRepository.findById(command.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("Guest not found"));

        Room room = roomRepository.findById(command.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        Booking entity = mapper.toEntity(command);
        entity.setGuest(guest);
        entity.setRoom(room);

        // Auto-calculate Total Price based on Nights * pricePerNight
        if (entity.getTotalPrice() == null || entity.getTotalPrice().compareTo(BigDecimal.ZERO) <= 0) {
            long nights = ChronoUnit.DAYS.between(command.getCheckInDate(), command.getCheckOutDate());
            if (nights <= 0) nights = 1;
            BigDecimal roomRate = room.getPricePerNight() != null ? room.getPricePerNight() : BigDecimal.ZERO;
            entity.setTotalPrice(roomRate.multiply(BigDecimal.valueOf(nights)));
        }

        if (entity.getStatus() == null || entity.getStatus().trim().isEmpty()) {
            entity.setStatus("PENDING");
        }

        Booking savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}

package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.UpdateBookingCommand;
import com.mtp.hotel.cqrs.dto.BookingQueryResultDto;
import com.mtp.hotel.cqrs.mappers.BookingMapper;
import com.mtp.hotel.models.Booking;
import com.mtp.hotel.models.Guest;
import com.mtp.hotel.models.HousekeepingTask;
import com.mtp.hotel.models.Room;
import com.mtp.hotel.repositories.BookingRepository;
import com.mtp.hotel.repositories.GuestRepository;
import com.mtp.hotel.repositories.HousekeepingTaskRepository;
import com.mtp.hotel.repositories.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateBookingCommandHandler {

    private final BookingRepository repository;
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final HousekeepingTaskRepository housekeepingTaskRepository;
    private final BookingMapper mapper;

    @Transactional
    public Optional<BookingQueryResultDto> handle(UpdateBookingCommand command) {
        // Double-Booking Protection Check: Exclude current booking ID
        long overlapCount = repository.countOverlappingBookings(
                command.getRoomId(),
                command.getCheckInDate(),
                command.getCheckOutDate(),
                command.getId()
        );

        if (overlapCount > 0) {
            throw new org.springframework.dao.DataIntegrityViolationException(
                    "Room [ID: " + command.getRoomId() + "] is already reserved for the selected dates"
            );
        }

        return repository.findById(command.getId()).map(entity -> {
            String oldStatus = entity.getStatus();
            String newStatus = command.getStatus();

            entity.setCheckInDate(command.getCheckInDate());
            entity.setCheckOutDate(command.getCheckOutDate());
            entity.setTotalPrice(command.getTotalPrice());
            entity.setStatus(newStatus);

            Guest guest = guestRepository.findById(command.getGuestId())
                    .orElseThrow(() -> new IllegalArgumentException("Guest not found"));
            entity.setGuest(guest);

            Room room = roomRepository.findById(command.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found"));
            entity.setRoom(room);

            // Hotel Room State Machine & Housekeeping Trigger
            if ("CHECKED_IN".equalsIgnoreCase(newStatus)) {
                room.setStatus("OCCUPIED");
                roomRepository.save(room);
            } else if ("CHECKED_OUT".equalsIgnoreCase(newStatus)) {
                room.setStatus("DIRTY");
                roomRepository.save(room);

                // Auto-generate Housekeeping Task for cleaning staff
                if (!"CHECKED_OUT".equalsIgnoreCase(oldStatus)) {
                    HousekeepingTask task = new HousekeepingTask();
                    task.setRoom(room);
                    task.setTaskDate(LocalDate.now());
                    task.setDescription("Auto-Generated Post Check-Out Cleaning for Room " + room.getRoomNumber());
                    task.setStatus("PENDING");
                    housekeepingTaskRepository.save(task);
                }
            } else if ("CANCELLED".equalsIgnoreCase(newStatus)) {
                if ("OCCUPIED".equalsIgnoreCase(room.getStatus())) {
                    room.setStatus("AVAILABLE");
                    roomRepository.save(room);
                }
            }

            return mapper.toDto(repository.save(entity));
        });
    }
}

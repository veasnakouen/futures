package com.mtp.hotel.cqrs.mappers;

import com.mtp.hotel.cqrs.commands.CreateBookingCommand;
import com.mtp.hotel.cqrs.dto.BookingQueryResultDto;
import com.mtp.hotel.models.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookingMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "guest", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(source = "totalAmount", target = "totalPrice")
    Booking toEntity(CreateBookingCommand command);

    @Mapping(source = "guest.id", target = "guestId")
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "totalPrice", target = "totalAmount")
    @Mapping(source = "totalPrice", target = "totalPrice")
    BookingQueryResultDto toDto(Booking entity);
}

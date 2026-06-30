package com.mtp.hotel.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateRoomCommand {
    private Integer id;
    @NotBlank(message = "Room number is required") private String roomNumber;
    @NotBlank(message = "Room type is required") private String roomType;
    @NotNull(message = "Price is required") private BigDecimal pricePerNight;
    private String status;
    private Integer capacity;
    private String bedType;
    private String amenities;
    private Integer floorNumber;
    private String address;
    private Integer bedrooms;
    private Integer bathrooms;
}

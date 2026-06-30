package com.mtp.hotel.cqrs.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RoomQueryResultDto {
    private Integer id;
    private String roomNumber;
    private String roomType;
    private BigDecimal pricePerNight;
    private String status;
    private Integer capacity;
    private String bedType;
    private String amenities;
    private Integer floorNumber;
    private String address;
    private Integer bedrooms;
    private Integer bathrooms;
}

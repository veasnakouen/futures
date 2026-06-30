package com.mtp.hotel.cqrs.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingQueryResultDto {
    private Integer id;
    private Integer guestId;
    private Integer roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalPrice;
    private String status;
}

package com.mtp.hotel.cqrs.commands;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateBookingCommand {
    private Integer id;
    @NotNull(message = "Guest ID is required") private Integer guestId;
    @NotNull(message = "Room ID is required") private Integer roomId;
    @NotNull(message = "Check in date is required") private LocalDate checkInDate;
    @NotNull(message = "Check out date is required") private LocalDate checkOutDate;
    private BigDecimal totalPrice;
    private BigDecimal totalAmount;
    private String status;

    public BigDecimal getTotalAmount() {
        return totalAmount != null ? totalAmount : totalPrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice != null ? totalPrice : totalAmount;
    }
}

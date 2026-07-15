package com.mtp.hotel.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity(name = "HotelRoom")
@Table(name = "hotel_rooms")
@Data
@NoArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

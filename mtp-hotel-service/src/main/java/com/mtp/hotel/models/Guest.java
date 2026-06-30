package com.mtp.hotel.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hotel_guests")
@Data
@NoArgsConstructor
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String idProofNumber;
    private String address;
    private String nationality;
    private java.time.LocalDate dateOfBirth;
    private String emergencyContact;
    private Boolean isActive = true;
}

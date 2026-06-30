package com.mtp.hotel.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "hotel_housekeeping_tasks")
@Data
@NoArgsConstructor
public class HousekeepingTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    private LocalDate taskDate;
    
    @Column(length = 1000)
    private String description;
    
    private String status;
}

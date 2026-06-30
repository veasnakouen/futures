package com.mtp.pos.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pos_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PosSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String cashierId;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Column(nullable = false)
    private BigDecimal startingCash;

    private BigDecimal endingCash;

    private BigDecimal expectedCash;

    private String status; // e.g., OPEN, CLOSED
}

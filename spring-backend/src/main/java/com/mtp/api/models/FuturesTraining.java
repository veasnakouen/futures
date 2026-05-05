package com.mtp.api.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "FuturesTrainings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FuturesTraining {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SubjectId")
    private Subject subject;

    @NotNull
    private LocalDateTime openDate;

    private LocalDateTime closeDate;

    @Size(max = 255)
    private String note;

    @Size(max = 255)
    private String status;
}

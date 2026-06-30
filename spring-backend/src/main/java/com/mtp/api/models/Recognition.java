package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Recognitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recognition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String senderName;
    private String receiverName;
    
    @Column(length = 1000)
    private String message;
    
    private String badgeType;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}

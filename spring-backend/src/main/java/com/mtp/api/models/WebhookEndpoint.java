package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "WebhookEndpoints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebhookEndpoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String url;
    private String eventName;
    private String httpMethod;
    
    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}

package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity(name = "refresh_tokens")
@Data
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "Id", columnDefinition = "nvarchar(450)")
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;
}

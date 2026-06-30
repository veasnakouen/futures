package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Connections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId; // The user who initiated the connection

    @Column(nullable = false)
    private String targetId; // The ID of the connected friend (Client ID, Employer ID, or User ID)

    @Column(nullable = false)
    private String targetType; // 'CLIENT', 'EMPLOYER', or 'USER'

    private String targetName; // Cached name for quick rendering
    private String targetAvatar; // Cached avatar URL

    @Column(nullable = false)
    private LocalDateTime connectedAt = LocalDateTime.now();

    // Getters and Setters explicitly for frameworks that bypass Lombok
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public String getTargetName() { return targetName; }
    public void setTargetName(String targetName) { this.targetName = targetName; }

    public String getTargetAvatar() { return targetAvatar; }
    public void setTargetAvatar(String targetAvatar) { this.targetAvatar = targetAvatar; }

    public LocalDateTime getConnectedAt() { return connectedAt; }
    public void setConnectedAt(LocalDateTime connectedAt) { this.connectedAt = connectedAt; }
}

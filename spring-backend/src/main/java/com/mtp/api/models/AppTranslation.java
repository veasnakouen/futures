package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "AppTranslations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"lang", "translationKey"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lang", length = 10, nullable = false)
    private String lang;

    @Column(name = "translationKey", length = 255, nullable = false)
    private String translationKey;

    @Column(name = "translationValue", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String translationValue;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

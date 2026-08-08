package com.mtp.auth.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "hibernate_proxy", "byteBuddyInterceptor" })
@Table(name = "AspNetUsers", indexes = {
        @Index(name = "idx_user_username", columnList = "userName"),
        @Index(name = "idx_user_email", columnList = "email")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id", length = 128, columnDefinition = "nvarchar(128)")
    private String id;

    @Size(max = 255)
    private String firstName;

    @Size(max = 255)
    private String lastName;

    @Size(max = 255)
    private String branch;

    private boolean isDeleted = false;

    @Column(name = "EmailConfirmed")
    private boolean emailConfirmed = true;

    @Column(name = "PhoneNumberConfirmed")
    private boolean phoneNumberConfirmed = false;

    @Column(name = "TwoFactorEnabled")
    private boolean twoFactorEnabled = false;

    @Column(name = "LockoutEnabled")
    private boolean lockoutEnabled = true;

    @Column(name = "AccessFailedCount")
    private int accessFailedCount = 0;

    @Column(name = "LockoutEnd")
    private java.time.Instant lockoutEnd;

    private String email;
    private String userName;
    private String passwordHash;
    @Column(name = "PasswordText")
    private String passwordText; // Stored for administrative reference (Security Risk)
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String avatarUrl;

    @Column(name = "IsActive")
    private Boolean isActive = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "AspNetUserRoles", joinColumns = @JoinColumn(name = "UserId"), inverseJoinColumns = @JoinColumn(name = "RoleId"))
    private Set<Role> roles = new HashSet<>();

    // Explicit getter for isActive due to custom fallback logic
    public Boolean isActive() {
        return isActive != null ? isActive : true;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }
}

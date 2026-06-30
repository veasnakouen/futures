package com.mtp.api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    @Size(max = 255)
    private String firstName;

    @NotNull
    @Size(max = 255)
    private String lastName;

    @NotNull
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

    // Explicit Getters/Setters to bypass Lombok issues in certain environments
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPasswordText() {
        return passwordText;
    }

    public void setPasswordText(String passwordText) {
        this.passwordText = passwordText;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Boolean isActive() {
        return isActive != null ? isActive : true;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }
}

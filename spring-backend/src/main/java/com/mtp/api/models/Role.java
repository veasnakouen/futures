package com.mtp.api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;
import java.util.HashSet;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "hibernate_proxy", "byteBuddyInterceptor" })
@Table(name = "AspNetRoles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotNull
    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "AspNetRolePermissions", joinColumns = @JoinColumn(name = "RoleId"), inverseJoinColumns = @JoinColumn(name = "PermissionId"))
    private Set<Permission> permissions = new HashSet<>();

    private String normalizedName;

    // Explicit Getters/Setters to bypass Lombok issues
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNormalizedName() {
        return normalizedName;
    }

    public void setNormalizedName(String normalizedName) {
        this.normalizedName = normalizedName;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<Permission> permissions) {
        this.permissions = permissions;
    }
}

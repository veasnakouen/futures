package com.mtp.api.controllers;

import com.mtp.api.models.Permission;
import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import com.mtp.api.services.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserManagementService userManagementService;

    // User Management
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('USER_READ')")
    public Page<User> getAllUsers(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return userManagementService.getAllUsers(search, pageable);
    }

    @PostMapping("/users")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userManagementService.createUser(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User userDetails) {
        try {
            return ResponseEntity.ok(userManagementService.updateUser(userId, userDetails));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        try {
            userManagementService.deleteUser(userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/users/{userId}/reset-password")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> resetPassword(@PathVariable String userId, @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("New password is required");
        }
        try {
            userManagementService.resetPassword(userId, newPassword);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/users/{userId}/toggle-status")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(userManagementService.toggleUserStatus(userId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> updateUserRoles(@PathVariable String userId, @RequestBody Set<String> roleNames) {
        try {
            userManagementService.updateUserRoles(userId, roleNames);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Role & Permission Management
    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public List<Role> getAllRoles() {
        return userManagementService.getAllRoles();
    }

    @PostMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        try {
            return ResponseEntity.ok(userManagementService.createRole(role));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public List<Permission> getAllPermissions() {
        return userManagementService.getAllPermissions();
    }

    @PostMapping("/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> createPermission(@RequestBody Permission permission) {
        try {
            return ResponseEntity.ok(userManagementService.createPermission(permission));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/roles/{roleId}/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> updateRolePermissions(@PathVariable String roleId, @RequestBody Set<String> permissionNames) {
        try {
            userManagementService.updateRolePermissions(roleId, permissionNames);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

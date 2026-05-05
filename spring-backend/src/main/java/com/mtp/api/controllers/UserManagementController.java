package com.mtp.api.controllers;

import com.mtp.api.models.Permission;
import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import com.mtp.api.repositories.PermissionRepository;
import com.mtp.api.repositories.RoleRepository;
import com.mtp.api.repositories.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("isAuthenticated()")
public class UserManagementController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.mtp.api.services.ImageUploadService imageUploadService;

    // User Management
    @GetMapping("/users")
    @Cacheable(value = "users", key = "#pageable")
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @PostMapping("/users")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userRepository.findByUserName(user.getUserName()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        // Default password for new users if not provided
        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode("Welcome123!"));
            user.setPasswordText("Welcome123!");
        } else {
            user.setPasswordText(user.getPasswordHash());
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }

        // Handle Avatar Upload
        if (user.getAvatarUrl() != null && user.getAvatarUrl().startsWith("data:image")) {
            try {
                user.setAvatarUrl(imageUploadService.uploadBase64Image(user.getAvatarUrl(), "users"));
            } catch (Exception e) {}
        }

        return ResponseEntity.ok(userRepository.save(user));
    }


    @PutMapping("/users/{userId}")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User userDetails) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setUserName(userDetails.getUserName());
        
        if (userDetails.getAvatarUrl() != null && userDetails.getAvatarUrl().startsWith("data:image")) {
            try {
                user.setAvatarUrl(imageUploadService.uploadBase64Image(userDetails.getAvatarUrl(), "users"));
            } catch (Exception e) {}
        } else {
            user.setAvatarUrl(userDetails.getAvatarUrl());
        }
        
        return ResponseEntity.ok(userRepository.save(user));
    }


    @PostMapping("/users/{userId}/reset-password")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> resetPassword(@PathVariable String userId, @RequestBody String newPassword) {
        User user = userRepository.findById(userId).orElseThrow();
        // Basic cleanup of the input string (remove quotes if sent as JSON string)
        String cleanedPassword = newPassword.replace("\"", "");
        user.setPasswordHash(passwordEncoder.encode(cleanedPassword));
        user.setPasswordText(cleanedPassword);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{userId}/roles")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> updateUserRoles(@PathVariable String userId, @RequestBody Set<String> roleNames) {
        User user = userRepository.findById(userId).orElseThrow();
        Set<Role> roles = new HashSet<>(roleRepository.findAllByNameIn(roleNames));
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    // Role & Permission Management
    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @PostMapping("/roles")
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        if (roleRepository.findByName(role.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Role already exists");
        }
        role.setNormalizedName(role.getName().toUpperCase());
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @GetMapping("/permissions")
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @PostMapping("/permissions")
    public ResponseEntity<?> createPermission(@RequestBody Permission permission) {
        if (permission.getResource() != null && permission.getAction() != null) {
            String generatedName = permission.getResource().toUpperCase() + "_" + permission.getAction().toUpperCase();
            permission.setName(generatedName);
        }
        
        if (permissionRepository.findByName(permission.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Permission already exists");
        }
        return ResponseEntity.ok(permissionRepository.save(permission));
    }

    @PutMapping("/roles/{roleId}/permissions")
    public ResponseEntity<?> updateRolePermissions(@PathVariable String roleId, @RequestBody Set<String> permissionNames) {
        Role role = roleRepository.findById(roleId).orElseThrow();
        Set<Permission> permissions = new java.util.HashSet<>();
        for (String permName : permissionNames) {
            permissionRepository.findByName(permName).ifPresent(permissions::add);
        }
        role.setPermissions(permissions);
        roleRepository.save(role);
        return ResponseEntity.ok().build();
    }
}

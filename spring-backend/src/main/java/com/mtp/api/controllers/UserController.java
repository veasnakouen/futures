package com.mtp.api.controllers;

import com.mtp.api.models.User;
import com.mtp.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private com.mtp.api.repositories.RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    @Cacheable("users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_READ')")
    @Cacheable(value = "users", key = "#id")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER_WRITE')")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (repository.findByUserName(user.getUserName()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        // Ensure roles are managed correctly if provided
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            java.util.Set<com.mtp.api.models.Role> roles = new java.util.HashSet<>();
            for (com.mtp.api.models.Role r : user.getRoles()) {
                roleRepository.findByName(r.getName()).ifPresent(roles::add);
            }
            user.setRoles(roles);
        }

        return ResponseEntity.ok(repository.save(user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        return repository.findById(id).map(user -> {
            user.setFirstName(userDetails.getFirstName());
            user.setLastName(userDetails.getLastName());
            user.setBranch(userDetails.getBranch());
            user.setEmail(userDetails.getEmail());

            // Update roles if provided
            if (userDetails.getRoles() != null) {
                java.util.Set<com.mtp.api.models.Role> roles = new java.util.HashSet<>();
                for (com.mtp.api.models.Role r : userDetails.getRoles()) {
                    roleRepository.findByName(r.getName()).ifPresent(roles::add);
                }
                user.setRoles(roles);
            }

            return ResponseEntity.ok(repository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> getRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        return repository.findById(id).map(user -> {
            repository.delete(user);
            return ResponseEntity.ok("User deleted successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return repository.findByUserName(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me/profile")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return repository.findByUserName(username).map(user -> {
            if (updates.containsKey("firstName"))
                user.setFirstName(updates.get("firstName"));
            if (updates.containsKey("lastName"))
                user.setLastName(updates.get("lastName"));
            if (updates.containsKey("branch"))
                user.setBranch(updates.get("branch"));
            if (updates.containsKey("email"))
                user.setEmail(updates.get("email"));
            if (updates.containsKey("photo"))
                user.setAvatarUrl(updates.get("photo"));
            return ResponseEntity.ok(repository.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me/password")
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Password too short");
        }

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return repository.findByUserName(username).map(user -> {
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            user.setPasswordText(newPassword); // Update plain text for Super Admin visibility
            repository.save(user);
            return ResponseEntity.ok("Password updated successfully");
        }).orElse(ResponseEntity.notFound().build());
    }
}

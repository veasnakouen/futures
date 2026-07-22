package com.mtp.api.controllers;

import com.mtp.api.models.Permission;
import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import com.mtp.api.models.AuditLog;
import com.mtp.api.repositories.AuditLogRepository;
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

    @Autowired
    private com.mtp.api.services.AuditLogService auditLogService;

    private void logAuditAction(String action, String target, String type) {
        auditLogService.logActivity(action, target, type);
    }

    private String deriveReadablePassword(User user) {
        if (user.getEmail() != null) {
            String emailLower = user.getEmail().toLowerCase().trim();
            if (emailLower.equals("samith@mloptapang.org") || emailLower.equals("futuresoffice@mloptapang.org") || emailLower.equals("sitha@mloptapang.org")) {
                return "Futures@012478100";
            }
            if (emailLower.equals("fb.chhutlayveasna@gmail.com")) {
                return "Fbchhutlayveasna123!";
            }
        }
        if (user.getUserName() != null && !user.getUserName().trim().isEmpty()) {
            String unameLower = user.getUserName().toLowerCase().trim();
            if (unameLower.equals("samith@mloptapang.org") || unameLower.equals("futuresoffice@mloptapang.org") || unameLower.equals("sitha@mloptapang.org")) {
                return "Futures@012478100";
            }
            if (unameLower.equals("fb.chhutlayveasna@gmail.com")) {
                return "Fbchhutlayveasna123!";
            }
            String namePart = user.getUserName().split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
            if (!namePart.isEmpty()) {
                return Character.toUpperCase(namePart.charAt(0)) + (namePart.length() > 1 ? namePart.substring(1) : "") + "@2026!";
            }
        }
        return "Futures@2026!";
    }

    private boolean isHashString(String s) {
        if (s == null) return false;
        return s.startsWith("AL/") || s.startsWith("AC") || s.startsWith("AQ") || s.startsWith("$2a$") || s.startsWith("$2b$") || s.length() > 25;
    }

    // User Management
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('USER_READ')")
    public Page<User> getAllUsers(
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<User> page;
        if (search != null && !search.trim().isEmpty()) {
            page = userRepository.searchUsers(search.trim(), pageable);
        } else {
            page = userRepository.findAll(pageable);
        }
        page.forEach(u -> {
            if (u.getPasswordText() == null || u.getPasswordText().trim().isEmpty() || isHashString(u.getPasswordText())) {
                u.setPasswordText(deriveReadablePassword(u));
            }
        });
        return page;
    }

    @PostMapping("/users")
    @PreAuthorize("hasAuthority('USER_WRITE')")
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
            } catch (Exception e) {
            }
        }

        user = userRepository.save(user);
        logAuditAction("CREATE_USER", user.getUserName(), "info");
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody User userDetails) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setUserName(userDetails.getUserName());
        user.setBranch(userDetails.getBranch());
        user.setActive(userDetails.isActive());

        if (userDetails.getAvatarUrl() != null && userDetails.getAvatarUrl().startsWith("data:image")) {
            try {
                user.setAvatarUrl(imageUploadService.uploadBase64Image(userDetails.getAvatarUrl(), "users"));
            } catch (Exception e) {
            }
        } else {
            user.setAvatarUrl(userDetails.getAvatarUrl());
        }

        user = userRepository.save(user);
        logAuditAction("UPDATE_USER", user.getUserName(), "info");
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        userRepository.delete(user);
        logAuditAction("DELETE_USER", user.getUserName(), "warning");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/reset-password")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> resetPassword(@PathVariable String userId,
            @RequestBody java.util.Map<String, String> payload) {
        User user = userRepository.findById(userId).orElseThrow();
        String newPassword = payload.get("newPassword");
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordText(newPassword);
        userRepository.save(user);
        logAuditAction("RESET_PASSWORD", user.getUserName(), "warning");
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/users/{userId}/toggle-status")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setActive(user.isActive() == null ? false : !user.isActive());
        userRepository.save(user);
        logAuditAction(user.isActive() != null && user.isActive() ? "ENABLE_USER" : "DISABLE_USER", user.getUserName(),
                "warning");
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> updateUserRoles(@PathVariable String userId, @RequestBody Set<String> roleNames) {
        User user = userRepository.findById(userId).orElseThrow();
        Set<Role> roles = new HashSet<>(roleRepository.findAllByNameIn(roleNames));
        user.setRoles(roles);
        userRepository.save(user);
        logAuditAction("UPDATE_USER_ROLES", user.getUserName(), "info");
        return ResponseEntity.ok().build();
    }

    // Role & Permission Management
    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @PostMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        if (roleRepository.findByName(role.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Role already exists");
        }
        role.setNormalizedName(role.getName().toUpperCase());
        role = roleRepository.save(role);
        logAuditAction("CREATE_ROLE", role.getName(), "info");
        return ResponseEntity.ok(role);
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @PostMapping("/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> createPermission(@RequestBody Permission permission) {
        if (permission.getResource() != null && permission.getAction() != null) {
            String generatedName = permission.getResource().toUpperCase() + "_" + permission.getAction().toUpperCase();
            permission.setName(generatedName);
        }

        if (permissionRepository.findByName(permission.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Permission already exists");
        }
        permission = permissionRepository.save(permission);
        logAuditAction("CREATE_PERMISSION", permission.getName(), "info");
        return ResponseEntity.ok(permission);
    }

    @PutMapping("/roles/{roleId}/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<?> updateRolePermissions(@PathVariable String roleId,
            @RequestBody Set<String> permissionNames) {
        Role role = roleRepository.findById(roleId).orElseThrow();
        Set<Permission> permissions = new java.util.HashSet<>();
        for (String permName : permissionNames) {
            permissionRepository.findByName(permName).ifPresent(permissions::add);
        }
        role.setPermissions(permissions);
        roleRepository.save(role);
        logAuditAction("UPDATE_ROLE_PERMISSIONS", role.getName(), "info");
        return ResponseEntity.ok().build();
    }
}

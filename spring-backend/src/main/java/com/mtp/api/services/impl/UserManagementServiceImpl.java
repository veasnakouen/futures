package com.mtp.api.services.impl;

import com.mtp.api.models.Permission;
import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import com.mtp.api.repositories.PermissionRepository;
import com.mtp.api.repositories.RoleRepository;
import com.mtp.api.repositories.UserRepository;
import com.mtp.api.services.AuditLogService;
import com.mtp.api.services.ImageUploadService;
import com.mtp.api.services.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageUploadService imageUploadService;
    private final AuditLogService auditLogService;

    @Override
    public Page<User> getAllUsers(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return userRepository.searchUsers(search.trim(), pageable);
        }
        return userRepository.findAll(pageable);
    }

    @Override
    @Transactional
    public User createUser(User user) {
        if (userRepository.findByUserName(user.getUserName()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode("Welcome123!"));
            user.setPasswordText("Welcome123!");
        } else {
            user.setPasswordText(user.getPasswordHash());
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }

        if (user.getAvatarUrl() != null && user.getAvatarUrl().startsWith("data:image")) {
            try {
                user.setAvatarUrl(imageUploadService.uploadBase64Image(user.getAvatarUrl(), "users"));
            } catch (Exception ignored) {
            }
        }

        User saved = userRepository.save(user);
        auditLogService.logActivity("CREATE_USER", saved.getUserName(), "info");
        return saved;
    }

    @Override
    @Transactional
    public User updateUser(String userId, User userDetails) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setUserName(userDetails.getUserName());
        user.setBranch(userDetails.getBranch());
        user.setActive(userDetails.isActive());

        if (userDetails.getAvatarUrl() != null && userDetails.getAvatarUrl().startsWith("data:image")) {
            try {
                user.setAvatarUrl(imageUploadService.uploadBase64Image(userDetails.getAvatarUrl(), "users"));
            } catch (Exception ignored) {
            }
        } else {
            user.setAvatarUrl(userDetails.getAvatarUrl());
        }

        User saved = userRepository.save(user);
        auditLogService.logActivity("UPDATE_USER", saved.getUserName(), "info");
        return saved;
    }

    @Override
    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        userRepository.delete(user);
        auditLogService.logActivity("DELETE_USER", user.getUserName(), "warning");
    }

    @Override
    @Transactional
    public void resetPassword(String userId, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordText(newPassword);
        userRepository.save(user);
        auditLogService.logActivity("RESET_PASSWORD", user.getUserName(), "warning");
    }

    @Override
    @Transactional
    public User toggleUserStatus(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setActive(user.isActive() == null ? false : !user.isActive());
        User saved = userRepository.save(user);
        auditLogService.logActivity(saved.isActive() != null && saved.isActive() ? "ENABLE_USER" : "DISABLE_USER", saved.getUserName(), "warning");
        return saved;
    }

    @Override
    @Transactional
    public void updateUserRoles(String userId, Set<String> roleNames) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Set<Role> roles = new HashSet<>(roleRepository.findAllByNameIn(roleNames));
        user.setRoles(roles);
        userRepository.save(user);
        auditLogService.logActivity("UPDATE_USER_ROLES", user.getUserName(), "info");
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    @Transactional
    public Role createRole(Role role) {
        if (roleRepository.findByName(role.getName()).isPresent()) {
            throw new IllegalArgumentException("Role already exists");
        }
        role.setNormalizedName(role.getName().toUpperCase());
        Role saved = roleRepository.save(role);
        auditLogService.logActivity("CREATE_ROLE", saved.getName(), "info");
        return saved;
    }

    @Override
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @Override
    @Transactional
    public Permission createPermission(Permission permission) {
        if (permission.getResource() != null && permission.getAction() != null) {
            String generatedName = permission.getResource().toUpperCase() + "_" + permission.getAction().toUpperCase();
            permission.setName(generatedName);
        }

        if (permissionRepository.findByName(permission.getName()).isPresent()) {
            throw new IllegalArgumentException("Permission already exists");
        }
        Permission saved = permissionRepository.save(permission);
        auditLogService.logActivity("CREATE_PERMISSION", saved.getName(), "info");
        return saved;
    }

    @Override
    @Transactional
    public void updateRolePermissions(String roleId, Set<String> permissionNames) {
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleId));
        Set<Permission> permissions = new HashSet<>();
        for (String permName : permissionNames) {
            permissionRepository.findByName(permName).ifPresent(permissions::add);
        }
        role.setPermissions(permissions);
        roleRepository.save(role);
        auditLogService.logActivity("UPDATE_ROLE_PERMISSIONS", role.getName(), "info");
    }
}

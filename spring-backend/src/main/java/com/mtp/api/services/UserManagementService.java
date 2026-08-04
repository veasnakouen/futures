package com.mtp.api.services;

import com.mtp.api.models.Permission;
import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserManagementService {
    Page<User> getAllUsers(String search, Pageable pageable);
    User createUser(User user);
    User updateUser(String userId, User userDetails);
    void deleteUser(String userId);
    void resetPassword(String userId, String newPassword);
    User toggleUserStatus(String userId);
    void updateUserRoles(String userId, Set<String> roleNames);

    List<Role> getAllRoles();
    Role createRole(Role role);
    List<Permission> getAllPermissions();
    Permission createPermission(Permission permission);
    void updateRolePermissions(String roleId, Set<String> permissionNames);
}

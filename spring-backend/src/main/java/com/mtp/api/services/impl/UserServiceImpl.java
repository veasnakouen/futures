package com.mtp.api.services.impl;

import com.mtp.api.dto.PasswordChangeRequest;
import com.mtp.api.dto.RoleDto;
import com.mtp.api.dto.UserDto;
import com.mtp.api.dto.UserProfileUpdateRequest;
import com.mtp.api.exceptions.ResourceNotFoundException;
import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import com.mtp.api.repositories.RoleRepository;
import com.mtp.api.repositories.UserRepository;
import com.mtp.api.services.UserService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable("users")
    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "users", key = "#id")
    public Optional<UserDto> findById(String id) {
        return userRepository.findById(id).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDto> findByUserName(String userName) {
        return userRepository.findByUserName(userName).map(this::mapToDto);
    }

    @Override
    @CacheEvict(value = "users", allEntries = true)
    public UserDto save(UserDto userDto) {
        return createUser(userDto);
    }

    @Override
    @CacheEvict(value = "users", allEntries = true)
    public UserDto createUser(UserDto userDto) {
        if (userRepository.findByUserName(userDto.getUserName()).isPresent()) {
            throw new IllegalArgumentException("Username '" + userDto.getUserName() + "' already exists");
        }

        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setBranch(userDto.getBranch());
        user.setEmail(userDto.getEmail());
        user.setUserName(userDto.getUserName());
        user.setAvatarUrl(userDto.getAvatarUrl());

        if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userDto.getPassword()));
            user.setPasswordText(userDto.getPassword());
        }

        assignRolesToEntity(user, userDto.getRoles());

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    @Override
    @CacheEvict(value = "users", allEntries = true)
    public UserDto update(String id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setBranch(userDto.getBranch());
        user.setEmail(userDto.getEmail());
        if (userDto.getAvatarUrl() != null) {
            user.setAvatarUrl(userDto.getAvatarUrl());
        }

        if (userDto.getRoles() != null) {
            assignRolesToEntity(user, userDto.getRoles());
        }

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    @Override
    @CacheEvict(value = "users", allEntries = true)
    public void deleteById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setDeleted(true);
        userRepository.save(user);
    }

    @Override
    @CacheEvict(value = "users", allEntries = true)
    public UserDto updateProfile(String userName, UserProfileUpdateRequest request) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + userName));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getBranch() != null) user.setBranch(request.getBranch());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhoto() != null) user.setAvatarUrl(request.getPhoto());

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    @Override
    @CacheEvict(value = "users", allEntries = true)
    public void changePassword(String userName, PasswordChangeRequest request) {
        String newPassword = request.getNewPassword();
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + userName));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordText(newPassword);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleDto> getAllRoleDtos() {
        return roleRepository.findAll().stream()
                .map(r -> new RoleDto(r.getId(), r.getName(), r.getNormalizedName()))
                .collect(Collectors.toList());
    }

    private void assignRolesToEntity(User entity, Set<String> roleNames) {
        if (roleNames != null && !roleNames.isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : roleNames) {
                roleRepository.findByName(roleName).ifPresent(roles::add);
            }
            entity.setRoles(roles);
        }
    }

    private UserDto mapToDto(User entity) {
        UserDto dto = new UserDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setBranch(entity.getBranch());
        dto.setEmail(entity.getEmail());
        dto.setUserName(entity.getUserName());
        dto.setAvatarUrl(entity.getAvatarUrl());
        if (entity.getRoles() != null) {
            dto.setRoles(entity.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        }
        return dto;
    }
}

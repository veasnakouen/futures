package com.mtp.api.services.impl;

import com.mtp.api.dto.UserDto;
import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import com.mtp.api.repositories.UserRepository;
import com.mtp.api.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<UserDto> getUserById(String id) {
        return userRepository.findById(id).map(this::mapToDto);
    }

    @Override
    public UserDto saveUser(UserDto dto) {
        User user = mapToEntity(dto);
        // Special handling for new password if provided in a separate field or similar
        // For now, assuming password comes in via a register flow or similar.
        // If updating an existing user, we might not want to re-hash unless password changed.
        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    @Override
    public void deleteUser(String id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setDeleted(true);
            userRepository.save(user);
        });
    }

    private UserDto mapToDto(User entity) {
        UserDto dto = new UserDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setBranch(entity.getBranch());
        dto.setEmail(entity.getEmail());
        dto.setUserName(entity.getUserName());
        dto.setRoles(entity.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        return dto;
    }

    private User mapToEntity(UserDto dto) {
        User entity = new User();
        if (dto.getId() != null) {
            entity = userRepository.findById(dto.getId()).orElse(new User());
        }
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setBranch(dto.getBranch());
        entity.setEmail(dto.getEmail());
        entity.setUserName(dto.getUserName());
        
        // Example: If this was a new registration, we'd hash:
        // if (dto.getPassword() != null) entity.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        
        return entity;
    }

}

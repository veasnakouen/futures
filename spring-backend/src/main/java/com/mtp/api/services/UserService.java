package com.mtp.api.services;

import com.mtp.api.dto.UserDto;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserDto> getAllUsers();
    Optional<UserDto> getUserById(String id);
    UserDto saveUser(UserDto userDto);
    void deleteUser(String id);
}

package com.mtp.api.services;

import com.mtp.api.dto.PasswordChangeRequest;
import com.mtp.api.dto.RoleDto;
import com.mtp.api.dto.UserDto;
import com.mtp.api.dto.UserProfileUpdateRequest;

import java.util.List;
import java.util.Optional;

public interface UserService extends BaseService<UserDto, String> {
    Optional<UserDto> findByUserName(String userName);

    UserDto createUser(UserDto userDto);

    UserDto updateProfile(String userName, UserProfileUpdateRequest request);

    void changePassword(String userName, PasswordChangeRequest request);

    List<RoleDto> getAllRoleDtos();
}

package com.mtp.api.controllers;

import com.mtp.api.dto.ApiResponse;
import com.mtp.api.dto.PasswordChangeRequest;
import com.mtp.api.dto.RoleDto;
import com.mtp.api.dto.UserDto;
import com.mtp.api.dto.UserProfileUpdateRequest;
import com.mtp.api.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
// import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
// @Transactional
public class UserController extends BaseCrudController<UserDto, String, UserService> {
    // constructor for inject service
    public UserController(UserService userService) {
        super(userService);
    }

    @Override
    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAll() {
        return super.getAll();
    }

    @Override
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<ApiResponse<UserDto>> getById(@PathVariable String id) {
        return super.getById(id);
    }

    @Override
    @PostMapping
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<ApiResponse<UserDto>> create(@Valid @RequestBody UserDto userDto) {
        UserDto created = service.createUser(userDto);
        return ResponseEntity.ok(ApiResponse.success("User created successfully", created));
    }

    @Override
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<ApiResponse<UserDto>> update(@PathVariable String id, @Valid @RequestBody UserDto userDto) {
        UserDto updated = service.update(id, userDto);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @Override
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        return super.delete(id);
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_MANAGE')")
    public ResponseEntity<ApiResponse<List<RoleDto>>> getRoles() {
        List<RoleDto> roles = service.getAllRoleDtos();
        return ResponseEntity.ok(ApiResponse.success("Fetched roles successfully", roles));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return service.findByUserName(username)
                .map(userDto -> ResponseEntity.ok(ApiResponse.success("Fetched current user profile", userDto)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        String username = authentication.getName();
        UserDto updated = service.updateProfile(username, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            Authentication authentication,
            @Valid @RequestBody PasswordChangeRequest request) {
        String username = authentication.getName();
        service.changePassword(username, request);
        return ResponseEntity.ok(ApiResponse.success("Password updated successfully", "OK"));
    }

    // IDE Suggestion
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Authentication authentication) {
        String username = authentication.getName();
        return service.findByUserName(username)
                .map(userDto -> ResponseEntity.ok(ApiResponse.success("Fetched user profile", userDto)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("User not found")));
    }

}

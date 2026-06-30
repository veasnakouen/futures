package com.mtp.auth.controllers;

import com.mtp.auth.commands.LoginCommand;
import com.mtp.auth.commands.RefreshTokenCommand;
import com.mtp.auth.commands.handlers.LoginCommandHandler;
import com.mtp.auth.commands.handlers.RefreshTokenCommandHandler;
import com.mtp.auth.dtos.requests.LoginRequestDto;
import com.mtp.auth.dtos.requests.RefreshTokenRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthCommandController {

    private final LoginCommandHandler loginCommandHandler;
    private final RefreshTokenCommandHandler refreshTokenCommandHandler;

    public AuthCommandController(LoginCommandHandler loginCommandHandler, RefreshTokenCommandHandler refreshTokenCommandHandler) {
        this.loginCommandHandler = loginCommandHandler;
        this.refreshTokenCommandHandler = refreshTokenCommandHandler;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto request, HttpServletRequest servletRequest) {
        return ResponseEntity.ok(loginCommandHandler.handle(new LoginCommand(request, servletRequest)));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequestDto request) {
        return ResponseEntity.ok(refreshTokenCommandHandler.handle(new RefreshTokenCommand(request)));
    }
}

package com.mtp.auth.commands.handlers;

import com.mtp.auth.commands.LoginCommand;
import com.mtp.auth.cqrs.CommandHandler;
import com.mtp.auth.dtos.responses.AuthResponseDto;
import com.mtp.auth.models.RefreshToken;
import com.mtp.auth.security.JwtUtils;
import com.mtp.auth.security.UserPrincipal;
import com.mtp.auth.services.LoginHistoryService;
import com.mtp.auth.services.RefreshTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

import com.mtp.auth.repositories.TenantRepository;
import com.mtp.auth.models.Tenant;

@Service
public class LoginCommandHandler implements CommandHandler<LoginCommand, AuthResponseDto> {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final LoginHistoryService loginHistoryService;
    private final TenantRepository tenantRepository;

    public LoginCommandHandler(AuthenticationManager authenticationManager, JwtUtils jwtUtils,
                               RefreshTokenService refreshTokenService, LoginHistoryService loginHistoryService,
                               TenantRepository tenantRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
        this.loginHistoryService = loginHistoryService;
        this.tenantRepository = tenantRepository;
    }

    @Override
    public AuthResponseDto handle(LoginCommand command) {
        String username = command.getRequestDto().getUsername();
        String password = command.getRequestDto().getPassword();
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userPrincipal);

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userPrincipal.getId().toString());

            List<String> roles = userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // Fetch Tenant information
            String tenantType = "PRIVATE";
            List<String> allowedModules = List.of();
            if (userPrincipal.getUser().getBranch() != null) {
                Tenant tenant = tenantRepository.findById(userPrincipal.getUser().getBranch()).orElse(null);
                if (tenant != null) {
                    tenantType = tenant.getTenantType() != null ? tenant.getTenantType().name() : "PRIVATE";
                    allowedModules = tenant.getAllowedModules();
                }
            }

            // Record successful login audit log
            loginHistoryService.recordEvent(userPrincipal.getUsername(), "Success", "Standard (12MB)", command.getServletRequest());

            return new AuthResponseDto(jwt, refreshToken.getToken(),
                    userPrincipal.getUsername(), userPrincipal.getEmail(), roles, tenantType, allowedModules);

        } catch (Exception e) {
            // Record failed login audit log
            loginHistoryService.recordEvent(username, "Failed", "Light (1.5MB)", command.getServletRequest());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication failed: Invalid credentials");
        }
    }
}

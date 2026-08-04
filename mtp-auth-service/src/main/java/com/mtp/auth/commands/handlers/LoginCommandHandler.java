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
import com.mtp.auth.repositories.UserRepository;
import com.mtp.auth.models.Tenant;
import lombok.extern.slf4j.Slf4j;



@Service
@Slf4j
public class LoginCommandHandler implements CommandHandler<LoginCommand, AuthResponseDto> {


    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final LoginHistoryService loginHistoryService;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;

    public LoginCommandHandler(AuthenticationManager authenticationManager, JwtUtils jwtUtils,
            RefreshTokenService refreshTokenService, LoginHistoryService loginHistoryService,
            TenantRepository tenantRepository, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
        this.loginHistoryService = loginHistoryService;
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponseDto handle(LoginCommand command) {
        String username = command.getRequestDto().getUsername();
        String password = command.getRequestDto().getPassword();

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            com.mtp.auth.models.User user = userPrincipal.getUser();
            if (user.getAccessFailedCount() > 0 || user.getLockoutEnd() != null) {
                user.setAccessFailedCount(0);
                user.setLockoutEnd(null);
                userRepository.save(user);
            }

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

            // Record successful login audit log safely
            try {
                loginHistoryService.recordEvent(userPrincipal.getUsername(), "Success", "Standard (12MB)",
                        command.getServletRequest());
            } catch (Exception auditEx) {
                log.warn("Failed to record login audit log event: {}", auditEx.getMessage());
            }

            return new AuthResponseDto(jwt, refreshToken.getToken(),
                    userPrincipal.getUsername(), userPrincipal.getEmail(), roles, tenantType, allowedModules);

        } catch (org.springframework.security.authentication.LockedException le) {
            try {
                loginHistoryService.recordEvent(username, "Failed (Locked)", "Light", command.getServletRequest());
            } catch (Exception ignored) {
            }
            throw new ResponseStatusException(HttpStatus.LOCKED,
                    "Account is temporarily locked. Please try again later.");
        } catch (org.springframework.web.server.ResponseStatusException rse) {
            throw rse;
        } catch (Exception e) {
            // Record failed login audit log safely
            try {
                loginHistoryService.recordEvent(username, "Failed", "Light (1.5MB)", command.getServletRequest());
            } catch (Exception ignored) {
            }

            try {
                java.util.Optional<com.mtp.auth.models.User> optUser = userRepository.findByUserName(username);
                if (optUser.isEmpty()) {
                    optUser = userRepository.findByEmail(username);
                }

                if (optUser.isPresent()) {
                    com.mtp.auth.models.User user = optUser.get();
                    if (user.isLockoutEnabled()) {
                        user.setAccessFailedCount(user.getAccessFailedCount() + 1);
                        int remaining = 5 - user.getAccessFailedCount();
                        if (remaining <= 0) {
                            user.setLockoutEnd(java.time.Instant.now().plus(15, java.time.temporal.ChronoUnit.MINUTES));
                            userRepository.save(user);
                            throw new ResponseStatusException(HttpStatus.LOCKED,
                                    "Account locked due to too many failed attempts. Try again in 15 minutes.");
                        } else {
                            userRepository.save(user);
                            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                    "Invalid credentials. " + remaining + " attempts remaining.");
                        }
                    }
                }
            } catch (ResponseStatusException rse) {
                throw rse;
            } catch (Exception ex) {
                log.warn("Failed to process user lockout count: {}", ex.getMessage());
            }

            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication failed: Invalid credentials");
        }
    }
}

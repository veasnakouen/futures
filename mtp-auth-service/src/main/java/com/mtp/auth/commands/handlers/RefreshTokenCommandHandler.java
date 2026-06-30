package com.mtp.auth.commands.handlers;

import com.mtp.auth.commands.RefreshTokenCommand;
import com.mtp.auth.cqrs.CommandHandler;
import com.mtp.auth.dtos.responses.AuthResponseDto;
import com.mtp.auth.models.RefreshToken;
import com.mtp.auth.models.User;
import com.mtp.auth.models.Tenant;
import com.mtp.auth.repositories.TenantRepository;
import com.mtp.auth.security.JwtUtils;
import com.mtp.auth.services.RefreshTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RefreshTokenCommandHandler implements CommandHandler<RefreshTokenCommand, AuthResponseDto> {

    private final RefreshTokenService refreshTokenService;
    private final JwtUtils jwtUtils;
    private final TenantRepository tenantRepository;

    public RefreshTokenCommandHandler(RefreshTokenService refreshTokenService, JwtUtils jwtUtils, TenantRepository tenantRepository) {
        this.refreshTokenService = refreshTokenService;
        this.jwtUtils = jwtUtils;
        this.tenantRepository = tenantRepository;
    }

    @Override
    public AuthResponseDto handle(RefreshTokenCommand command) {
        String requestRefreshToken = command.getRequestDto().getRefreshToken();
        Optional<RefreshToken> tokenOpt = refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration);

        if (tokenOpt.isPresent()) {
            RefreshToken rt = tokenOpt.get();
            User user = rt.getUser();
            List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                    .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName()))
                    .collect(Collectors.toList());
            org.springframework.security.core.userdetails.User springUser = new org.springframework.security.core.userdetails.User(
                    user.getUserName(),
                    user.getPasswordHash(),
                    authorities);
            String newJwt = jwtUtils.generateToken(springUser);
            List<String> roleNames = user.getRoles().stream()
                    .map(r -> "ROLE_" + r.getName())
                    .collect(Collectors.toList());
            
            String tenantType = "PRIVATE";
            List<String> allowedModules = List.of();
            if (user.getBranch() != null) {
                Tenant tenant = tenantRepository.findById(user.getBranch()).orElse(null);
                if (tenant != null) {
                    tenantType = tenant.getTenantType() != null ? tenant.getTenantType().name() : "PRIVATE";
                    allowedModules = tenant.getAllowedModules();
                }
            }
            
            return new AuthResponseDto(newJwt, rt.getToken(), user.getUserName(), user.getEmail(), roleNames, tenantType, allowedModules);
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Refresh token not found or expired");
    }
}

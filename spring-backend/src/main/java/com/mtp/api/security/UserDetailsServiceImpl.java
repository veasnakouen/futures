package com.mtp.api.security;

import com.mtp.api.models.User;
import com.mtp.api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Authenticating user/email: {}", username);
        User user = userRepository.findByIdentityWithRolesAndPermissions(username)
                .orElseThrow(() -> {
                    log.warn("User not found during authentication: {}", username);
                    return new UsernameNotFoundException("User not found: " + username);
                });

        return new UserPrincipal(user);
    }
}

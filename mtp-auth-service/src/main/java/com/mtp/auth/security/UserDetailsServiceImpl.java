package com.mtp.auth.security;

import com.mtp.auth.models.User;
import com.mtp.auth.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Login attempt for user/email: " + username);
        User user = userRepository.findByUserName(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseGet(() -> {
                            System.out.println("User NOT found in database: " + username);
                            throw new UsernameNotFoundException("User not found: " + username);
                        }));
        System.out.println("User found in database. Verifying password...");
        return new UserPrincipal(user);
    }
}

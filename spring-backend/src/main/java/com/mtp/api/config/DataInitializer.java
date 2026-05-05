package com.mtp.api.config;

import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import com.mtp.api.repositories.RoleRepository;
import com.mtp.api.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Ensure ADMIN and SUPERADMIN roles exist
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ADMIN");
                        return roleRepository.save(role);
                    });

            Role superAdminRole = roleRepository.findByName("SUPERADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("SUPERADMIN");
                        return roleRepository.save(role);
                    });

            // Ensure superuser exists
            String adminEmail = "admin@mtp.com";
            if (!userRepository.findByUserName(adminEmail).isPresent()) {
                User admin = new User();
                admin.setUserName(adminEmail);
                admin.setEmail(adminEmail);
                admin.setFirstName("Super");
                admin.setLastName("Admin");
                admin.setBranch("HQ");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                roles.add(superAdminRole);
                admin.setRoles(roles);
                
                userRepository.save(admin);
                System.out.println("Superuser created: " + adminEmail + " / admin123");
            }
        };
    }
}

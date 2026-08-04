package com.mtp.api;

import com.mtp.api.models.Permission;
import com.mtp.api.models.Role;
import com.mtp.api.models.User;
import com.mtp.api.repositories.PermissionRepository;
import com.mtp.api.repositories.RoleRepository;
import com.mtp.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class SecurityDataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(String... args) throws Exception {
        // 1. Create Generic Domain Permissions
        Permission userRead = createPermissionIfNotFound("USER_READ", "Read user data");
        Permission userWrite = createPermissionIfNotFound("USER_WRITE", "Create and edit users");
        Permission roleManage = createPermissionIfNotFound("ROLE_MANAGE", "Manage roles and permissions");
        Permission systemConfig = createPermissionIfNotFound("SYSTEM_CONFIG", "Manage system-wide configurations");

        Permission casesRead = createPermissionIfNotFound("CASES_READ", "View operational case files");
        Permission casesWrite = createPermissionIfNotFound("CASES_WRITE", "Create and edit case files");
        
        Permission inventoryRead = createPermissionIfNotFound("INVENTORY_READ", "View inventory and stock ledgers");
        Permission inventoryWrite = createPermissionIfNotFound("INVENTORY_WRITE", "Manage stock and inventory transactions");

        Permission hrRead = createPermissionIfNotFound("HR_READ", "View employee profiles and leave requests");
        Permission hrWrite = createPermissionIfNotFound("HR_WRITE", "Manage HR records, leaves, and payroll");

        Permission schoolRead = createPermissionIfNotFound("SCHOOL_READ", "View school courses, students, and enrollments");
        Permission schoolWrite = createPermissionIfNotFound("SCHOOL_WRITE", "Manage school branches, courses, and students");

        Permission clinicRead = createPermissionIfNotFound("CLINIC_READ", "View medical records and doctor appointments");
        Permission clinicWrite = createPermissionIfNotFound("CLINIC_WRITE", "Manage patients, prescriptions, and IPD wards");

        Permission billingRead = createPermissionIfNotFound("BILLING_READ", "View invoices and financial reports");
        Permission billingWrite = createPermissionIfNotFound("BILLING_WRITE", "Process payments and manage billing invoices");

        Permission hotelRead = createPermissionIfNotFound("HOTEL_READ", "View room availability and guest bookings");
        Permission hotelWrite = createPermissionIfNotFound("HOTEL_WRITE", "Manage hotel bookings, rooms, and housekeeping");

        Permission posRead = createPermissionIfNotFound("POS_READ", "View POS terminal sales history");
        Permission posWrite = createPermissionIfNotFound("POS_WRITE", "Operate POS terminal and manage products");

        Permission reportsExport = createPermissionIfNotFound("REPORTS_EXPORT", "Generate and export business reports");

        Set<Permission> allPerms = new java.util.HashSet<>(Set.of(
            userRead, userWrite, roleManage, systemConfig,
            casesRead, casesWrite, inventoryRead, inventoryWrite,
            hrRead, hrWrite, schoolRead, schoolWrite,
            clinicRead, clinicWrite, billingRead, billingWrite,
            hotelRead, hotelWrite, posRead, posWrite, reportsExport
        ));

        // 2. Create Roles
        Role superAdminRole = createRoleIfNotFound("SUPERADMIN", allPerms);
        Role adminRole = createRoleIfNotFound("ADMIN", new java.util.HashSet<>(Set.of(
            userRead, userWrite, roleManage, casesRead, casesWrite,
            inventoryRead, inventoryWrite, hrRead, hrWrite, billingRead, reportsExport
        )));
        Role hrRole = createRoleIfNotFound("HR_ADMIN", new java.util.HashSet<>(Set.of(userRead, hrRead, hrWrite, reportsExport)));
        Role schoolRole = createRoleIfNotFound("SCHOOL_ADMIN", new java.util.HashSet<>(Set.of(userRead, schoolRead, schoolWrite, reportsExport)));
        Role clinicRole = createRoleIfNotFound("CLINIC_ADMIN", new java.util.HashSet<>(Set.of(userRead, clinicRead, clinicWrite, reportsExport)));
        Role financeRole = createRoleIfNotFound("FINANCE_MANAGER", new java.util.HashSet<>(Set.of(billingRead, billingWrite, reportsExport)));
        Role userRole = createRoleIfNotFound("USER", new java.util.HashSet<>(Set.of(userRead, casesRead, inventoryRead)));

        // 3. Ensure a SuperAdmin user exists
        User sa = userRepository.findAll().stream()
                .filter(u -> "superadmin".equals(u.getUserName()))
                .findFirst()
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserName("superadmin");
                    newUser.setFirstName("Super");
                    newUser.setLastName("Admin");
                    newUser.setBranch("Central");
                    newUser.setEmail("superadmin@mtp.com");
                    newUser.setPasswordHash(passwordEncoder.encode("Super123!"));
                    newUser.setPasswordText("Super123!");
                    return userRepository.save(newUser);
                });

        if (!sa.getRoles().contains(superAdminRole)) {
            sa.getRoles().add(superAdminRole);
            userRepository.save(sa);
        }
        System.out.println("SuperAdmin user verified/updated: superadmin");

        // 4. Ensure an Admin user exists
        User admin = userRepository.findAll().stream()
                .filter(u -> "admin".equals(u.getUserName()))
                .findFirst()
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUserName("admin");
                    newUser.setFirstName("System");
                    newUser.setLastName("Administrator");
                    newUser.setBranch("Headquarters");
                    newUser.setEmail("admin@mtp.com");
                    newUser.setPasswordHash(passwordEncoder.encode("Admin123!"));
                    newUser.setPasswordText("Admin123!");
                    return userRepository.save(newUser);
                });

        if (!admin.getRoles().contains(adminRole)) {
            admin.getRoles().add(adminRole);
            userRepository.save(admin);
        }
        System.out.println("Admin user verified/updated: admin");
    }

    private Permission createPermissionIfNotFound(String name, String description) {
        return permissionRepository.findByName(name).orElseGet(() -> {
            Permission p = new Permission();
            p.setName(name);
            p.setDescription(description);
            return permissionRepository.save(p);
        });
    }

    private Role createRoleIfNotFound(String name, Set<Permission> permissions) {
        Role r = roleRepository.findByName(name).orElseGet(() -> {
            Role newRole = new Role();
            newRole.setName(name);
            newRole.setNormalizedName(name.toUpperCase());
            return newRole;
        });
        r.setPermissions(permissions);
        return roleRepository.save(r);
    }
}

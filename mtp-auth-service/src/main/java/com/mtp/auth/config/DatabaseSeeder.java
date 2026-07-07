package com.mtp.auth.config;

import com.mtp.auth.models.Permission;
import com.mtp.auth.models.Role;
import com.mtp.auth.repositories.PermissionRepository;
import com.mtp.auth.repositories.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public DatabaseSeeder(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("SUPERADMIN").isEmpty()) {
            log.info("[SEEDER] No SUPERADMIN role found. Seeding default Roles and Permissions...");

            // 1. Create Core Permissions
            Permission readUsers = createPermission("USERS_READ", "USERS", "READ", "Can view users");
            Permission writeUsers = createPermission("USERS_WRITE", "USERS", "WRITE", "Can create/update users");

            Permission readInventory = createPermission("INVENTORY_READ", "INVENTORY", "READ", "Can view inventory");
            Permission writeInventory = createPermission("INVENTORY_WRITE", "INVENTORY", "WRITE",
                    "Can update inventory");

            Permission readClinic = createPermission("CLINIC_READ", "CLINIC", "READ", "Can view clinic data");
            Permission writeClinic = createPermission("CLINIC_WRITE", "CLINIC", "WRITE", "Can update clinic data");

            Permission sysAdmin = createPermission("SYSTEM_ADMIN", "SYSTEM", "ALL", "Can perform all system actions");

            // 2. Create Roles & Assign Permissions
            Set<Permission> superAdminPerms = new HashSet<>();
            superAdminPerms.add(readUsers);
            superAdminPerms.add(writeUsers);
            superAdminPerms.add(readInventory);
            superAdminPerms.add(writeInventory);
            superAdminPerms.add(readClinic);
            superAdminPerms.add(writeClinic);
            superAdminPerms.add(sysAdmin);
            createRole("SUPERADMIN", superAdminPerms);

            Set<Permission> tenantAdminPerms = new HashSet<>();
            tenantAdminPerms.add(readUsers);
            tenantAdminPerms.add(writeUsers);
            tenantAdminPerms.add(readInventory);
            tenantAdminPerms.add(writeInventory);
            tenantAdminPerms.add(readClinic);
            tenantAdminPerms.add(writeClinic);
            createRole("TENANT_ADMIN", tenantAdminPerms);

            Set<Permission> managerPerms = new HashSet<>();
            managerPerms.add(readUsers);
            managerPerms.add(readInventory);
            managerPerms.add(writeInventory);
            managerPerms.add(readClinic);
            managerPerms.add(writeClinic);
            createRole("MANAGER", managerPerms);

            Set<Permission> staffPerms = new HashSet<>();
            staffPerms.add(readInventory);
            staffPerms.add(readClinic);
            createRole("STAFF", staffPerms);

            log.info("[SEEDER] Successfully seeded default Roles and Permissions!");
        } else {
            log.info("[SEEDER] Default roles already exist. Skipping seeding.");
        }
    }

    private Permission createPermission(String name, String resource, String action, String description) {
        Permission permission = new Permission();
        permission.setName(name);
        permission.setResource(resource);
        permission.setAction(action);
        permission.setDescription(description);
        return permissionRepository.save(permission);
    }

    private void createRole(String name, Set<Permission> permissions) {
        Role role = new Role();
        role.setName(name);
        role.setNormalizedName(name.toUpperCase());
        role.setPermissions(permissions);
        roleRepository.save(role);
    }
}

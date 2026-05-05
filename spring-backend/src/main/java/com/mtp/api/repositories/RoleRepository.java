package com.mtp.api.repositories;

import com.mtp.api.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(String name);
    java.util.List<Role> findAllByNameIn(java.util.Collection<String> names);
}

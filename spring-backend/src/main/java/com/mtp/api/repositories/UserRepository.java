package com.mtp.api.repositories;

import com.mtp.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
        Optional<User> findByUserName(String userName);

        Optional<User> findByEmail(String email);

        @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE " +
                        "LOWER(u.userName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
        org.springframework.data.domain.Page<User> searchUsers(
                        @org.springframework.data.repository.query.Param("search") String search,
                        org.springframework.data.domain.Pageable pageable);

        @org.springframework.data.jpa.repository.Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles r LEFT JOIN FETCH r.permissions WHERE LOWER(u.userName) = LOWER(:identity) OR LOWER(u.email) = LOWER(:identity)")
        Optional<User> findByIdentityWithRolesAndPermissions(@org.springframework.data.repository.query.Param("identity") String identity);

        @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.email IS NOT NULL AND LOWER(TRIM(u.email)) NOT IN (SELECT LOWER(TRIM(e.email)) FROM Employee e WHERE e.email IS NOT NULL)")
        java.util.List<User> findUsersNotLinkedToEmployee();
}

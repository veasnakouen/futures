package com.mtp.api.repositories;

import com.mtp.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
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
}

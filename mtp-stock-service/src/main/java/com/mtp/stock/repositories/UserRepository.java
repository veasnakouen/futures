package com.mtp.stock.repositories;

import com.mtp.stock.models.stubs.UserStub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserStub, String> {
    Optional<UserStub> findByUserName(String userName);
}

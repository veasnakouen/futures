package com.mtp.api.repositories;

import com.mtp.api.models.ExpectedSupportOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExpectedSupportOptionRepository extends JpaRepository<ExpectedSupportOption, Integer> {
    Optional<ExpectedSupportOption> findFirstByName(String name);
}

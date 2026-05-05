package com.mtp.api.repositories;

import com.mtp.api.models.SocialsupportCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SocialsupportCaseRepository extends JpaRepository<SocialsupportCase, Integer> {
    List<SocialsupportCase> findByClientId(Integer clientId);
}

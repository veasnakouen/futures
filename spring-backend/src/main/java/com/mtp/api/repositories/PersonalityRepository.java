package com.mtp.api.repositories;

import com.mtp.api.models.Personality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PersonalityRepository extends JpaRepository<Personality, Integer> {
    List<Personality> findByClientId(Integer clientId);
}

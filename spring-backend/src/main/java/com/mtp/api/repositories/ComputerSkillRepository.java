package com.mtp.api.repositories;

import com.mtp.api.models.ComputerSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComputerSkillRepository extends JpaRepository<ComputerSkill, Integer> {
    List<ComputerSkill> findByClientId(Integer clientId);
}

package com.mtp.api.repositories;

import com.mtp.api.models.SocialSupport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SocialSupportRepository extends JpaRepository<SocialSupport, Integer> {
    List<SocialSupport> findByClientId(Integer clientId);
}

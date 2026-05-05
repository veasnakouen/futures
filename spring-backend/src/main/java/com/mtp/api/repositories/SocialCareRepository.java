package com.mtp.api.repositories;

import com.mtp.api.models.SocialCare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SocialCareRepository extends JpaRepository<SocialCare, Integer> {
    List<SocialCare> findByClientId(Integer clientId);
}

package com.mtp.api.repositories;

import com.mtp.api.models.SocialSupportProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SocialSupportProblemRepository extends JpaRepository<SocialSupportProblem, Integer> {
    List<SocialSupportProblem> findBySocialsupportCaseId(Integer socialsupportCaseId);
}

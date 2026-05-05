package com.mtp.api.repositories;

import com.mtp.api.models.BusinessSetUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BusinessSetUpRepository extends JpaRepository<BusinessSetUp, Integer> {
    List<BusinessSetUp> findByClientId(Integer clientId);
}

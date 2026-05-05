package com.mtp.api.repositories;

import com.mtp.api.models.BusinessSetUpCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessSetUpCategoryRepository extends JpaRepository<BusinessSetUpCategory, Integer> {
}

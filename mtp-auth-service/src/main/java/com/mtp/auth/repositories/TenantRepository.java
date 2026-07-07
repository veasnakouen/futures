package com.mtp.auth.repositories;

import com.mtp.auth.models.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, String> {
    
    // Finds active tenants whose subscription has already passed (e.g. yesterday)
    List<Tenant> findByIsActiveTrueAndSubscriptionEndDateBefore(LocalDate date);
    
    // Finds active tenants whose subscription ends on an exact date (e.g. 7 days from now)
    List<Tenant> findByIsActiveTrueAndSubscriptionEndDate(LocalDate date);
}

package com.mtp.stock.repositories;

import com.mtp.stock.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByName(String name);
    Optional<Location> findByServiceId(String serviceId);
}

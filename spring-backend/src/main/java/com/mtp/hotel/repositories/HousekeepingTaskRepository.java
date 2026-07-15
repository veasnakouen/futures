package com.mtp.hotel.repositories;

import com.mtp.hotel.models.HousekeepingTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HousekeepingTaskRepository extends JpaRepository<HousekeepingTask, Integer> {
}

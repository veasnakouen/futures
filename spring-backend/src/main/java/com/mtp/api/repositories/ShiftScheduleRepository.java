package com.mtp.api.repositories;

import com.mtp.api.models.ShiftSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftScheduleRepository extends JpaRepository<ShiftSchedule, Integer> {
    List<ShiftSchedule> findByWeekStartDate(LocalDate weekStartDate);
}

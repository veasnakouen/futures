package com.mtp.api.controllers;

import com.mtp.api.models.Employee;
import com.mtp.api.models.ShiftSchedule;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.ShiftScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hr/scheduling")
public class SchedulingController {

    @Autowired
    private ShiftScheduleRepository shiftScheduleRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/current")
    public ResponseEntity<List<ShiftSchedule>> getCurrentWeekSchedule() {
        LocalDate startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        List<ShiftSchedule> schedules = shiftScheduleRepository.findByWeekStartDate(startOfWeek);
        
        return ResponseEntity.ok(schedules);
    }
}

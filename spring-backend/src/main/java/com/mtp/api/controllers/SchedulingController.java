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
        
        // Auto-generate some schedule if empty so UI is populated
        if (schedules.isEmpty()) {
            List<Employee> employees = employeeRepository.findAll().stream()
                .limit(5)
                .collect(Collectors.toList());
            
            String[] shifts = {"Morning", "Afternoon", "Night", "Off"};
            Random random = new Random();
            
            for (Employee emp : employees) {
                ShiftSchedule s = new ShiftSchedule();
                s.setEmployee(emp);
                s.setWeekStartDate(startOfWeek);
                s.setMondayShift(shifts[random.nextInt(4)]);
                s.setTuesdayShift(shifts[random.nextInt(4)]);
                s.setWednesdayShift(shifts[random.nextInt(4)]);
                s.setThursdayShift(shifts[random.nextInt(4)]);
                s.setFridayShift(shifts[random.nextInt(4)]);
                shiftScheduleRepository.save(s);
                schedules.add(s);
            }
        }
        
        return ResponseEntity.ok(schedules);
    }
}

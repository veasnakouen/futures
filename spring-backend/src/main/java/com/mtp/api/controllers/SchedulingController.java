package com.mtp.api.controllers;

import com.mtp.api.dto.BulkShiftScheduleDto;
import com.mtp.api.dto.ShiftScheduleDto;
import com.mtp.api.models.Employee;
import com.mtp.api.models.ShiftSchedule;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.ShiftScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/hr/scheduling")
public class SchedulingController {

    @Autowired
    private ShiftScheduleRepository shiftScheduleRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/current")
    public ResponseEntity<List<ShiftScheduleDto>> getCurrentWeekSchedule() {
        LocalDate startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        List<ShiftSchedule> schedules = shiftScheduleRepository.findByWeekStartDate(startOfWeek);
        
        List<ShiftScheduleDto> dtos = schedules.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody ShiftScheduleDto dto) {
        Optional<Employee> empOpt = employeeRepository.findByIdNo(dto.getEmployeeId());
        if (!empOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found with ID: " + dto.getEmployeeId());
        }
        
        ShiftSchedule schedule = new ShiftSchedule();
        schedule.setEmployee(empOpt.get());
        schedule.setWeekStartDate(dto.getWeekStartDate());
        schedule.setMondayShift(dto.getMondayShift());
        schedule.setTuesdayShift(dto.getTuesdayShift());
        schedule.setWednesdayShift(dto.getWednesdayShift());
        schedule.setThursdayShift(dto.getThursdayShift());
        schedule.setFridayShift(dto.getFridayShift());
        schedule.setSaturdayShift(dto.getSaturdayShift());
        schedule.setSundayShift(dto.getSundayShift());
        
        ShiftSchedule saved = shiftScheduleRepository.save(schedule);
        return ResponseEntity.ok(mapToDto(saved));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Integer id, @RequestBody ShiftScheduleDto dto) {
        Optional<ShiftSchedule> schedOpt = shiftScheduleRepository.findById(id);
        if (!schedOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schedule not found with ID: " + id);
        }
        
        ShiftSchedule schedule = schedOpt.get();
        schedule.setWeekStartDate(dto.getWeekStartDate());
        schedule.setMondayShift(dto.getMondayShift());
        schedule.setTuesdayShift(dto.getTuesdayShift());
        schedule.setWednesdayShift(dto.getWednesdayShift());
        schedule.setThursdayShift(dto.getThursdayShift());
        schedule.setFridayShift(dto.getFridayShift());
        schedule.setSaturdayShift(dto.getSaturdayShift());
        schedule.setSundayShift(dto.getSundayShift());
        
        ShiftSchedule saved = shiftScheduleRepository.save(schedule);
        return ResponseEntity.ok(mapToDto(saved));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Integer id) {
        if (!shiftScheduleRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Schedule not found with ID: " + id);
        }
        shiftScheduleRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private ShiftScheduleDto mapToDto(ShiftSchedule schedule) {
        ShiftScheduleDto dto = new ShiftScheduleDto();
        dto.setId(schedule.getId());
        if (schedule.getEmployee() != null) {
            dto.setEmployeeId(schedule.getEmployee().getIdNo());
            dto.setEmployeeName(schedule.getEmployee().getFirstNameEnglish() + " " + schedule.getEmployee().getLastNameEnglish());
        }
        dto.setWeekStartDate(schedule.getWeekStartDate());
        dto.setMondayShift(schedule.getMondayShift());
        dto.setTuesdayShift(schedule.getTuesdayShift());
        dto.setWednesdayShift(schedule.getWednesdayShift());
        dto.setThursdayShift(schedule.getThursdayShift());
        dto.setFridayShift(schedule.getFridayShift());
        dto.setSaturdayShift(schedule.getSaturdayShift());
        dto.setSundayShift(schedule.getSundayShift());
        return dto;
    }

    @PostMapping("/department")
    public ResponseEntity<?> createBulkSchedule(@RequestBody BulkShiftScheduleDto dto) {
        List<Employee> employees = employeeRepository.findByDepartmentId(dto.getDepartmentId());
        if (employees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No employees found for department ID: " + dto.getDepartmentId());
        }
        
        List<ShiftSchedule> createdSchedules = employees.stream().map(emp -> {
            ShiftSchedule schedule = new ShiftSchedule();
            schedule.setEmployee(emp);
            schedule.setWeekStartDate(dto.getWeekStartDate());
            schedule.setMondayShift(dto.getMondayShift());
            schedule.setTuesdayShift(dto.getTuesdayShift());
            schedule.setWednesdayShift(dto.getWednesdayShift());
            schedule.setThursdayShift(dto.getThursdayShift());
            schedule.setFridayShift(dto.getFridayShift());
            schedule.setSaturdayShift(dto.getSaturdayShift());
            schedule.setSundayShift(dto.getSundayShift());
            return schedule;
        }).collect(Collectors.toList());
        
        List<ShiftSchedule> savedSchedules = shiftScheduleRepository.saveAll(createdSchedules);
        List<ShiftScheduleDto> savedDtos = savedSchedules.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(savedDtos);
    }
}

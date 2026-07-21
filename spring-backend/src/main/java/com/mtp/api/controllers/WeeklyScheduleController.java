package com.mtp.api.controllers;

import com.mtp.api.dto.WeeklyScheduleDto;
import com.mtp.api.models.Employee;
import com.mtp.api.models.WeeklySchedule;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.WeeklyScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/hr/weekly-scheduling")
public class WeeklyScheduleController {

    @Autowired
    private WeeklyScheduleRepository weeklyScheduleRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<List<WeeklyScheduleDto>> getAllSchedules() {
        List<WeeklyScheduleDto> dtos = weeklyScheduleRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateSchedule(@RequestBody WeeklyScheduleDto dto) {
        if (dto.getEmployeeId() != null && !dto.getEmployeeId().isEmpty()) {
            Optional<Employee> empOpt = employeeRepository.findByIdNo(dto.getEmployeeId());
            if (empOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found with ID: " + dto.getEmployeeId());
            }
            Employee emp = empOpt.get();
            WeeklySchedule schedule = weeklyScheduleRepository.findByEmployeeId(emp.getId())
                    .orElse(new WeeklySchedule());
            
            schedule.setEmployee(emp);
            schedule.setWeekStartDate(dto.getWeekStartDate());
            schedule.setMondayShift(dto.getMondayShift());
            schedule.setTuesdayShift(dto.getTuesdayShift());
            schedule.setWednesdayShift(dto.getWednesdayShift());
            schedule.setThursdayShift(dto.getThursdayShift());
            schedule.setFridayShift(dto.getFridayShift());
            schedule.setSaturdayShift(dto.getSaturdayShift());
            schedule.setSundayShift(dto.getSundayShift());
            
            return ResponseEntity.ok(mapToDto(weeklyScheduleRepository.save(schedule)));
        } else if (dto.getDepartmentId() != null) {
            List<Employee> employees = employeeRepository.findByDepartmentId(dto.getDepartmentId());
            if (employees.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No employees found for department ID: " + dto.getDepartmentId());
            }
            
            List<WeeklySchedule> savedSchedules = employees.stream().map(emp -> {
                WeeklySchedule schedule = weeklyScheduleRepository.findByEmployeeId(emp.getId())
                        .orElse(new WeeklySchedule());
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
            
            weeklyScheduleRepository.saveAll(savedSchedules);
            return ResponseEntity.ok("Assigned weekly schedule to " + savedSchedules.size() + " employees.");
        }
        
        return ResponseEntity.badRequest().body("Must provide either employeeId or departmentId");
    }

    private WeeklyScheduleDto mapToDto(WeeklySchedule schedule) {
        WeeklyScheduleDto dto = new WeeklyScheduleDto();
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
}

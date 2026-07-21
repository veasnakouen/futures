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

    @GetMapping("/year/{year}")
    public ResponseEntity<List<ShiftScheduleDto>> getYearSchedule(@PathVariable Integer year) {
        List<ShiftSchedule> schedules = shiftScheduleRepository.findByScheduleYear(year);
        
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
        schedule.setScheduleYear(dto.getScheduleYear());
        schedule.setJanShift(dto.getJanShift());
        schedule.setFebShift(dto.getFebShift());
        schedule.setMarShift(dto.getMarShift());
        schedule.setAprShift(dto.getAprShift());
        schedule.setMayShift(dto.getMayShift());
        schedule.setJunShift(dto.getJunShift());
        schedule.setJulShift(dto.getJulShift());
        schedule.setAugShift(dto.getAugShift());
        schedule.setSepShift(dto.getSepShift());
        schedule.setOctShift(dto.getOctShift());
        schedule.setNovShift(dto.getNovShift());
        schedule.setDecShift(dto.getDecShift());
        
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
        schedule.setScheduleYear(dto.getScheduleYear());
        schedule.setJanShift(dto.getJanShift());
        schedule.setFebShift(dto.getFebShift());
        schedule.setMarShift(dto.getMarShift());
        schedule.setAprShift(dto.getAprShift());
        schedule.setMayShift(dto.getMayShift());
        schedule.setJunShift(dto.getJunShift());
        schedule.setJulShift(dto.getJulShift());
        schedule.setAugShift(dto.getAugShift());
        schedule.setSepShift(dto.getSepShift());
        schedule.setOctShift(dto.getOctShift());
        schedule.setNovShift(dto.getNovShift());
        schedule.setDecShift(dto.getDecShift());
        
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
        dto.setScheduleYear(schedule.getScheduleYear());
        dto.setJanShift(schedule.getJanShift());
        dto.setFebShift(schedule.getFebShift());
        dto.setMarShift(schedule.getMarShift());
        dto.setAprShift(schedule.getAprShift());
        dto.setMayShift(schedule.getMayShift());
        dto.setJunShift(schedule.getJunShift());
        dto.setJulShift(schedule.getJulShift());
        dto.setAugShift(schedule.getAugShift());
        dto.setSepShift(schedule.getSepShift());
        dto.setOctShift(schedule.getOctShift());
        dto.setNovShift(schedule.getNovShift());
        dto.setDecShift(schedule.getDecShift());
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
            schedule.setScheduleYear(dto.getScheduleYear());
            schedule.setJanShift(dto.getJanShift());
            schedule.setFebShift(dto.getFebShift());
            schedule.setMarShift(dto.getMarShift());
            schedule.setAprShift(dto.getAprShift());
            schedule.setMayShift(dto.getMayShift());
            schedule.setJunShift(dto.getJunShift());
            schedule.setJulShift(dto.getJulShift());
            schedule.setAugShift(dto.getAugShift());
            schedule.setSepShift(dto.getSepShift());
            schedule.setOctShift(dto.getOctShift());
            schedule.setNovShift(dto.getNovShift());
            schedule.setDecShift(dto.getDecShift());
            return schedule;
        }).collect(Collectors.toList());
        
        List<ShiftSchedule> savedSchedules = shiftScheduleRepository.saveAll(createdSchedules);
        List<ShiftScheduleDto> savedDtos = savedSchedules.stream().map(this::mapToDto).collect(Collectors.toList());
        return ResponseEntity.ok(savedDtos);
    }
}

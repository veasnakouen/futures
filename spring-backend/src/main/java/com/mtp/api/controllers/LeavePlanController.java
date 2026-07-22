package com.mtp.api.controllers;

import com.mtp.api.dto.AnnualLeavePlanDto;
import com.mtp.api.models.AnnualLeavePlan;
import com.mtp.api.models.Employee;
import com.mtp.api.repositories.AnnualLeavePlanRepository;
import com.mtp.api.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hr/leave-plans")
@Transactional
public class LeavePlanController {

    @Autowired
    private AnnualLeavePlanRepository leavePlanRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping("/{employeeIdNo}/{year}")
    public ResponseEntity<?> getPlan(@PathVariable String employeeIdNo, @PathVariable int year) {
        Optional<Employee> empOpt = employeeRepository.findByIdNo(employeeIdNo);
        if (!empOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
        }
        
        Optional<AnnualLeavePlan> planOpt = leavePlanRepository.findByEmployeeIdAndPlanYear(empOpt.get().getId(), year);
        if (planOpt.isPresent()) {
            return ResponseEntity.ok(mapToDto(planOpt.get()));
        } else {
            // Return empty plan template
            AnnualLeavePlanDto emptyPlan = new AnnualLeavePlanDto();
            emptyPlan.setEmployeeId(employeeIdNo);
            emptyPlan.setPlanYear(year);
            return ResponseEntity.ok(emptyPlan);
        }
    }

    @GetMapping("/year/{year}")
    public ResponseEntity<List<AnnualLeavePlanDto>> getAllPlansForYear(@PathVariable int year) {
        List<AnnualLeavePlan> plans = leavePlanRepository.findByPlanYear(year);
        List<AnnualLeavePlanDto> dtos = plans.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<?> savePlan(@RequestBody AnnualLeavePlanDto dto) {
        Optional<Employee> empOpt = employeeRepository.findByIdNo(dto.getEmployeeId());
        if (!empOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found");
        }
        Employee emp = empOpt.get();

        AnnualLeavePlan plan;
        Optional<AnnualLeavePlan> existing = leavePlanRepository.findByEmployeeIdAndPlanYear(emp.getId(), dto.getPlanYear());
        if (existing.isPresent()) {
            plan = existing.get();
        } else {
            plan = new AnnualLeavePlan();
            plan.setEmployee(emp);
            plan.setPlanYear(dto.getPlanYear());
        }

        if (dto.getDateRanges() != null && !dto.getDateRanges().isEmpty()) {
            double[] monthTotals = new double[12];
            plan.getDateRanges().clear();
            for (AnnualLeavePlanDto.LeaveDateRangeDto drDto : dto.getDateRanges()) {
                com.mtp.api.models.LeaveDateRange dr = new com.mtp.api.models.LeaveDateRange();
                dr.setAnnualLeavePlan(plan);
                dr.setStartDate(drDto.getStartDate());
                dr.setEndDate(drDto.getEndDate());
                dr.setCalculatedDays(drDto.getCalculatedDays());
                plan.getDateRanges().add(dr);
                
                // Calculate days per month for this range
                java.time.LocalDate current = drDto.getStartDate();
                while (!current.isAfter(drDto.getEndDate())) {
                    if (current.getDayOfWeek() != java.time.DayOfWeek.SATURDAY && current.getDayOfWeek() != java.time.DayOfWeek.SUNDAY) {
                        monthTotals[current.getMonthValue() - 1] += 1.0;
                    }
                    current = current.plusDays(1);
                }
            }
            plan.setJanDays(monthTotals[0]);
            plan.setFebDays(monthTotals[1]);
            plan.setMarDays(monthTotals[2]);
            plan.setAprDays(monthTotals[3]);
            plan.setMayDays(monthTotals[4]);
            plan.setJunDays(monthTotals[5]);
            plan.setJulDays(monthTotals[6]);
            plan.setAugDays(monthTotals[7]);
            plan.setSepDays(monthTotals[8]);
            plan.setOctDays(monthTotals[9]);
            plan.setNovDays(monthTotals[10]);
            plan.setDecDays(monthTotals[11]);
        } else {
            plan.setJanDays(dto.getJanDays());
            plan.setFebDays(dto.getFebDays());
            plan.setMarDays(dto.getMarDays());
            plan.setAprDays(dto.getAprDays());
            plan.setMayDays(dto.getMayDays());
            plan.setJunDays(dto.getJunDays());
            plan.setJulDays(dto.getJulDays());
            plan.setAugDays(dto.getAugDays());
            plan.setSepDays(dto.getSepDays());
            plan.setOctDays(dto.getOctDays());
            plan.setNovDays(dto.getNovDays());
            plan.setDecDays(dto.getDecDays());
            if (plan.getDateRanges() != null) plan.getDateRanges().clear();
        }


        AnnualLeavePlan saved = leavePlanRepository.save(plan);
        return ResponseEntity.ok(mapToDto(saved));
    }

    private AnnualLeavePlanDto mapToDto(AnnualLeavePlan plan) {
        AnnualLeavePlanDto dto = new AnnualLeavePlanDto();
        dto.setId(plan.getId());
        if (plan.getEmployee() != null) {
            dto.setEmployeeId(plan.getEmployee().getIdNo());
            dto.setEmployeeName(plan.getEmployee().getFirstNameEnglish() + " " + plan.getEmployee().getLastNameEnglish());
        }
        dto.setPlanYear(plan.getPlanYear());
        dto.setJanDays(plan.getJanDays());
        dto.setFebDays(plan.getFebDays());
        dto.setMarDays(plan.getMarDays());
        dto.setAprDays(plan.getAprDays());
        dto.setMayDays(plan.getMayDays());
        dto.setJunDays(plan.getJunDays());
        dto.setJulDays(plan.getJulDays());
        dto.setAugDays(plan.getAugDays());
        dto.setSepDays(plan.getSepDays());
        dto.setOctDays(plan.getOctDays());
        dto.setNovDays(plan.getNovDays());
        dto.setDecDays(plan.getDecDays());
        dto.setUpdatedAt(plan.getUpdatedAt());
        
        if (plan.getDateRanges() != null) {
            List<AnnualLeavePlanDto.LeaveDateRangeDto> rangesDto = plan.getDateRanges().stream().map(r -> {
                AnnualLeavePlanDto.LeaveDateRangeDto rDto = new AnnualLeavePlanDto.LeaveDateRangeDto();
                rDto.setId(r.getId());
                rDto.setStartDate(r.getStartDate());
                rDto.setEndDate(r.getEndDate());
                rDto.setCalculatedDays(r.getCalculatedDays());
                return rDto;
            }).collect(Collectors.toList());
            dto.setDateRanges(rangesDto);
        } else {
            dto.setDateRanges(new java.util.ArrayList<>());
        }
        
        return dto;
    }
}

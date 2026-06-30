package com.mtp.api.controllers;

import com.mtp.api.models.Employee;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hr/analytics")
public class AnalyticsController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping("/stats")
    public Map<String, Object> getGeneralStats() {
        List<Employee> employees = employeeRepository.findAll();
        Map<String, Object> stats = new HashMap<>();

        long totalHeadcount = employees.size();
        long activeEmployees = employees.stream().filter(e -> "Active".equalsIgnoreCase(e.getStatus())).count();
        long newHiresThisMonth = employees.stream()
                .filter(e -> e.getJoinDate() != null && e.getJoinDate().getMonth() == LocalDate.now().getMonth())
                .count();

        stats.put("totalHeadcount", totalHeadcount);
        stats.put("activeEmployees", activeEmployees);
        stats.put("newHiresThisMonth", newHiresThisMonth);
        stats.put("turnoverRate", 5.2); // Placeholder for complex calc

        return stats;
    }

    @GetMapping("/demographics")
    public Map<String, Object> getDemographics() {
        List<Employee> employees = employeeRepository.findAll();
        Map<String, Object> data = new HashMap<>();

        // Gender Distribution
        Map<String, Long> genderDist = employees.stream()
                .filter(e -> e.getGender() != null)
                .collect(Collectors.groupingBy(Employee::getGender, Collectors.counting()));

        // Age Groups
        Map<String, Integer> ageGroups = new HashMap<>();
        ageGroups.put("Gen Z (18-24)", 0);
        ageGroups.put("Millennials (25-40)", 0);
        ageGroups.put("Gen X (41-55)", 0);
        ageGroups.put("Boomers (56+)", 0);

        for (Employee e : employees) {
            if (e.getDateOfBirth() != null) {
                int age = Period.between(e.getDateOfBirth(), LocalDate.now()).getYears();
                if (age <= 24)
                    ageGroups.put("Gen Z (18-24)", ageGroups.get("Gen Z (18-24)") + 1);
                else if (age <= 40)
                    ageGroups.put("Millennials (25-40)", ageGroups.get("Millennials (25-40)") + 1);
                else if (age <= 55)
                    ageGroups.put("Gen X (41-55)", ageGroups.get("Gen X (41-55)") + 1);
                else
                    ageGroups.put("Boomers (56+)", ageGroups.get("Boomers (56+)") + 1);
            }
        }

        data.put("gender", genderDist);
        data.put("ageGroups", ageGroups);
        return data;
    }

    @GetMapping("/department-distribution")
    public List<Map<String, Object>> getDeptDistribution() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .filter(e -> e.getDepartment() != null)
                .collect(Collectors.groupingBy(e -> e.getDepartment().getName(), Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }
}

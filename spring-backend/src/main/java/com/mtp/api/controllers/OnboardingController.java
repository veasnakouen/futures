package com.mtp.api.controllers;

import com.mtp.api.models.Employee;
import com.mtp.api.models.OnboardingChecklist;
import com.mtp.api.models.OnboardingTask;
import com.mtp.api.repositories.EmployeeRepository;
import com.mtp.api.repositories.OnboardingChecklistRepository;
import com.mtp.api.repositories.OnboardingTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/hr/onboarding")
public class OnboardingController {

    @Autowired
    private OnboardingChecklistRepository checklistRepository;

    @Autowired
    private OnboardingTaskRepository taskRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/{employeeId}/assign")
    public ResponseEntity<?> assignChecklist(@PathVariable Integer employeeId, @RequestBody List<OnboardingTask> tasks) {
        Optional<Employee> empOpt = employeeRepository.findById(employeeId);
        if (empOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        OnboardingChecklist checklist = new OnboardingChecklist();
        checklist.setEmployee(empOpt.get());
        checklist.setStatus("IN_PROGRESS");
        checklist.setAssignedDate(LocalDateTime.now());
        
        OnboardingChecklist saved = checklistRepository.save(checklist);
        
        for (OnboardingTask task : tasks) {
            task.setChecklist(saved);
            task.setIsCompleted(false);
            taskRepository.save(task);
        }

        return ResponseEntity.ok(checklistRepository.findById(saved.getId()).get());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<?> getChecklist(@PathVariable Integer employeeId) {
        Optional<OnboardingChecklist> checklist = checklistRepository.findByEmployeeId(employeeId);
        return checklist.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/task/{taskId}/complete")
    public ResponseEntity<?> completeTask(@PathVariable Integer taskId) {
        Optional<OnboardingTask> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            OnboardingTask task = taskOpt.get();
            task.setIsCompleted(true);
            task.setCompletedAt(LocalDateTime.now());
            taskRepository.save(task);

            // Check if all tasks are complete
            OnboardingChecklist checklist = task.getChecklist();
            boolean allComplete = checklist.getTasks().stream().allMatch(OnboardingTask::getIsCompleted);
            if (allComplete) {
                checklist.setStatus("COMPLETED");
                checklist.setCompletedDate(LocalDateTime.now());
                checklistRepository.save(checklist);
            }
            return ResponseEntity.ok(task);
        }
        return ResponseEntity.notFound().build();
    }
}

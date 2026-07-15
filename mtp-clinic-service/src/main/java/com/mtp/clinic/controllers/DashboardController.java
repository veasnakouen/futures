package com.mtp.clinic.controllers;

import com.mtp.clinic.repositories.AppointmentRepository;
import com.mtp.clinic.repositories.LabOrderRepository;
import com.mtp.clinic.repositories.PatientRepository;
import com.mtp.clinic.repositories.ProviderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clinic/dashboard")
public class DashboardController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final LabOrderRepository labOrderRepository;
    private final ProviderRepository providerRepository;

    public DashboardController(PatientRepository patientRepository,
                               AppointmentRepository appointmentRepository,
                               LabOrderRepository labOrderRepository,
                               ProviderRepository providerRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.labOrderRepository = labOrderRepository;
        this.providerRepository = providerRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        // In a real production scenario, we'd use custom queries to filter by date (e.g. today's appointments).
        // For Phase 1, we return total counts to establish the flow.
        long totalPatients = patientRepository.count();
        long todayAppointments = appointmentRepository.count(); // Placeholder for actual today's count
        long pendingLabs = labOrderRepository.count(); // Placeholder for actual pending count
        long activeDoctors = providerRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", totalPatients == 0 ? 1245 : totalPatients);
        stats.put("patientsGrowth", "+12.5%");
        stats.put("todayAppointments", todayAppointments == 0 ? 42 : todayAppointments);
        stats.put("appointmentsGrowth", "+5.2%");
        stats.put("pendingLabs", pendingLabs == 0 ? 18 : pendingLabs);
        stats.put("labsGrowth", "-2.4%");
        stats.put("activeDoctors", activeDoctors == 0 ? 15 : activeDoctors);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/chart-data")
    public ResponseEntity<List<Map<String, Object>>> getDashboardChartData() {
        // Return dummy data for the Recharts graph. This would normally aggregate patient registrations or visits per day.
        List<Map<String, Object>> chartData = List.of(
                Map.of("name", "Mon", "patients", 45),
                Map.of("name", "Tue", "patients", 52),
                Map.of("name", "Wed", "patients", 38),
                Map.of("name", "Thu", "patients", 65),
                Map.of("name", "Fri", "patients", 48),
                Map.of("name", "Sat", "patients", 25),
                Map.of("name", "Sun", "patients", 20)
        );
        return ResponseEntity.ok(chartData);
    }
}

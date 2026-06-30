package com.mtp.school.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "mtp-clinic-service")
public interface ClinicServiceClient {
    
    // We will define a basic Map or Object for now until we create a DTO.
    // Assuming the clinic service has an endpoint to fetch medical records by patient ID
    @GetMapping("/api/clinic/patients/{patientId}/records")
    List<Object> getMedicalRecordsByPatientId(@PathVariable("patientId") String patientId);
}

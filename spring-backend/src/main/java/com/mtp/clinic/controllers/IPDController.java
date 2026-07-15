package com.mtp.clinic.controllers;

import com.mtp.clinic.enums.AdmissionStatus;
import com.mtp.clinic.enums.RoomStatus;
import com.mtp.clinic.models.Admission;
import com.mtp.clinic.models.Patient;
import com.mtp.clinic.models.Provider;
import com.mtp.clinic.models.Room;
import com.mtp.clinic.repositories.AdmissionRepository;
import com.mtp.clinic.repositories.PatientRepository;
import com.mtp.clinic.repositories.ProviderRepository;
import com.mtp.clinic.repositories.ClinicRoomRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clinic/ipd")
@RequiredArgsConstructor
public class IPDController {

    private final ClinicRoomRepository roomRepository;
    private final AdmissionRepository admissionRepository;
    private final PatientRepository patientRepository;
    private final ProviderRepository providerRepository;

    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @GetMapping("/admissions")
    public ResponseEntity<List<Admission>> getAllAdmissions() {
        return ResponseEntity.ok(admissionRepository.findAll());
    }

    @PostMapping("/admit")
    public ResponseEntity<?> admitPatient(@RequestBody AdmitPatientRequest request) {
        Room room = roomRepository.findById(request.getRoomId()).orElse(null);
        Patient patient = patientRepository.findById(request.getPatientId()).orElse(null);

        if (room == null || patient == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Room or Patient not found"));
        }

        if (room.getStatus() == RoomStatus.OCCUPIED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Room is already occupied"));
        }

        Provider doctor = null;
        if (request.getAttendingDoctorId() != null) {
            doctor = providerRepository.findById(request.getAttendingDoctorId()).orElse(null);
        }

        Admission admission = new Admission();
        admission.setPatient(patient);
        admission.setRoom(room);
        admission.setAttendingDoctor(doctor);
        admission.setAdmissionDate(LocalDateTime.now());
        admission.setStatus(AdmissionStatus.ADMITTED);
        admission.setReasonForAdmission(request.getReasonForAdmission());

        admissionRepository.save(admission);

        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        return ResponseEntity.ok(admission);
    }

    @PostMapping("/discharge/{admissionId}")
    public ResponseEntity<?> dischargePatient(@PathVariable String admissionId) {
        Admission admission = admissionRepository.findById(admissionId).orElse(null);
        if (admission == null) {
            return ResponseEntity.notFound().build();
        }

        admission.setStatus(AdmissionStatus.DISCHARGED);
        admission.setDischargeDate(LocalDateTime.now());
        admissionRepository.save(admission);

        Room room = admission.getRoom();
        if (room != null) {
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }

        return ResponseEntity.ok(admission);
    }

    @Data
    public static class AdmitPatientRequest {
        private String patientId;
        private String roomId;
        private String attendingDoctorId;
        private String reasonForAdmission;
    }
}

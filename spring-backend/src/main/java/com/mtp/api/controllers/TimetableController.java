package com.mtp.api.controllers;

import com.mtp.api.dto.TimetableDto;
import com.mtp.api.services.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/timetables")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    @GetMapping
    public ResponseEntity<List<TimetableDto>> getAllTimetables() {
        return ResponseEntity.ok(timetableService.getAllTimetables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimetableDto> getTimetableById(@PathVariable Integer id) {
        return ResponseEntity.ok(timetableService.getTimetableById(id));
    }

    @PostMapping
    public ResponseEntity<TimetableDto> createTimetable(@RequestBody TimetableDto dto) {
        return ResponseEntity.ok(timetableService.createTimetable(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimetableDto> updateTimetable(@PathVariable Integer id, @RequestBody TimetableDto dto) {
        return ResponseEntity.ok(timetableService.updateTimetable(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimetable(@PathVariable Integer id) {
        timetableService.deleteTimetable(id);
        return ResponseEntity.ok().build();
    }
}

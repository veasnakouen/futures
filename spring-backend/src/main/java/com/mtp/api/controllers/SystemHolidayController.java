package com.mtp.api.controllers;

import com.mtp.api.dto.SystemHolidayDto;
import com.mtp.api.services.SystemHolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/holidays")
public class SystemHolidayController {

    @Autowired
    private SystemHolidayService holidayService;

    @GetMapping
    public ResponseEntity<List<SystemHolidayDto>> getAllHolidays() {
        return ResponseEntity.ok(holidayService.getAllHolidays());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SystemHolidayDto> getHolidayById(@PathVariable Integer id) {
        return ResponseEntity.ok(holidayService.getHolidayById(id));
    }

    @PostMapping
    public ResponseEntity<SystemHolidayDto> createHoliday(@RequestBody SystemHolidayDto dto) {
        return ResponseEntity.ok(holidayService.createHoliday(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SystemHolidayDto> updateHoliday(@PathVariable Integer id, @RequestBody SystemHolidayDto dto) {
        return ResponseEntity.ok(holidayService.updateHoliday(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoliday(@PathVariable Integer id) {
        holidayService.deleteHoliday(id);
        return ResponseEntity.ok().build();
    }
}

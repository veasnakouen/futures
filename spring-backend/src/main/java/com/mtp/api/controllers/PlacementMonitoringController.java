package com.mtp.api.controllers;

import com.mtp.api.dto.PlacementMonitoringDto;
import com.mtp.api.services.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placement-monitoring")
public class PlacementMonitoringController {

    @Autowired
    private ProgressService progressService;

    @GetMapping
    public List<PlacementMonitoringDto> getByClient(@RequestParam Integer clientId) {
        return progressService.getPlacementMonitoringsByClient(clientId);
    }

    @PostMapping
    public PlacementMonitoringDto create(@RequestBody PlacementMonitoringDto dto) {
        return progressService.savePlacementMonitoring(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlacementMonitoringDto> update(@PathVariable Integer id,
            @RequestBody PlacementMonitoringDto dto) {
        dto.setId(id);
        return ResponseEntity.ok(progressService.savePlacementMonitoring(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        progressService.deletePlacementMonitoring(id);
        return ResponseEntity.ok().build();
    }
}

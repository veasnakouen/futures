package com.mtp.api.controllers;

import com.mtp.api.dto.MonitoringDto;
import com.mtp.api.services.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitorings")

public class MonitoringController {

    @Autowired
    private ProgressService progressService;

    @GetMapping
    public List<MonitoringDto> getAll() {
        return progressService.getAllMonitorings();
    }

    @GetMapping("/client/{clientId}")
    public List<MonitoringDto> getByClient(@PathVariable Integer clientId) {
        return progressService.getMonitoringsByClient(clientId);
    }

    @PostMapping
    public MonitoringDto create(@RequestBody MonitoringDto monitoring) {
        return progressService.saveMonitoring(monitoring);
    }
}


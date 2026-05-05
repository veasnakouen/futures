package com.mtp.api.controllers;

import com.mtp.api.dto.FuturesTrainingDto;
import com.mtp.api.services.EducationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/futures-trainings")

public class FuturesTrainingController {
    @Autowired
    private EducationService educationService;

    @GetMapping("/client/{clientId}")
    public List<FuturesTrainingDto> getByClient(@PathVariable Integer clientId) {
        return educationService.getTrainingsByClient(clientId);
    }

    @PostMapping
    public FuturesTrainingDto create(@RequestBody FuturesTrainingDto training) {
        return educationService.saveTraining(training);
    }
}


package com.mtp.api.controllers;

import com.mtp.api.models.SystemSetting;
import com.mtp.api.repositories.SystemSettingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@Slf4j
public class SystemSettingController {

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @GetMapping
    public List<SystemSetting> getAllSettings() {
        return systemSettingRepository.findAll();
    }

    @GetMapping("/{key}")
    public ResponseEntity<SystemSetting> getSetting(@PathVariable String key) {
        return systemSettingRepository.findById(key)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SystemSetting saveSetting(@RequestBody SystemSetting setting) {
        log.info("Saving system setting: {} = {}", setting.getKey(), setting.getValue());
        return systemSettingRepository.save(setting);
    }
}

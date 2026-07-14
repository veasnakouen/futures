package com.mtp.api.controllers;

import com.mtp.api.models.WebhookEndpoint;
import com.mtp.api.repositories.WebhookEndpointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr/integrations")
public class IntegrationController {

    @Autowired
    private WebhookEndpointRepository repository;

    private void ensureSeedData() {
        if (repository.count() == 0) {
            repository.save(new WebhookEndpoint(null, "https://api.payroll.com/sync", "Onboarding_Complete", "POST", true, LocalDateTime.now()));
        }
    }

    @GetMapping("/webhooks")
    public ResponseEntity<List<WebhookEndpoint>> getWebhooks() {
        ensureSeedData();
        return ResponseEntity.ok(repository.findAll());
    }

    @PostMapping("/webhooks")
    public ResponseEntity<WebhookEndpoint> addWebhook(@RequestBody WebhookEndpoint hook) {
        hook.setCreatedAt(LocalDateTime.now());
        hook.setIsActive(true);
        return ResponseEntity.ok(repository.save(hook));
    }

    @DeleteMapping("/webhooks/{id}")
    public ResponseEntity<?> deleteWebhook(@PathVariable Integer id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sso")
    public ResponseEntity<List<Map<String, String>>> getSsoProviders() {
        return ResponseEntity.ok(List.of());
    }
}

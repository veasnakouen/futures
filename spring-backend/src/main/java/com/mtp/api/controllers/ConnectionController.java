package com.mtp.api.controllers;

import com.mtp.api.models.Connection;
import com.mtp.api.repositories.ConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionRepository connectionRepository;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping
    public List<Connection> getMyConnections() {
        return connectionRepository.findByUserId(getCurrentUsername());
    }

    @PostMapping
    public ResponseEntity<?> addConnection(@RequestBody Connection request) {
        String username = getCurrentUsername();
        if (connectionRepository.existsByUserIdAndTargetIdAndTargetType(username, request.getTargetId(),
                request.getTargetType())) {
            return ResponseEntity.badRequest().body("Already connected");
        }

        request.setUserId(username);
        request.setConnectedAt(java.time.LocalDateTime.now());
        Connection saved = connectionRepository.save(request);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{targetType}/{targetId}")
    public ResponseEntity<?> removeConnection(@PathVariable String targetType, @PathVariable String targetId) {
        String username = getCurrentUsername();
        connectionRepository.findByUserIdAndTargetIdAndTargetType(username, targetId, targetType.toUpperCase())
                .ifPresent(conn -> connectionRepository.delete(conn));
        return ResponseEntity.ok().build();
    }
}

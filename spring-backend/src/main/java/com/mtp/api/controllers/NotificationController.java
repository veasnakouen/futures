package com.mtp.api.controllers;

import com.mtp.api.models.Notification;
import com.mtp.api.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getMyNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return notificationService.getNotificationsForUser(auth.getName());
    }
    
    @GetMapping("/unread")
    public List<Notification> getMyUnreadNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return notificationService.getUnreadNotificationsForUser(auth.getName());
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    // Endpoint for testing notification push manually
    @PostMapping("/test")
    public ResponseEntity<?> testPushNotification(@RequestBody Map<String, String> payload) {
        String recipient = payload.get("recipientUsername");
        String title = payload.get("title");
        String message = payload.get("message");
        String type = payload.get("type");
        
        Notification notification = notificationService.sendNotification(recipient, title, message, type);
        return ResponseEntity.ok(notification);
    }
}

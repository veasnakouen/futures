package com.mtp.api.services;

import com.mtp.api.models.Notification;
import com.mtp.api.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public Notification sendNotification(String recipientUsername, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setRecipientUsername(recipientUsername);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);

        Notification saved = notificationRepository.save(notification);

        // Push to specific user's queue: /user/{recipientUsername}/queue/notifications
        messagingTemplate.convertAndSendToUser(
                recipientUsername,
                "/queue/notifications",
                saved
        );

        return saved;
    }

    public List<Notification> getNotificationsForUser(String username) {
        return notificationRepository.findByRecipientUsernameOrderByCreatedAtDesc(username);
    }
    
    public List<Notification> getUnreadNotificationsForUser(String username) {
        return notificationRepository.findByRecipientUsernameAndIsReadFalseOrderByCreatedAtDesc(username);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}

package com.mtp.api.events;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class UserActivityListener {

    @Async
    @EventListener
    public void handleUserActivity(UserActivityEvent event) {
        // This runs asynchronously
        log.info("Event Driven Log: User {} performed action: {}", event.getUsername(), event.getAction());
        // Here you would typically save to the LogBook table or send to Kafka
    }
}

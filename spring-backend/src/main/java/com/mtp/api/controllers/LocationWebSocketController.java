package com.mtp.api.controllers;

import com.mtp.api.config.WebSocketEventListener;
import com.mtp.api.models.LocationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class LocationWebSocketController {

    @Autowired
    private WebSocketEventListener webSocketEventListener;

    @MessageMapping("/location.update")
    public void receiveLocationUpdate(@Payload LocationMessage locationMessage) {
        if (locationMessage != null && locationMessage.getUsername() != null) {
            webSocketEventListener.updateLocation(locationMessage.getUsername(), locationMessage);
        }
    }
}

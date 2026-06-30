package com.mtp.api.config;

import com.mtp.api.models.ChatMessage;
import com.mtp.api.models.LocationMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    // Track online users
    private static final Set<String> onlineUsers = ConcurrentHashMap.newKeySet();
    
    // Track online locations
    private static final Map<String, LocationMessage> onlineLocations = new ConcurrentHashMap<>();

    @Autowired
    public WebSocketEventListener(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        if (headerAccessor.getUser() != null) {
            String username = headerAccessor.getUser().getName();
            log.info("WebSocket connection established for user: {}", username);
            
            // Map the username to the session attributes for later retrieval on disconnect
            if (headerAccessor.getSessionAttributes() != null) {
                headerAccessor.getSessionAttributes().put("username", username);
            }
            
            addUser(username);
        } else {
            log.warn("WebSocket connection established but no user Principal found");
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null) {
            log.info("User Disconnected: " + username);
            onlineUsers.remove(username);
            onlineLocations.remove(username); // Clean up location on disconnect

            ChatMessage chatMessage = ChatMessage.builder()
                    .type(ChatMessage.MessageType.LEAVE)
                    .sender(username)
                    .build();

            messagingTemplate.convertAndSend("/topic/public", chatMessage);
            broadcastOnlineUsers();
            broadcastOnlineLocations();
        }
    }

    public void addUser(String username) {
        onlineUsers.add(username);
        broadcastOnlineUsers();
    }

    public void updateLocation(String username, LocationMessage location) {
        location.setUsername(username);
        onlineLocations.put(username, location);
        broadcastOnlineLocations();
    }

    private void broadcastOnlineUsers() {
        messagingTemplate.convertAndSend("/topic/onlineUsers", onlineUsers);
    }
    
    private void broadcastOnlineLocations() {
        messagingTemplate.convertAndSend("/topic/locations", onlineLocations);
    }

    public static Set<String> getOnlineUsers() {
        return onlineUsers;
    }
    
    public static Map<String, LocationMessage> getOnlineLocations() {
        return onlineLocations;
    }
}

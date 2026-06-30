package com.mtp.api.controllers;

import com.mtp.api.models.ChatMessage;
import com.mtp.api.models.LocationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

@Controller
public class ChatController {

    @Autowired
    private com.mtp.api.config.WebSocketEventListener eventListener;

    @Autowired
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Autowired
    private com.mtp.api.repository.ChatMessageRepository chatMessageRepository;

    @Autowired
    private com.mtp.api.services.ImageUploadService uploadService;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        // Save to database only if it's a CHAT or AUDIO type message
        if (chatMessage.getType() == ChatMessage.MessageType.CHAT ||
                chatMessage.getType() == ChatMessage.MessageType.AUDIO) {
            chatMessageRepository.save(chatMessage);
        }
        return chatMessage;
    }

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @MessageMapping("/chat.privateMessage")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        // Save to database ONLY if it's a regular CHAT or AUDIO message
        if (chatMessage.getType() == ChatMessage.MessageType.CHAT ||
                chatMessage.getType() == ChatMessage.MessageType.AUDIO) {
            chatMessageRepository.save(chatMessage);
        }

        // Route the message (including VOICE_CALL signals) to the recipient
        try {
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getRecipient(),
                    "/queue/messages",
                    chatMessage);
        } catch (Exception e) {
            logger.error("Failed to route private/signal message to {}: {}", chatMessage.getRecipient(),
                    e.getMessage());
        }
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        // Add username in web socket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        eventListener.addUser(chatMessage.getSender());
        return chatMessage;     
    }

    @MessageMapping("/location.update")
    public void updateLocation(@Payload LocationMessage location, SimpMessageHeaderAccessor headerAccessor) {
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null) {
            eventListener.updateLocation(username, location);
        } else if (location.getUsername() != null) {
            eventListener.updateLocation(location.getUsername(), location);
        }
    }

    @PostMapping("/api/chat/upload-voice")
    @ResponseBody
    public Map<String, String> uploadVoice(@RequestParam("file") MultipartFile file) throws IOException {
        String url = uploadService.uploadAudio(file, "chat_voice_notes");
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return response;
    }
}

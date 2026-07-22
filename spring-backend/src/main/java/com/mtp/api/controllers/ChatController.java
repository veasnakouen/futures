package com.mtp.api.controllers;

import com.mtp.api.dto.ChatRequest;
import com.mtp.api.dto.ChatResponse;
import com.mtp.api.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody(required = false) ChatRequest request) {
        if (request == null || request.getMessage() == null) {
            request = new ChatRequest("");
        }
        try {
            ChatResponse response = chatService.processMessage(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ChatResponse("Hello! I am your AI System Guide. How can I assist you with the MTP ecosystem today?"));
        }
    }
}

package com.mtp.api.controllers;

import com.mtp.api.models.ChatMessage;
import com.mtp.api.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatHistoryController {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @GetMapping("/history/public")
    public ResponseEntity<List<ChatMessage>> getPublicHistory() {
        return ResponseEntity.ok(chatMessageRepository.findByRecipientIsNullOrderBySentAtAsc());
    }

    @GetMapping("/history/private")
    public ResponseEntity<List<ChatMessage>> getPrivateHistory(
            @RequestParam String user1, 
            @RequestParam String user2) {
        return ResponseEntity.ok(chatMessageRepository.findPrivateMessages(user1, user2));
    }

    @GetMapping("/history/user/{username}")
    public ResponseEntity<List<ChatMessage>> getUserHistory(@PathVariable String username) {
        return ResponseEntity.ok(chatMessageRepository.findMessagesForUser(username));
    }
}

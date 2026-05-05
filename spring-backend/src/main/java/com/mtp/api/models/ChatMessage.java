package com.mtp.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content", columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(name = "sender")
    private String sender;

    @Column(name = "recipient")
    private String recipient;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private MessageType type;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        VOICE_CALL,
        CALL_OFFER,
        CALL_ANSWER,
        ICE_CANDIDATE,
        CALL_REJECT,
        AUDIO
    }

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
    }
}

package com.mtp.api.repository;

import com.mtp.api.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Fetch public messages (no recipient)
    List<ChatMessage> findByRecipientIsNullOrderBySentAtAsc();
    
    // Fetch private messages between two specific users
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender = :user1 AND m.recipient = :user2) OR " +
           "(m.sender = :user2 AND m.recipient = :user1) " +
           "ORDER BY m.sentAt ASC")
    List<ChatMessage> findPrivateMessages(@Param("user1") String user1, @Param("user2") String user2);

    // Fetch recent messages for a user (both public and their private ones)
    @Query("SELECT m FROM ChatMessage m WHERE m.recipient IS NULL OR m.recipient = :username OR m.sender = :username ORDER BY m.sentAt ASC")
    List<ChatMessage> findMessagesForUser(@Param("username") String username);
}

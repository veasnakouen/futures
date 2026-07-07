package com.mtp.api.controllers;

import com.mtp.api.models.SupportTicket;
import com.mtp.api.models.User;
import com.mtp.api.repositories.SupportTicketRepository;
import com.mtp.api.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class SupportTicketController {

    @Autowired
    private SupportTicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<SupportTicket> getAll() {
        return ticketRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportTicket> getById(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SupportTicket create(@RequestBody SupportTicket ticket) {
        ticket.setStatus("Open");
        ticket.setCreatedAt(LocalDateTime.now());
        
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            userRepository.findByUserName(auth.getName()).ifPresent(user -> {
                ticket.setReporter(user);
                ticket.getAssignees().add(user);
                ticket.setAssignedBy(user);
                ticket.setAssignedDate(LocalDateTime.now());
            });
        }
        
        return ticketRepository.save(ticket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupportTicket> update(@PathVariable Long id, @RequestBody SupportTicket updatedTicket) {
        return ticketRepository.findById(id).map(ticket -> {
            ticket.setTitle(updatedTicket.getTitle());
            ticket.setDescription(updatedTicket.getDescription());
            ticket.setPriority(updatedTicket.getPriority());
            ticket.setCategory(updatedTicket.getCategory());
            ticket.setStatus(updatedTicket.getStatus());
            return ResponseEntity.ok(ticketRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SupportTicket> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        return ticketRepository.findById(id).map(ticket -> {
            String status = payload.get("status");
            ticket.setStatus(status);
            if ("Resolved".equalsIgnoreCase(status) || "Closed".equalsIgnoreCase(status)) {
                ticket.setResolvedAt(LocalDateTime.now());
            }
            return ResponseEntity.ok(ticketRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<SupportTicket> assignTicket(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        return ticketRepository.findById(id).map(ticket -> {
            String assigneeId = payload.get("assigneeId");
            String assignNote = payload.get("assignNote");
            String assignedById = payload.get("assignedById");

            if (assigneeId != null && !assigneeId.isEmpty()) {
                userRepository.findById(assigneeId).ifPresent(user -> ticket.getAssignees().add(user));
            }
            if (assignedById != null && !assignedById.isEmpty()) {
                userRepository.findById(assignedById).ifPresent(ticket::setAssignedBy);
            }
            ticket.setAssignNote(assignNote);
            ticket.setAssignedDate(LocalDateTime.now());
            
            return ResponseEntity.ok(ticketRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/unassign")
    public ResponseEntity<SupportTicket> unassignTicket(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        return ticketRepository.findById(id).map(ticket -> {
            String assigneeId = payload.get("assigneeId");
            if (assigneeId != null && !assigneeId.isEmpty()) {
                ticket.getAssignees().removeIf(u -> u.getId().equals(assigneeId));
            } else {
                ticket.getAssignees().clear();
            }
            
            if (ticket.getAssignees().isEmpty()) {
                ticket.setAssignedBy(null);
                ticket.setAssignNote(null);
                ticket.setAssignedDate(null);
            }
            return ResponseEntity.ok(ticketRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return ticketRepository.findById(id).map(ticket -> {
            ticketRepository.delete(ticket);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}

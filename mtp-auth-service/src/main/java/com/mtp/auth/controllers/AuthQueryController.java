package com.mtp.auth.controllers;

import com.mtp.auth.queries.GetUsersQuery;
import com.mtp.auth.queries.handlers.GetUsersQueryHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthQueryController {

    private final GetUsersQueryHandler getUsersQueryHandler;

    public AuthQueryController(GetUsersQueryHandler getUsersQueryHandler) {
        this.getUsersQueryHandler = getUsersQueryHandler;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(getUsersQueryHandler.handle(new GetUsersQuery()));
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is reachable!");
    }

    // Removing the /debug endpoint entirely as it was leaking headers.
}

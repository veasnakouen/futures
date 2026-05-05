package com.mtp.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/status")
    public String status() {
        return "Spring Boot API is running and ready for migration!";
    }
}

package com.mtp.stock.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    @GetMapping("/ping")
    public String ping() {
        return "Stock Service is up and running securely behind the API Gateway!";
    }
}

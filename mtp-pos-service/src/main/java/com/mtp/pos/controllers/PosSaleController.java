package com.mtp.pos.controllers;

import com.mtp.pos.dtos.PosSaleDto;
import com.mtp.pos.services.PosSaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pos/sales")
public class PosSaleController {

    private final PosSaleService service;

    public PosSaleController(PosSaleService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PosSaleDto>> getAllSales() {
        return ResponseEntity.ok(service.getAllSales());
    }

    @PostMapping
    public ResponseEntity<PosSaleDto> createSale(@RequestBody PosSaleDto dto) {
        return ResponseEntity.ok(service.createSale(dto));
    }
}

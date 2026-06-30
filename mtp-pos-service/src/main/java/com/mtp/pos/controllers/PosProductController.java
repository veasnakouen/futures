package com.mtp.pos.controllers;

import com.mtp.pos.dtos.PosProductDto;
import com.mtp.pos.services.PosProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pos/products")
public class PosProductController {

    private final PosProductService service;

    public PosProductController(PosProductService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PosProductDto>> getAllProducts() {
        return ResponseEntity.ok(service.getAllProducts());
    }

    @PostMapping
    public ResponseEntity<PosProductDto> createProduct(@RequestBody PosProductDto dto) {
        return ResponseEntity.ok(service.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PosProductDto> updateProduct(@PathVariable String id, @RequestBody PosProductDto dto) {
        return ResponseEntity.ok(service.updateProduct(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        service.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}

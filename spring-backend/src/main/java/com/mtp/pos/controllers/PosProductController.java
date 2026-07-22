// Force DevTools restart
package com.mtp.pos.controllers;

import com.mtp.pos.dtos.PosProductDto;
import com.mtp.pos.services.PosProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // tell that this is rest controller and handle web request
@RequestMapping("/api/pos/products")
public class PosProductController {

    // dependency injection: inject service in constructor (IoC container)
    private final PosProductService service;

    public PosProductController(PosProductService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PosProductDto>> getAllProducts() {
        return ResponseEntity.ok(service.getAllProducts());
    }

    @GetMapping("/test-error")
    public ResponseEntity<String> testError() {
        try {
            service.getAllProducts();
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            java.io.StringWriter sw = new java.io.StringWriter();
            e.printStackTrace(new java.io.PrintWriter(sw));
            return ResponseEntity.status(500).body(sw.toString());
        }
    }

    @GetMapping("/generate-sku")
    public ResponseEntity<java.util.Map<String, String>> generateSku() {
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("sku", service.generateSku());
        return ResponseEntity.ok(response);
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

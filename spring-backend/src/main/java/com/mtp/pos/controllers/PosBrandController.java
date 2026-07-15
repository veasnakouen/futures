package com.mtp.pos.controllers;

import com.mtp.pos.dtos.PosBrandDto;
import com.mtp.pos.services.PosBrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pos/brands")
@RequiredArgsConstructor
public class PosBrandController {

    private final PosBrandService service;

    @GetMapping
    public ResponseEntity<List<PosBrandDto>> getAllBrands() {
        return ResponseEntity.ok(service.getAllBrands());
    }

    @PostMapping
    public ResponseEntity<PosBrandDto> createBrand(@RequestBody PosBrandDto dto) {
        return new ResponseEntity<>(service.createBrand(dto), HttpStatus.CREATED);
    }
}

package com.mtp.pos.controllers;

import com.mtp.pos.dtos.PosCategoryDto;
import com.mtp.pos.services.PosCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pos/categories")
@RequiredArgsConstructor
public class PosCategoryController {

    private final PosCategoryService service;

    @GetMapping
    public ResponseEntity<List<PosCategoryDto>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<PosCategoryDto> createCategory(@RequestBody PosCategoryDto dto) {
        return new ResponseEntity<>(service.createCategory(dto), HttpStatus.CREATED);
    }
}

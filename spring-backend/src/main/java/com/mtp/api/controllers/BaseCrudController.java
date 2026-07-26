package com.mtp.api.controllers;

import com.mtp.api.dto.ApiResponse;
import com.mtp.api.services.BaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class BaseCrudController<T, ID, S extends BaseService<T, ID>> {

    protected final S service;

    public BaseCrudController(S service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<T>>> getAll() {
        List<T> result = service.findAll();
        return ResponseEntity.ok(ApiResponse.success("Fetched successfully", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> getById(@PathVariable ID id) {
        return service.findById(id)
                .map(entity -> ResponseEntity.ok(ApiResponse.success("Fetched successfully", entity)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<T>> create(@RequestBody T entity) {
        T created = service.save(entity);
        return ResponseEntity.ok(ApiResponse.success("Created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> update(@PathVariable ID id, @RequestBody T entity) {
        T updated = service.update(id, entity);
        return ResponseEntity.ok(ApiResponse.success("Updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable ID id) {
        service.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted successfully", null));
    }
}

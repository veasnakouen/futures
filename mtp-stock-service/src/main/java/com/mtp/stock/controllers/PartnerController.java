package com.mtp.stock.controllers;

import com.mtp.stock.models.AssetSupplier;
import com.mtp.stock.models.InventoryCustomer;
import com.mtp.stock.models.InventoryRetailer;
import com.mtp.stock.services.PartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    // --- Suppliers ---
    @GetMapping("/suppliers")
    public ResponseEntity<List<AssetSupplier>> getAllSuppliers() {
        return ResponseEntity.ok(partnerService.getAllSuppliers());
    }

    @PostMapping("/suppliers")
    public ResponseEntity<AssetSupplier> createSupplier(@RequestBody AssetSupplier supplier) {
        return ResponseEntity.ok(partnerService.createSupplier(supplier));
    }

    @PutMapping("/suppliers/{id}")
    public ResponseEntity<AssetSupplier> updateSupplier(@PathVariable Integer id, @RequestBody AssetSupplier supplier) {
        return ResponseEntity.ok(partnerService.updateSupplier(id, supplier));
    }

    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Integer id) {
        partnerService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    // --- Retailers ---
    @GetMapping("/retailers")
    public ResponseEntity<List<InventoryRetailer>> getAllRetailers() {
        return ResponseEntity.ok(partnerService.getAllRetailers());
    }

    @PostMapping("/retailers")
    public ResponseEntity<InventoryRetailer> createRetailer(@RequestBody InventoryRetailer retailer) {
        return ResponseEntity.ok(partnerService.createRetailer(retailer));
    }

    @PutMapping("/retailers/{id}")
    public ResponseEntity<InventoryRetailer> updateRetailer(@PathVariable Integer id,
            @RequestBody InventoryRetailer retailer) {
        return ResponseEntity.ok(partnerService.updateRetailer(id, retailer));
    }

    @DeleteMapping("/retailers/{id}")
    public ResponseEntity<Void> deleteRetailer(@PathVariable Integer id) {
        partnerService.deleteRetailer(id);
        return ResponseEntity.noContent().build();
    }

    // --- Customers ---
    @GetMapping("/customers")
    public ResponseEntity<List<InventoryCustomer>> getAllCustomers() {
        return ResponseEntity.ok(partnerService.getAllCustomers());
    }

    @PostMapping("/customers")
    public ResponseEntity<InventoryCustomer> createCustomer(@RequestBody InventoryCustomer customer) {
        return ResponseEntity.ok(partnerService.createCustomer(customer));
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<InventoryCustomer> updateCustomer(@PathVariable Integer id,
            @RequestBody InventoryCustomer customer) {
        return ResponseEntity.ok(partnerService.updateCustomer(id, customer));
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        partnerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}

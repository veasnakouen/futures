package com.mtp.stock.controllers;

import com.mtp.stock.models.ItemLocationStock;
import com.mtp.stock.models.Location;
import com.mtp.stock.repositories.ItemLocationStockRepository;
import com.mtp.stock.repositories.LocationRepository;
import com.mtp.stock.services.StockTransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock/locations")
public class LocationController {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ItemLocationStockRepository itemLocationStockRepository;

    @Autowired
    private StockTransferService stockTransferService;

    @Autowired
    private org.springframework.cloud.client.discovery.DiscoveryClient discoveryClient;

    // --- Locations ---

    @GetMapping
    public List<Location> getAllLocations() {
        // Auto-discover services from Eureka
        List<String> services = discoveryClient.getServices();
        
        for (String service : services) {
            // Ignore infrastructure and self
            if (service.equalsIgnoreCase("mtp-discovery-server") ||
                service.equalsIgnoreCase("mtp-api-gateway") ||
                service.equalsIgnoreCase("mtp-stock-service")) {
                continue;
            }

            // Check if this service is already registered as a location
            Location loc = locationRepository.findByServiceId(service).orElseGet(() -> {
                Location newLoc = new Location();
                newLoc.setName(service.toUpperCase().replace("-SERVICE", "").replace("MTP-", "") + " Node");
                newLoc.setServiceId(service);
                newLoc.setType("SERVICE_NODE");
                newLoc.setIsActive(true);
                return locationRepository.save(newLoc);
            });
            
            // Check real-time status
            boolean hasInstances = !discoveryClient.getInstances(service).isEmpty();
            loc.setStatus(hasInstances ? "ONLINE" : "OFFLINE");
        }

        // Return all locations with updated transient status where applicable
        List<Location> allLocs = locationRepository.findAll();
        for (Location loc : allLocs) {
            if (loc.getServiceId() != null) {
                boolean hasInstances = !discoveryClient.getInstances(loc.getServiceId()).isEmpty();
                loc.setStatus(hasInstances ? "ONLINE" : "OFFLINE");
            } else {
                loc.setStatus("STATIC");
            }
        }
        return allLocs;
    }

    @PostMapping
    public Location createLocation(@RequestBody Location location) {
        return locationRepository.save(location);
    }

    // --- Item Location Stock ---

    @GetMapping("/items/{itemId}")
    public List<ItemLocationStock> getStockForSpecificItemAcrossLocations(@PathVariable Long itemId) {
        return itemLocationStockRepository.findByInventoryItemId(itemId);
    }

    @GetMapping("/{locationId}/items")
    public List<ItemLocationStock> getStockInsideLocation(@PathVariable Long locationId) {
        return itemLocationStockRepository.findByLocationId(locationId);
    }

    // --- Stock Movement APIs ---

    @PostMapping("/add")
    public ResponseEntity<?> addStockToLocation(@RequestBody Map<String, Object> payload) {
        Long itemId = Long.valueOf(payload.get("itemId").toString());
        Long locationId = Long.valueOf(payload.get("locationId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());

        stockTransferService.addStockToLocation(itemId, locationId, quantity);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Stock added to location"));
    }

    @PostMapping("/allocate")
    public ResponseEntity<?> allocateStockToLocation(@RequestBody Map<String, Object> payload) {
        Long itemId = Long.valueOf(payload.get("itemId").toString());
        Long locationId = Long.valueOf(payload.get("locationId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());

        stockTransferService.allocateStockToLocation(itemId, locationId, quantity);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Stock allocated successfully"));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transferStock(@RequestBody Map<String, Object> payload) {
        Long itemId = Long.valueOf(payload.get("itemId").toString());
        Long sourceLocationId = Long.valueOf(payload.get("sourceLocationId").toString());
        Long targetLocationId = Long.valueOf(payload.get("targetLocationId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());

        stockTransferService.transferStock(itemId, sourceLocationId, targetLocationId, quantity);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Stock transferred successfully"));
    }

    @PostMapping("/consume")
    public ResponseEntity<?> consumeStock(@RequestBody Map<String, Object> payload) {
        Long itemId = Long.valueOf(payload.get("itemId").toString());
        Long locationId = Long.valueOf(payload.get("locationId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());

        stockTransferService.consumeStockFromLocation(itemId, locationId, quantity);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Stock consumed successfully"));
    }

    @PostMapping("/adjust")
    public ResponseEntity<?> adjustStock(@RequestBody Map<String, Object> payload) {
        Long itemId = Long.valueOf(payload.get("itemId").toString());
        Long locationId = Long.valueOf(payload.get("locationId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());

        stockTransferService.adjustLocationStock(itemId, locationId, quantity);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Stock adjusted successfully"));
    }

    @DeleteMapping("/{locationId}/items/{itemId}")
    public ResponseEntity<?> removeStock(@PathVariable Long locationId, @PathVariable Long itemId) {
        stockTransferService.removeStockFromLocation(itemId, locationId);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Stock removed from location"));
    }
}

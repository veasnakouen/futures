package com.mtp.api.controllers;

import com.mtp.api.models.Placement;
import com.mtp.api.models.Client;
import com.mtp.api.repositories.PlacementRepository;
import com.mtp.api.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/placements")
@CrossOrigin(origins = "*")
public class PlacementController {

    @Autowired
    private PlacementRepository repository;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping
    public Page<Placement> getAllPlacements(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("placementDate").descending());
        if (search != null && !search.isEmpty()) {
            return repository.findByCompanyNameContainingOrPlacementTypeContaining(search, search, pageable);
        }
        return repository.findAll(pageable);
    }

    @GetMapping("/stats")
    public Map<String, Object> getPlacementStats() {
        List<Placement> all = repository.findAll();
        Map<String, Object> stats = new HashMap<>();

        // Status Distribution
        Map<String, Long> statusDist = all.stream()
                .filter(p -> p.getStatus() != null)
                .collect(Collectors.groupingBy(Placement::getStatus, Collectors.counting()));

        // Type Distribution
        Map<String, Long> typeDist = all.stream()
                .filter(p -> p.getPlacementType() != null)
                .collect(Collectors.groupingBy(Placement::getPlacementType, Collectors.counting()));

        // Monthly Trend
        Map<String, Long> trendMap = all.stream()
                .filter(p -> p.getPlacementDate() != null)
                .collect(Collectors.groupingBy(p -> {
                    String name = p.getPlacementDate().getMonth().name();
                    return name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase();
                }, Collectors.counting()));

        // Sort months
        List<String> monthOrder = Arrays.asList("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
                "Nov", "Dec");
        List<Map<String, Object>> sortedTrend = trendMap.entrySet().stream()
                .sorted(Comparator.comparingInt(e -> monthOrder.indexOf(e.getKey())))
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("month", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        stats.put("totalPlacements", all.size());
        stats.put("statusDistribution", statusDist.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("value", e.getValue());
                    return m;
                })
                .collect(Collectors.toList()));
        stats.put("typeDistribution", typeDist.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("value", e.getValue());
                    return m;
                })
                .collect(Collectors.toList()));
        stats.put("placementTrend", sortedTrend);

        return stats;
    }

    @PostMapping
    public Placement createPlacement(@Valid @RequestBody Placement placement) {
        Placement saved = repository.save(placement);

        // Update client placement flag
        if (placement.getClientId() != null) {
            clientRepository.findById(placement.getClientId()).ifPresent(client -> {
                client.setPlacement(true);
                clientRepository.save(client);
            });
        }

        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Placement> updatePlacement(@PathVariable Integer id, @Valid @RequestBody Placement details) {
        return repository.findById(id).map(p -> {
            p.setCompanyName(details.getCompanyName());
            p.setSalary(details.getSalary());
            p.setStatus(details.getStatus());
            p.setPlacementDate(details.getPlacementDate());
            p.setPlacementType(details.getPlacementType());
            p.setImageUrl(details.getImageUrl());
            if (details.getCountedTime() != null) {
                p.setCountedTime(details.getCountedTime());
            }
            return ResponseEntity.ok(repository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlacement(@PathVariable Integer id) {
        return repository.findById(id).map(p -> {
            repository.delete(p);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}

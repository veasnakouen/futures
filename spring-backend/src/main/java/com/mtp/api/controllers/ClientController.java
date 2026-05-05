package com.mtp.api.controllers;

import com.mtp.api.dto.ClientDto;
import com.mtp.api.services.ClientService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@Slf4j
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping
    @Cacheable(value = "clients", key = "{#name, #branch, #status, #pageable}")
    public Page<ClientDto> getAllClients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return clientService.getAllClients(name, branch, status, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDto> getClientById(@PathVariable Integer id) {
        return clientService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ClientDto> getClientByCode(@PathVariable String code) {
        return clientService.getClientByCode(code)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    @PreAuthorize("isAuthenticated()")
    @CacheEvict(value = {"clients", "dashboardStats"}, allEntries = true)
    public ClientDto createClient(@Valid @RequestBody ClientDto clientDto) {
        log.info("Registering new client: {} {}", clientDto.getFirstName(), clientDto.getLastName());
        ClientDto saved = clientService.saveClient(clientDto);
        log.info("Client registered with ID: {} code: {}", saved.getId(), saved.getClientCode());
        return saved;
    }

    @PutMapping("/{id}")
    @Transactional
    @PreAuthorize("isAuthenticated()")
    @CacheEvict(value = {"clients", "dashboardStats"}, allEntries = true)
    public ResponseEntity<ClientDto> updateClient(@PathVariable Integer id, @Valid @RequestBody ClientDto clientDto) {
        log.info("Updating client ID: {}", id);
        clientDto.setId(id);
        return ResponseEntity.ok(clientService.saveClient(clientDto));
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    @CacheEvict(value = {"clients", "dashboardStats"}, allEntries = true)
    public ResponseEntity<Void> deleteClient(@PathVariable Integer id) {
        log.warn("Deleting client ID: {}", id);
        clientService.deleteClient(id);
        return ResponseEntity.ok().build();
    }
}

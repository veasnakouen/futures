package com.mtp.api.controllers;

import com.mtp.api.dto.ClientDto;
import com.mtp.api.dto.ClientProfileDto;
import com.mtp.api.dto.ClientSummaryDto;
import com.mtp.api.repositories.*;
import com.mtp.api.services.ClientCommandService;
import com.mtp.api.services.ClientQueryService;
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
@CrossOrigin(origins = "*")
@Slf4j
public class ClientController {

    @Autowired
    private ClientCommandService clientCommandService;

    @Autowired
    private ClientQueryService clientQueryService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private PlacementRepository placementRepository;

    @Autowired
    private SocialSupportRepository socialSupportRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private LanguageRepository languageRepository;

    @Autowired
    private ComputerSkillRepository computerSkillRepository;

    @Autowired
    private JobExperienceRepository jobExperienceRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private JobExpectationRepository jobExpectationRepository;

    @Autowired
    private MonitoringRepository monitoringRepository;

    @Autowired
    private PersonalityRepository personalityRepository;

    @GetMapping
    @Cacheable("clients")
    public Page<ClientSummaryDto> getAllClients(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return clientQueryService.getAllClients(name, branch, status, pageable);
    }

    @GetMapping("/{id}")
    @Cacheable(value = "clients", key = "#id")
    public ResponseEntity<ClientDto> getClientById(@PathVariable Integer id) {
        return clientQueryService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/portfolio")
    public ResponseEntity<?> getClientPortfolio(@PathVariable Integer id) {
        return clientRepository.findById(id).map(client -> {
            ClientProfileDto dto = new ClientProfileDto();
            dto.setClient(client);
            dto.setCases(caseRepository.findByClientId(id));
            dto.setPlacements(placementRepository.findByClientId(id));
            dto.setSocialSupports(socialSupportRepository.findByClientId(id));
            dto.setEducations(educationRepository.findByClientId(id));
            dto.setLanguages(languageRepository.findByClientId(id));
            dto.setComputerSkills(computerSkillRepository.findByClientId(id));
            dto.setJobExperiences(jobExperienceRepository.findByClientId(id));
            dto.setBeneficiaries(beneficiaryRepository.findByClientId(id));
            dto.setJobExpectations(jobExpectationRepository.findByClientId(id));
            dto.setMonitorings(monitoringRepository.findByClientId(id));
            dto.setPersonalities(personalityRepository.findByClientId(id));
            return ResponseEntity.ok(dto);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    @Cacheable(value = "clients", key = "#code")
    public ResponseEntity<ClientDto> getClientByCode(@PathVariable String code) {
        return clientQueryService.getClientByCode(code)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    @PreAuthorize("isAuthenticated()")
    @CacheEvict(value = { "dashboardStats", "clients" }, allEntries = true)
    public ClientDto createClient(@Valid @RequestBody ClientDto clientDto) {
        log.info("Registering new client: {} {}", clientDto.getFirstName(), clientDto.getLastName());
        ClientDto saved = clientCommandService.saveClient(clientDto);
        log.info("Client registered with ID: {} code: {}", saved.getId(), saved.getClientCode());
        return saved;
    }

    @PutMapping("/{id}")
    @Transactional
    @PreAuthorize("isAuthenticated()")
    @CacheEvict(value = { "dashboardStats", "clients" }, allEntries = true)
    public ResponseEntity<ClientDto> updateClient(@PathVariable Integer id, @Valid @RequestBody ClientDto clientDto) {
        log.info("Updating client ID: {}", id);
        clientDto.setId(id);
        return ResponseEntity.ok(clientCommandService.saveClient(clientDto));
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    @CacheEvict(value = { "dashboardStats", "clients" }, allEntries = true)
    public ResponseEntity<Void> deleteClient(@PathVariable Integer id) {
        log.warn("Deleting client ID: {}", id);
        clientCommandService.deleteClient(id);
        return ResponseEntity.ok().build();
    }
}

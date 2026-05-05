package com.mtp.api.controllers;

import com.mtp.api.dto.ClientProfileDto;
import com.mtp.api.repositories.CaseRepository;
import com.mtp.api.repositories.ClientRepository;
import com.mtp.api.repositories.PlacementRepository;
import com.mtp.api.repositories.SocialSupportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientProfileController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private PlacementRepository placementRepository;

    @Autowired
    private SocialSupportRepository socialSupportRepository;

    @Autowired
    private com.mtp.api.repositories.EducationRepository educationRepository;

    @Autowired
    private com.mtp.api.repositories.LanguageRepository languageRepository;

    @Autowired
    private com.mtp.api.repositories.ComputerSkillRepository computerSkillRepository;

    @Autowired
    private com.mtp.api.repositories.JobExperienceRepository jobExperienceRepository;

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
            return ResponseEntity.ok(dto);
        }).orElse(ResponseEntity.notFound().build());
    }
}

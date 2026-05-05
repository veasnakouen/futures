package com.mtp.api.controllers;

import com.mtp.api.repositories.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lookups")
@Slf4j
public class LookupController {

    @Autowired private AgentRepository agentRepository;
    @Autowired private PositionRepository positionRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private TicketTypeRepository ticketTypeRepository;
    @Autowired private EducationReferralSourceRepository educationReferralSourceRepository;
    @Autowired private BusinessSetUpCategoryRepository businessSetUpCategoryRepository;
    @Autowired private FurtherEducationReferralSubjectRepository furtherEducationReferralSubjectRepository;

    // --- All lookups are cached in "lookups" cache (10-minute TTL via CacheConfig) ---
    // These never change during a session, so caching them saves dozens of DB hits per page load.

    @Cacheable(value = "lookups", key = "'agents'")
    @GetMapping("/agents")
    public List<?> getAgents() {
        log.debug("Cache MISS: loading agents from DB");
        return agentRepository.findAll();
    }

    @Cacheable(value = "lookups", key = "'positions'")
    @GetMapping("/positions")
    public List<?> getPositions() {
        log.debug("Cache MISS: loading positions from DB");
        return positionRepository.findAll();
    }

    @Cacheable(value = "lookups", key = "'departments'")
    @GetMapping("/departments")
    public List<?> getDepartments() {
        log.debug("Cache MISS: loading departments from DB");
        return departmentRepository.findAll();
    }

    @Cacheable(value = "lookups", key = "'categories'")
    @GetMapping("/categories")
    public List<?> getCategories() {
        log.debug("Cache MISS: loading categories from DB");
        return categoryRepository.findAll();
    }

    @Cacheable(value = "lookups", key = "'ticketTypes'")
    @GetMapping("/ticket-types")
    public List<?> getTicketTypes() {
        log.debug("Cache MISS: loading ticket types from DB");
        return ticketTypeRepository.findAll();
    }

    @Cacheable(value = "lookups", key = "'referralSources'")
    @GetMapping("/referral-sources")
    public List<?> getReferralSources() {
        return educationReferralSourceRepository.findAll();
    }

    @Cacheable(value = "lookups", key = "'businessSetupCategories'")
    @GetMapping("/business-setup-categories")
    public List<?> getBusinessCategories() {
        return businessSetUpCategoryRepository.findAll();
    }

    @Cacheable(value = "lookups", key = "'furtherEducationSubjects'")
    @GetMapping("/further-education-subjects")
    public List<?> getFurtherEducationSubjects() {
        return furtherEducationReferralSubjectRepository.findAll();
    }

    /**
     * Admin endpoint: manually flush all lookup caches if reference data changes.
     * Call POST /api/lookups/refresh-cache after updating departments/positions in DB.
     */
    @PostMapping("/refresh-cache")
    @CacheEvict(value = "lookups", allEntries = true)
    public String refreshCache() {
        log.info("Lookup cache manually evicted by admin request");
        return "Lookup cache cleared successfully";
    }
}

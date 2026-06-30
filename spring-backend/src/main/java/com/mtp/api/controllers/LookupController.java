package com.mtp.api.controllers;

import com.mtp.api.models.Department;
import com.mtp.api.models.Position;
import com.mtp.api.models.TicketType;
import com.mtp.api.models.ExpectedSupportOption;
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

    @Autowired
    private AgentRepository agentRepository;
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private TicketTypeRepository ticketTypeRepository;
    @Autowired
    private EducationReferralSourceRepository educationReferralSourceRepository;
    @Autowired
    private BusinessSetUpCategoryRepository businessSetUpCategoryRepository;
    @Autowired
    private FurtherEducationReferralSubjectRepository furtherEducationReferralSubjectRepository;
    @Autowired
    private ExpectedSupportOptionRepository expectedSupportOptionRepository;

    // --- All lookups are cached in "lookups" cache (10-minute TTL via CacheConfig)
    // ---
    // These never change during a session, so caching them saves dozens of DB hits
    // per page load.

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

    @Cacheable(value = "lookups", key = "'expectedSupports'")
    @GetMapping("/expected-supports")
    public List<?> getExpectedSupports() {
        return expectedSupportOptionRepository.findAll();
    }

    // --- CRUD operations for Departments with cache eviction ---
    @CacheEvict(value = "lookups", allEntries = true)
    @PostMapping("/departments")
    public Department createDepartment(@RequestBody Department department) {
        log.info("Creating dynamic department: {}", department.getName());
        return departmentRepository.save(department);
    }

    @CacheEvict(value = "lookups", allEntries = true)
    @DeleteMapping("/departments/{id}")
    public void deleteDepartment(@PathVariable Integer id) {
        log.info("Decommissioning department with ID: {}", id);
        departmentRepository.deleteById(id);
    }

    @CacheEvict(value = "lookups", allEntries = true)
    @DeleteMapping("/departments/name/{name}")
    public void deleteDepartmentByName(@PathVariable String name) {
        log.info("Decommissioning department with name: {}", name);
        departmentRepository.findFirstByName(name).ifPresent(dept -> departmentRepository.delete(dept));
    }

    // --- CRUD operations for Positions/Roles with cache eviction ---
    @CacheEvict(value = "lookups", allEntries = true)
    @PostMapping("/positions")
    public Position createPosition(@RequestBody Position position) {
        log.info("Creating dynamic position: {}", position.getName());
        return positionRepository.save(position);
    }

    @CacheEvict(value = "lookups", allEntries = true)
    @DeleteMapping("/positions/{id}")
    public void deletePosition(@PathVariable Integer id) {
        log.info("Purging position with ID: {}", id);
        positionRepository.deleteById(id);
    }

    @CacheEvict(value = "lookups", allEntries = true)
    @DeleteMapping("/positions/name/{name}")
    public void deletePositionByName(@PathVariable String name) {
        log.info("Purging position with name: {}", name);
        positionRepository.findFirstByName(name).ifPresent(pos -> positionRepository.delete(pos));
    }

    // --- CRUD operations for TicketTypes with cache eviction ---
    @CacheEvict(value = "lookups", allEntries = true)
    @PostMapping("/ticket-types")
    public TicketType createTicketType(@RequestBody TicketType type) {
        log.info("Creating dynamic ticket type: {}", type.getName());
        return ticketTypeRepository.save(type);
    }

    @CacheEvict(value = "lookups", allEntries = true)
    @DeleteMapping("/ticket-types/{id}")
    public void deleteTicketType(@PathVariable Integer id) {
        log.info("Purging ticket type with ID: {}", id);
        ticketTypeRepository.deleteById(id);
    }

    // --- CRUD operations for ExpectedSupportOption with cache eviction ---
    @CacheEvict(value = "lookups", allEntries = true)
    @PostMapping("/expected-supports")
    public ExpectedSupportOption createExpectedSupport(@RequestBody ExpectedSupportOption option) {
        log.info("Creating dynamic expected support option: {}", option.getName());
        return expectedSupportOptionRepository.save(option);
    }

    @CacheEvict(value = "lookups", allEntries = true)
    @DeleteMapping("/expected-supports/{id}")
    public void deleteExpectedSupport(@PathVariable Integer id) {
        log.info("Purging expected support option with ID: {}", id);
        expectedSupportOptionRepository.deleteById(id);
    }

    @CacheEvict(value = "lookups", allEntries = true)
    @DeleteMapping("/expected-supports/name/{name}")
    public void deleteExpectedSupportByName(@PathVariable String name) {
        log.info("Purging expected support option with name: {}", name);
        expectedSupportOptionRepository.findFirstByName(name)
                .ifPresent(opt -> expectedSupportOptionRepository.delete(opt));
    }

    /**
     * Admin endpoint: manually flush all lookup caches if reference data changes.
     * Call POST /api/lookups/refresh-cache after updating departments/positions in
     * DB.
     */
    @PostMapping("/refresh-cache")
    @CacheEvict(value = "lookups", allEntries = true)
    public String refreshCache() {
        log.info("Lookup cache manually evicted by admin request");
        return "Lookup cache cleared successfully";
    }

}

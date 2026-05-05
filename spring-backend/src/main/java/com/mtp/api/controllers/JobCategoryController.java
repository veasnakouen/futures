package com.mtp.api.controllers;

import com.mtp.api.models.JobCategory;
import com.mtp.api.repositories.JobCategoryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-categories")
@Slf4j
public class JobCategoryController {

    @Autowired
    private JobCategoryRepository repository;

    @Cacheable("jobCategories")
    @GetMapping
    public List<JobCategory> getAll() {
        log.debug("Cache MISS: loading job categories from DB");
        return repository.findAll();
    }

    @CacheEvict(value = "jobCategories", allEntries = true)
    @PostMapping
    public JobCategory create(@RequestBody JobCategory category) {
        log.info("New job category created: {} — cache evicted", category.getName());
        return repository.save(category);
    }
}

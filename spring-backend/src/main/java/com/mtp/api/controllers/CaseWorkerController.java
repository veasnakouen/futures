package com.mtp.api.controllers;

import com.mtp.api.models.CaseWorker;
import com.mtp.api.repositories.CaseWorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/case-workers")

public class CaseWorkerController {
    @Autowired
    private CaseWorkerRepository repository;

    @GetMapping
    public List<CaseWorker> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public CaseWorker create(@RequestBody CaseWorker caseWorker) {
        try{
            return repository.save(caseWorker);
        }catch(Exception e){
            return null;
        }
    }

    @PutMapping("/{id}")
    public CaseWorker update(@PathVariable Integer id, @RequestBody CaseWorker caseWorker) {
        caseWorker.setId(id);
        return repository.save(caseWorker);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}

package com.mtp.api.controllers;

import com.mtp.api.models.LogBook;
import com.mtp.api.repositories.LogBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/logbooks")
@CrossOrigin(origins = "*")
public class LogBookController {

    @Autowired
    private LogBookRepository repository;

    @GetMapping
    public Page<LogBook> getLogBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("enrollDate").descending());
        if (search != null && !search.isEmpty()) {
            return repository.findByNoteContainingOrPhoneContaining(search, search, pageable);
        }
        return repository.findAll(pageable);
    }

    @PostMapping
    public LogBook createLogBook(@RequestBody LogBook logBook) {
        if (logBook.getEnrollDate() == null) {
            logBook.setEnrollDate(LocalDateTime.now());
        }
        return repository.save(logBook);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LogBook> updateLogBook(@PathVariable Integer id, @RequestBody LogBook details) {
        return repository.findById(id).map(logBook -> {
            logBook.setNote(details.getNote());
            logBook.setJobinformation(details.isJobinformation());
            logBook.setLibrary(details.isLibrary());
            logBook.setUsingComputer(details.isUsingComputer());
            logBook.setFutureService(details.isFutureService());
            logBook.setInterviewTechic(details.isInterviewTechic());
            logBook.setShortTraining(details.isShortTraining());
            return ResponseEntity.ok(repository.save(logBook));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLogBook(@PathVariable Integer id) {
        return repository.findById(id).map(logBook -> {
            repository.delete(logBook);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}

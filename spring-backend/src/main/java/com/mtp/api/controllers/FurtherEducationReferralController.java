package com.mtp.api.controllers;

import com.mtp.api.models.FurtherEducationReferral;
import com.mtp.api.repositories.FurtherEducationReferralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/further-education-referrals")
public class FurtherEducationReferralController {
    @Autowired
    private FurtherEducationReferralRepository repository;

    @GetMapping("/client/{clientId}")
    public List<FurtherEducationReferral> getByClient(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }

    @PostMapping
    public FurtherEducationReferral create(@RequestBody FurtherEducationReferral referral) {
        return repository.save(referral);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FurtherEducationReferral> update(@PathVariable Integer id, @RequestBody FurtherEducationReferral referral) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        referral.setId(id);
        return ResponseEntity.ok(repository.save(referral));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

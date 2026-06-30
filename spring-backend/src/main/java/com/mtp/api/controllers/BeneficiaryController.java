package com.mtp.api.controllers;

import com.mtp.api.models.Beneficiary;
import com.mtp.api.models.Client;
import com.mtp.api.repositories.BeneficiaryRepository;
import com.mtp.api.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@CrossOrigin(origins = "*")
public class BeneficiaryController {

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/client/{clientId}")
    public List<Beneficiary> getByClientId(@PathVariable Integer clientId) {
        return beneficiaryRepository.findByClientId(clientId);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Beneficiary beneficiary) {
        if (beneficiary.getClient() != null && beneficiary.getClient().getId() != null) {
            Client client = clientRepository.findById(beneficiary.getClient().getId()).orElse(null);
            beneficiary.setClient(client);
        }
        return ResponseEntity.ok(beneficiaryRepository.save(beneficiary));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Beneficiary beneficiary) {
        return beneficiaryRepository.findById(id).map(existing -> {
            existing.setGender(beneficiary.getGender());
            existing.setAge(beneficiary.getAge());
            return ResponseEntity.ok(beneficiaryRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return beneficiaryRepository.findById(id).map(existing -> {
            beneficiaryRepository.delete(existing);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}

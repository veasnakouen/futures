package com.mtp.api.controllers;

import com.mtp.api.models.BusinessSetUp;
import com.mtp.api.repositories.BusinessSetUpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/business-setups")
public class BusinessSetUpController {
    @Autowired
    private BusinessSetUpRepository repository;

    @GetMapping("/client/{clientId}")
    public List<BusinessSetUp> getByClient(@PathVariable Integer clientId) {
        return repository.findByClientId(clientId);
    }
}

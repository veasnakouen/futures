package com.mtp.auth.services;

import com.mtp.auth.dtos.CreateTenantCommand;
import com.mtp.auth.dtos.TenantDto;
import com.mtp.auth.models.Tenant;
import com.mtp.auth.repositories.TenantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    public List<TenantDto> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TenantDto getTenantById(String id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found with id: " + id));
        return mapToDto(tenant);
    }

    public TenantDto createTenant(CreateTenantCommand command) {
        if (tenantRepository.existsById(command.getId())) {
            throw new RuntimeException("Tenant ID already exists");
        }

        Tenant tenant = Tenant.builder()
                .id(command.getId())
                .name(command.getName())
                .managerEmail(command.getManagerEmail())
                .isActive(command.getIsActive())
                .subscriptionEndDate(command.getSubscriptionEndDate())
                .maxDevices(command.getMaxDevices())
                .allowedModules(command.getAllowedModules() != null ? command.getAllowedModules() : new java.util.ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();

        tenant = tenantRepository.save(tenant);
        return mapToDto(tenant);
    }

    public TenantDto updateTenant(String id, CreateTenantCommand command) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found with id: " + id));

        tenant.setName(command.getName());
        tenant.setManagerEmail(command.getManagerEmail());
        tenant.setIsActive(command.getIsActive());
        tenant.setSubscriptionEndDate(command.getSubscriptionEndDate());
        tenant.setMaxDevices(command.getMaxDevices());
        if (command.getAllowedModules() != null) {
            tenant.setAllowedModules(command.getAllowedModules());
        }

        tenant = tenantRepository.save(tenant);
        return mapToDto(tenant);
    }

    public void deleteTenant(String id) {
        if (!tenantRepository.existsById(id)) {
            throw new RuntimeException("Tenant not found with id: " + id);
        }
        tenantRepository.deleteById(id);
    }

    private TenantDto mapToDto(Tenant tenant) {
        return TenantDto.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .managerEmail(tenant.getManagerEmail())
                .isActive(tenant.getIsActive())
                .subscriptionEndDate(tenant.getSubscriptionEndDate())
                .maxDevices(tenant.getMaxDevices())
                .allowedModules(tenant.getAllowedModules())
                .createdAt(tenant.getCreatedAt())
                .build();
    }
}

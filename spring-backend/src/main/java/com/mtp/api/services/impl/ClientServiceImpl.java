package com.mtp.api.services.impl;

import com.mtp.api.dto.ClientDto;
import com.mtp.api.models.Client;
import com.mtp.api.repositories.ClientRepository;
import com.mtp.api.services.ClientService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private com.mtp.api.services.ImageUploadService imageUploadService;

    @Override
    public org.springframework.data.domain.Page<ClientDto> getAllClients(String name, String branch, String status,
            org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.jpa.domain.Specification<Client> spec = org.springframework.data.jpa.domain.Specification
                .where(null);

        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("firstName")), "%" + name.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("lastName")), "%" + name.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("clientCode")), "%" + name.toLowerCase() + "%")));
        }

        if (branch != null && !branch.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("branch"), branch));
        }

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        return clientRepository.findAll(spec, pageable).map(this::mapToDto);
    }

    @Override
    public Optional<ClientDto> getClientById(Integer id) {
        return clientRepository.findById(id).map(this::mapToDto);
    }

    @Override
    public Optional<ClientDto> getClientByCode(String code) {
        return clientRepository.findByClientCode(code).map(this::mapToDto);
    }

    @Override
    public ClientDto saveClient(ClientDto dto) {
        Client client = mapToEntity(dto);
        Client saved = clientRepository.save(client);
        return mapToDto(saved);
    }

    @Override
    public void deleteClient(Integer id) {
        clientRepository.deleteById(id);
    }

    private ClientDto mapToDto(Client entity) {
        ClientDto dto = new ClientDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setGender(entity.getGender());
        dto.setBranch(entity.getBranch());
        dto.setClientCode(entity.getClientCode());
        dto.setPhoto(entity.getPhoto());
        dto.setStatus(entity.getStatus());
        dto.setEmail(entity.getEmail());
        dto.setContactPhone(entity.getContactPhone());
        dto.setRegisterDate(entity.getRegisterDate());
        return dto;
    }

    private Client mapToEntity(ClientDto dto) {
        Client entity = new Client();
        if (dto.getId() != null) {
            entity = clientRepository.findById(dto.getId()).orElse(new Client());
        }
        // Security: Sanitize all user-input strings
        entity.setFirstName(com.mtp.api.security.SecurityUtils.sanitize(dto.getFirstName()));
        entity.setLastName(com.mtp.api.security.SecurityUtils.sanitize(dto.getLastName()));
        entity.setGender(com.mtp.api.security.SecurityUtils.sanitize(dto.getGender()));
        entity.setBranch(com.mtp.api.security.SecurityUtils.sanitize(dto.getBranch()));
        entity.setClientCode(com.mtp.api.security.SecurityUtils.sanitize(dto.getClientCode()));
        
        // Handle Cloudinary Upload
        if (dto.getPhoto() != null && dto.getPhoto().startsWith("data:image")) {
            try {
                entity.setPhoto(imageUploadService.uploadBase64Image(dto.getPhoto(), "clients"));
            } catch (Exception e) {
                entity.setPhoto(dto.getPhoto());
            }
        } else {
            entity.setPhoto(dto.getPhoto());
        }

        entity.setStatus(com.mtp.api.security.SecurityUtils.sanitize(dto.getStatus()));
        entity.setEmail(com.mtp.api.security.SecurityUtils.sanitize(dto.getEmail()));
        entity.setContactPhone(com.mtp.api.security.SecurityUtils.sanitize(dto.getContactPhone()));
        return entity;
    }
}

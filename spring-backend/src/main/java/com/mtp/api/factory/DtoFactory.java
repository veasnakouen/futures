package com.mtp.api.factory;

import com.mtp.api.dto.ClientDto;
import com.mtp.api.models.Client;
import org.springframework.stereotype.Component;

@Component
public class DtoFactory {

    public ClientDto createClientDto(Client entity) {
        if (entity == null) return null;
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
}

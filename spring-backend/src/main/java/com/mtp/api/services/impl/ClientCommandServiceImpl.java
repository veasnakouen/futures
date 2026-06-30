package com.mtp.api.services.impl;

import com.mtp.api.dto.ClientDto;
import com.mtp.api.models.Client;
import com.mtp.api.repositories.ClientRepository;
import com.mtp.api.services.ClientCommandService;
import com.mtp.api.services.ImageUploadService;
import com.mtp.api.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class ClientCommandServiceImpl implements ClientCommandService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ImageUploadService imageUploadService;

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

    private Client mapToEntity(ClientDto dto) {
        Client entity = new Client();
        Integer dtoId = dto.getId();
        if (dtoId != null) {
            entity = clientRepository.findById(dtoId).orElse(new Client());
        }

        entity.setFirstName(SecurityUtils.sanitize(dto.getFirstName()));
        entity.setLastName(SecurityUtils.sanitize(dto.getLastName()));
        entity.setGender(SecurityUtils.sanitize(dto.getGender()));
        entity.setBranch(SecurityUtils.sanitize(dto.getBranch()));
        entity.setClientCode(SecurityUtils.sanitize(dto.getClientCode()));

        if (entity.getAspUserId() == null) {
            entity.setAspUserId("00000000-0000-0000-0000-000000000000");
        }
        if (entity.getRegisterDate() == null) {
            entity.setRegisterDate(LocalDateTime.now());
        }

        if (dto.getPhoto() != null && dto.getPhoto().startsWith("data:image")) {
            try {
                entity.setPhoto(imageUploadService.uploadBase64Image(dto.getPhoto(), "clients"));
            } catch (Exception e) {
                entity.setPhoto(dto.getPhoto());
            }
        } else {
            entity.setPhoto(dto.getPhoto());
        }

        entity.setStatus(SecurityUtils.sanitize(dto.getStatus()));
        entity.setEmail(SecurityUtils.sanitize(dto.getEmail()));
        entity.setContactPhone(SecurityUtils.sanitize(dto.getContactPhone()));
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setRelativePhone(SecurityUtils.sanitize(dto.getRelativePhone()));
        entity.setMaritalStatus(SecurityUtils.sanitize(dto.getMaritalStatus()));
        entity.setAddress(SecurityUtils.sanitize(dto.getAddress()));
        entity.setProvince(SecurityUtils.sanitize(dto.getProvince()));
        entity.setIdCard(SecurityUtils.sanitize(dto.getIdCard()));
        entity.setCurrentSituation(SecurityUtils.sanitize(dto.getCurrentSituation()));
        entity.setFurtherEducation(dto.isFurtherEducation());
        entity.setPlacement(dto.isPlacement());
        entity.setTrainingFromFutures(dto.isTrainingFromFutures());
        entity.setSocialSupportRequired(dto.isSocialSupportRequired());
        entity.setHearBy(SecurityUtils.sanitize(dto.getHearBy()));
        entity.setExpectedSupport(SecurityUtils.sanitize(dto.getExpectedSupport()));
        entity.setPlaceOfBirth(SecurityUtils.sanitize(dto.getPlaceOfBirth()));
        entity.setNationality(SecurityUtils.sanitize(dto.getNationality()));
        entity.setCitizenship(SecurityUtils.sanitize(dto.getCitizenship()));
        entity.setHeight(SecurityUtils.sanitize(dto.getHeight()));
        entity.setWeight(SecurityUtils.sanitize(dto.getWeight()));
        entity.setSocialSupportProblem(SecurityUtils.sanitize(dto.getSocialSupportProblem()));
        entity.setIdpoorStatus(SecurityUtils.sanitize(dto.getIdpoorStatus()));
        entity.setIdpoorValiddate(dto.getIdpoorValiddate());
        entity.setIdpoorLevel(SecurityUtils.sanitize(dto.getIdpoorLevel()));
        entity.setIdpoorAccountNumber(SecurityUtils.sanitize(dto.getIdpoorAccountNumber()));

        entity.setPhotoIdAttachment(dto.getPhotoIdAttachment());
        entity.setContractAttachment(dto.getContractAttachment());
        entity.setIdPoorAttachment(dto.getIdPoorAttachment());
        entity.setCvAttachment(dto.getCvAttachment());
        entity.setCustomFields(dto.getCustomFields());

        return entity;
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
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setRelativePhone(entity.getRelativePhone());
        dto.setMaritalStatus(entity.getMaritalStatus());
        dto.setAddress(entity.getAddress());
        dto.setProvince(entity.getProvince());
        dto.setIdCard(entity.getIdCard());
        dto.setCurrentSituation(entity.getCurrentSituation());
        dto.setFurtherEducation(entity.isFurtherEducation());
        dto.setPlacement(entity.isPlacement());
        dto.setTrainingFromFutures(entity.isTrainingFromFutures());
        dto.setSocialSupportRequired(entity.isSocialSupportRequired());
        dto.setHearBy(entity.getHearBy());
        dto.setExpectedSupport(entity.getExpectedSupport());
        dto.setPlaceOfBirth(entity.getPlaceOfBirth());
        dto.setNationality(entity.getNationality());
        dto.setCitizenship(entity.getCitizenship());
        dto.setHeight(entity.getHeight());
        dto.setWeight(entity.getWeight());
        dto.setSocialSupportProblem(entity.getSocialSupportProblem());
        dto.setIdpoorStatus(entity.getIdpoorStatus());
        dto.setIdpoorValiddate(entity.getIdpoorValiddate());
        dto.setIdpoorLevel(entity.getIdpoorLevel());
        dto.setIdpoorAccountNumber(entity.getIdpoorAccountNumber());
        dto.setRegisterDate(entity.getRegisterDate());
        dto.setPhotoIdAttachment(entity.getPhotoIdAttachment());
        dto.setContractAttachment(entity.getContractAttachment());
        dto.setIdPoorAttachment(entity.getIdPoorAttachment());
        dto.setCvAttachment(entity.getCvAttachment());
        dto.setCustomFields(entity.getCustomFields());
        return dto;
    }
}

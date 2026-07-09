package com.mtp.api.services.impl;

import com.mtp.api.dto.ClientDto;
import com.mtp.api.dto.ClientSummaryDto;
import com.mtp.api.models.Client;
import com.mtp.api.repositories.ClientRepository;
import com.mtp.api.services.ClientQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClientQueryServiceImpl implements ClientQueryService {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public Page<ClientSummaryDto> getAllClients(String name, String branch, String status, Pageable pageable) {
        return clientRepository.findAllSummaries(name, branch, status, pageable).map(this::mapToSummaryDtoFromInterface);
    }

    private ClientSummaryDto mapToSummaryDtoFromInterface(ClientRepository.ClientSummary entity) {
        ClientSummaryDto dto = new ClientSummaryDto();
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

    @Override
    public Optional<ClientDto> getClientById(Integer id) {
        return clientRepository.findById(id).map(this::mapToDto);
    }

    @Override
    public Optional<ClientDto> getClientByCode(String code) {
        return clientRepository.findByClientCode(code).map(this::mapToDto);
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

    private ClientSummaryDto mapToSummaryDto(Client entity) {
        ClientSummaryDto dto = new ClientSummaryDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setGender(entity.getGender());
        dto.setBranch(entity.getBranch());
        dto.setClientCode(entity.getClientCode());
        dto.setPhoto(entity.getPhoto()); // Keeping profile picture only
        dto.setStatus(entity.getStatus());
        dto.setEmail(entity.getEmail());
        dto.setContactPhone(entity.getContactPhone());
        dto.setRegisterDate(entity.getRegisterDate());
        return dto;
    }
}

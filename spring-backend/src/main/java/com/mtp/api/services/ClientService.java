package com.mtp.api.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.mtp.api.dto.ClientDto;
import java.util.List;
import java.util.Optional;

public interface ClientService {
    Page<ClientDto> getAllClients(String name, String branch, String status, Pageable pageable);
    Optional<ClientDto> getClientById(Integer id);

    Optional<ClientDto> getClientByCode(String code);
    ClientDto saveClient(ClientDto clientDto);
    void deleteClient(Integer id);
}

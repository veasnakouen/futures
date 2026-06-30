package com.mtp.api.services;

import com.mtp.api.dto.ClientDto;
import com.mtp.api.dto.ClientSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface ClientQueryService {
    Page<ClientSummaryDto> getAllClients(String name, String branch, String status, Pageable pageable);
    Optional<ClientDto> getClientById(Integer id);
    Optional<ClientDto> getClientByCode(String code);
}

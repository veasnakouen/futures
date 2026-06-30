package com.mtp.api.services;

import com.mtp.api.dto.ClientDto;

public interface ClientCommandService {
    ClientDto saveClient(ClientDto dto);
    void deleteClient(Integer id);
}

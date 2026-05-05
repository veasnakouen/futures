package com.mtp.api.services;

import com.mtp.api.dto.ClientDto;
import com.mtp.api.models.Client;
import com.mtp.api.repositories.ClientRepository;
import com.mtp.api.services.impl.ClientServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClientServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientServiceImpl clientService;

    private Client client;

    @BeforeEach
    void setUp() {
        client = new Client();
        client.setId(1);
        client.setFirstName("John");
        client.setLastName("Doe");
    }

    @Test
    void getClientById_ShouldReturnDto_WhenClientExists() {
        when(clientRepository.findById(1)).thenReturn(Optional.of(client));

        Optional<ClientDto> result = clientService.getClientById(1);

        assertTrue(result.isPresent());
        assertEquals("John", result.get().getFirstName());
        verify(clientRepository, times(1)).findById(1);
    }

    @Test
    void getAllClients_ShouldReturnPaginatedDtos() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Client> clientPage = new PageImpl<>(Collections.singletonList(client));
        
        when(clientRepository.findAll(pageable)).thenReturn(clientPage);

        Page<ClientDto> result = clientService.getAllClients(pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("John", result.getContent().get(0).getFirstName());
    }
}

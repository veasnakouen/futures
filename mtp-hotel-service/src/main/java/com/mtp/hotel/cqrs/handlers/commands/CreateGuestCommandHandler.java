package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.CreateGuestCommand;
import com.mtp.hotel.cqrs.dto.GuestQueryResultDto;
import com.mtp.hotel.cqrs.mappers.GuestMapper;
import com.mtp.hotel.models.Guest;
import com.mtp.hotel.repositories.GuestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateGuestCommandHandler {

    private final GuestRepository repository;
    private final GuestMapper mapper;

    @Transactional
    public GuestQueryResultDto handle(CreateGuestCommand command) {
        Guest entity = mapper.toEntity(command);
        Guest savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }
}

package com.mtp.hotel.cqrs.handlers.commands;

import com.mtp.hotel.cqrs.commands.UpdateGuestCommand;
import com.mtp.hotel.cqrs.dto.GuestQueryResultDto;
import com.mtp.hotel.cqrs.mappers.GuestMapper;
import com.mtp.hotel.repositories.GuestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateGuestCommandHandler {

    private final GuestRepository repository;
    private final GuestMapper mapper;

    @Transactional
    public Optional<GuestQueryResultDto> handle(UpdateGuestCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setFirstName(command.getFirstName());
            entity.setLastName(command.getLastName());
            entity.setEmail(command.getEmail());
            entity.setPhoneNumber(command.getPhoneNumber());
            entity.setIdProofNumber(command.getIdProofNumber());
            entity.setAddress(command.getAddress());
            entity.setIsActive(command.getIsActive());
            entity.setNationality(command.getNationality());
            entity.setDateOfBirth(command.getDateOfBirth());
            entity.setEmergencyContact(command.getEmergencyContact());
            return mapper.toDto(repository.save(entity));
        });
    }
}

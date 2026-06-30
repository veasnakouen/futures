package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.UpdateParentCommand;
import com.mtp.school.cqrs.dto.ParentQueryResultDto;
import com.mtp.school.cqrs.mappers.ParentMapper;
import com.mtp.school.models.Parent;
import com.mtp.school.models.Address;
import com.mtp.school.repositories.ParentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateParentCommandHandler {

    private final ParentRepository repository;
    private final ParentMapper mapper;

    @Transactional
    public Optional<ParentQueryResultDto> handle(UpdateParentCommand command) {
        return repository.findById(command.getId()).map((Parent entity) -> {
            if (command.getName() != null) {
                int spaceIndex = command.getName().indexOf(" ");
                if (spaceIndex > -1) {
                    entity.setFirstName(command.getName().substring(0, spaceIndex));
                    entity.setLastName(command.getName().substring(spaceIndex + 1));
                } else {
                    entity.setFirstName(command.getName());
                    entity.setLastName("");
                }
            }
            entity.setPhoneNumber(command.getContactNumber());
            entity.setEmail(command.getEmail());
            if (command.getGender() != null) {
                entity.setGender(command.getGender());
            }
            if (command.getAddress() != null) {
                if (entity.getAddress() == null) {
                    entity.setAddress(new Address());
                }
                entity.getAddress().setStreet(command.getAddress().getStreet());
                entity.getAddress().setCity(command.getAddress().getCity());
                entity.getAddress().setState(command.getAddress().getState());
                entity.getAddress().setZipCode(command.getAddress().getZipCode());
                entity.getAddress().setCountry(command.getAddress().getCountry());
            }
            return mapper.toDto(repository.save(entity));
        });
    }
}

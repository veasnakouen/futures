package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.UpdateExtracurricularCommand;
import com.mtp.school.cqrs.dto.ExtracurricularQueryResultDto;
import com.mtp.school.cqrs.mappers.ExtracurricularMapper;
import com.mtp.school.repositories.ExtracurricularRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

import com.mtp.school.repositories.TeacherRepository;

@Service
@RequiredArgsConstructor
public class UpdateExtracurricularCommandHandler {

    private final ExtracurricularRepository repository;
    private final TeacherRepository teacherRepository;
    private final ExtracurricularMapper mapper;

    @Transactional
    public Optional<ExtracurricularQueryResultDto> handle(UpdateExtracurricularCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setName(command.getName());
            entity.setDescription(command.getDescription());
            entity.setSchedule(command.getSchedule());
            entity.setLocation(command.getLocation());
            entity.setCapacity(command.getCapacity());
            entity.setCost(command.getCost());
            
            if (command.getLeadTeacherId() != null && !command.getLeadTeacherId().isEmpty()) {
                entity.setLeadTeacher(teacherRepository.findById(command.getLeadTeacherId()).orElse(null));
            } else {
                entity.setLeadTeacher(null);
            }
            
            return mapper.toDto(repository.save(entity));
        });
    }
}

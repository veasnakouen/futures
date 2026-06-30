package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.CreateStudentCommand;
import com.mtp.school.cqrs.dto.StudentQueryResultDto;
import com.mtp.school.cqrs.mappers.StudentMapper;
import com.mtp.school.models.Student;
import com.mtp.school.models.MedicalRecord;
import com.mtp.school.repositories.StudentRepository;
import com.mtp.school.repositories.ParentRepository;
import com.mtp.school.repositories.ExtracurricularRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import com.mtp.school.models.StudentParent;
import com.mtp.school.cqrs.commands.StudentParentCommandDto;
import com.mtp.school.models.Parent;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateStudentCommandHandler {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ExtracurricularRepository extracurricularRepository;
    private final StudentMapper studentMapper;

    @Transactional
    public StudentQueryResultDto handle(CreateStudentCommand command) {
        Student entity = studentMapper.toEntity(command);
        
        if (command.getParentRelationships() != null && !command.getParentRelationships().isEmpty()) {
            for (StudentParentCommandDto spDto : command.getParentRelationships()) {
                Parent parent = parentRepository.findById(spDto.getParentId()).orElse(null);
                if (parent != null) {
                    StudentParent sp = new StudentParent();
                    sp.setStudent(entity);
                    sp.setParent(parent);
                    sp.setRelationshipType(spDto.getRelationshipType());
                    entity.getStudentParents().add(sp);
                }
            }
        }
        
        if (command.getExtracurricularIds() != null && !command.getExtracurricularIds().isEmpty()) {
            entity.setExtracurriculars(extracurricularRepository.findAllById(command.getExtracurricularIds()));
        }
        
        if (command.getMedicalConditions() != null && !command.getMedicalConditions().isEmpty()) {
            MedicalRecord record = new MedicalRecord();
            record.setConditions(command.getMedicalConditions());
            entity.setMedicalRecord(record);
        }
        
        Student savedEntity = studentRepository.save(entity);
        return studentMapper.toDto(savedEntity);
    }
}

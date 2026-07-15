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
import com.mtp.school.repositories.BranchRepository;
import com.mtp.school.repositories.ClassroomRepository;
import com.mtp.school.repositories.DormitoryRepository;

@Service
@RequiredArgsConstructor
public class CreateStudentCommandHandler {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ExtracurricularRepository extracurricularRepository;
    private final BranchRepository branchRepository;
    private final ClassroomRepository classroomRepository;
    private final DormitoryRepository dormitoryRepository;
    private final StudentMapper studentMapper;

    @Transactional
    public StudentQueryResultDto handle(CreateStudentCommand command) {
        Student entity = studentMapper.toEntity(command);
        
        if (command.getBranchId() != null && !command.getBranchId().isEmpty()) {
            branchRepository.findById(command.getBranchId()).ifPresent(entity::setBranch);
        }
        if (command.getClassroomId() != null && !command.getClassroomId().isEmpty()) {
            classroomRepository.findById(command.getClassroomId()).ifPresent(entity::setClassroom);
        }
        if (command.getDormitoryId() != null && !command.getDormitoryId().isEmpty()) {
            dormitoryRepository.findById(command.getDormitoryId()).ifPresent(entity::setDormitory);
        }

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

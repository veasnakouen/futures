package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.UpdateStudentCommand;
import com.mtp.school.cqrs.dto.StudentQueryResultDto;
import com.mtp.school.cqrs.mappers.StudentMapper;
import com.mtp.school.models.MedicalRecord;
import com.mtp.school.repositories.StudentRepository;
import com.mtp.school.repositories.ParentRepository;
import com.mtp.school.repositories.ExtracurricularRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;
import com.mtp.school.models.StudentParent;
import com.mtp.school.cqrs.commands.StudentParentCommandDto;
import com.mtp.school.models.Parent;

@Service
@RequiredArgsConstructor
public class UpdateStudentCommandHandler {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ExtracurricularRepository extracurricularRepository;
    private final StudentMapper studentMapper;

    @Transactional
    public Optional<StudentQueryResultDto> handle(UpdateStudentCommand command) {
        return studentRepository.findById(command.getId()).map(student -> {
            student.setFirstName(command.getFirstName());
            student.setLastName(command.getLastName());
            student.setEmail(command.getEmail());
            student.setDateOfBirth(command.getDateOfBirth());
            student.setIsActive(command.getIsActive());

            if (command.getParentRelationships() != null) {
                student.getStudentParents().clear();
                for (StudentParentCommandDto spDto : command.getParentRelationships()) {
                    Parent parent = parentRepository.findById(spDto.getParentId()).orElse(null);
                    if (parent != null) {
                        StudentParent sp = new StudentParent();
                        sp.setStudent(student);
                        sp.setParent(parent);
                        sp.setRelationshipType(spDto.getRelationshipType());
                        student.getStudentParents().add(sp);
                    }
                }
            }


            if (command.getExtracurricularIds() != null) {
                student.setExtracurriculars(extracurricularRepository.findAllById(command.getExtracurricularIds()));
            }

            if (command.getMedicalConditions() != null) {
                if (student.getMedicalRecord() == null) {
                    student.setMedicalRecord(new MedicalRecord());
                }
                student.getMedicalRecord().setConditions(command.getMedicalConditions());
            }

            return studentMapper.toDto(studentRepository.save(student));
        });
    }
}

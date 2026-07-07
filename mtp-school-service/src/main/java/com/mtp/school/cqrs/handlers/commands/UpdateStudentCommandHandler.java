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
import com.mtp.school.repositories.BranchRepository;
import com.mtp.school.repositories.ClassroomRepository;
import com.mtp.school.repositories.DormitoryRepository;

@Service
@RequiredArgsConstructor
public class UpdateStudentCommandHandler {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;
    private final ExtracurricularRepository extracurricularRepository;
    private final BranchRepository branchRepository;
    private final ClassroomRepository classroomRepository;
    private final DormitoryRepository dormitoryRepository;
    private final StudentMapper studentMapper;

    @Transactional
    public Optional<StudentQueryResultDto> handle(UpdateStudentCommand command) {
        return studentRepository.findById(command.getId()).map(student -> {
            student.setFirstName(command.getFirstName());
            student.setLastName(command.getLastName());
            student.setEmail(command.getEmail());
            student.setDateOfBirth(command.getDateOfBirth());
            student.setIsActive(command.getIsActive());
            
            student.setMiddleName(command.getMiddleName());
            student.setGender(command.getGender());
            student.setNationality(command.getNationality());
            student.setStudentPhone(command.getStudentPhone());
            student.setCurrentAddress(command.getCurrentAddress() != null ? studentMapper.toAddress(command.getCurrentAddress()) : null);
            student.setPermanentAddress(command.getPermanentAddress() != null ? studentMapper.toAddress(command.getPermanentAddress()) : null);
            student.setStudentCode(command.getStudentCode());
            student.setClinicPatientId(command.getClinicPatientId());
            student.setGlobalClientId(command.getGlobalClientId());
            
            student.setIsIdPoor(command.getIsIdPoor() != null ? command.getIsIdPoor() : false);
            student.setIdPoorNumber(command.getIdPoorNumber());
            student.setBroughtByOutreachWorker(command.getBroughtByOutreachWorker() != null ? command.getBroughtByOutreachWorker() : false);
            student.setOutreachWorkerName(command.getOutreachWorkerName());
            student.setOutreachOrganization(command.getOutreachOrganization());

            if (command.getBranchId() != null && !command.getBranchId().isEmpty()) {
                branchRepository.findById(command.getBranchId()).ifPresent(student::setBranch);
            }
            if (command.getClassroomId() != null && !command.getClassroomId().isEmpty()) {
                classroomRepository.findById(command.getClassroomId()).ifPresent(student::setClassroom);
            }
            if (command.getDormitoryId() != null && !command.getDormitoryId().isEmpty()) {
                dormitoryRepository.findById(command.getDormitoryId()).ifPresent(student::setDormitory);
            }

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

package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.UpdateTeacherCommand;
import com.mtp.school.cqrs.dto.TeacherQueryResultDto;
import com.mtp.school.cqrs.mappers.TeacherMapper;
import com.mtp.school.repositories.TeacherRepository;
import com.mtp.school.repositories.CourseRepository;
import com.mtp.school.models.Course;
import com.mtp.school.models.Teacher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateTeacherCommandHandler {

    private final TeacherRepository repository;
    private final CourseRepository courseRepository;
    private final TeacherMapper mapper;

    @Transactional
    public Optional<TeacherQueryResultDto> handle(UpdateTeacherCommand command) {
        return repository.findById(command.getId()).map(entity -> {
            entity.setFirstName(command.getFirstName());
            entity.setLastName(command.getLastName());
            entity.setEmail(command.getEmail());
            entity.setSubject(command.getSubject());
            entity.setHireDate(command.getHireDate());
            entity.setIsActive(command.getIsActive());
            entity.setBaseSalary(command.getBaseSalary());
            entity.setImageUrl(command.getImageUrl());
            entity.setFacebookLink(command.getFacebookLink());
            entity.setInstagramLink(command.getInstagramLink());
            entity.setTwitterLink(command.getTwitterLink());
            entity.setLinkedinLink(command.getLinkedinLink());
            
            if (command.getBranchId() != null && !command.getBranchId().isEmpty()) {
                com.mtp.school.models.Branch branch = new com.mtp.school.models.Branch();
                branch.setId(command.getBranchId());
                entity.setBranch(branch);
            } else {
                entity.setBranch(null);
            }

            if (command.getAddress() != null) {
                com.mtp.school.models.Address address = new com.mtp.school.models.Address();
                address.setStreet(command.getAddress().getStreet());
                address.setCity(command.getAddress().getCity());
                address.setState(command.getAddress().getState());
                address.setZipCode(command.getAddress().getZipCode());
                address.setCountry(command.getAddress().getCountry());
                address.setDistrict(command.getAddress().getDistrict());
                address.setCommune(command.getAddress().getCommune());
                address.setVillage(command.getAddress().getVillage());
                entity.setAddress(address);
            } else {
                entity.setAddress(null);
            }

            Teacher savedEntity = repository.save(entity);
            
            if (command.getCourseIds() != null) {
                // Remove teacher from existing courses that are not in the new list
                java.util.List<Course> existingCourses = courseRepository.findByTeacherId(savedEntity.getId(), org.springframework.data.domain.Pageable.unpaged()).getContent();
                for (Course course : existingCourses) {
                    if (!command.getCourseIds().contains(course.getId())) {
                        course.setTeacher(null);
                        courseRepository.save(course);
                    }
                }
                
                // Add teacher to new courses
                if (!command.getCourseIds().isEmpty()) {
                    java.util.List<Course> newCourses = courseRepository.findAllById(command.getCourseIds());
                    for (Course course : newCourses) {
                        course.setTeacher(savedEntity);
                    }
                    courseRepository.saveAll(newCourses);
                }
            }

            return mapper.toDto(savedEntity);
        });
    }
}

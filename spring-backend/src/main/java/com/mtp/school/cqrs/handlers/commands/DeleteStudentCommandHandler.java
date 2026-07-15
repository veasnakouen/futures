package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DeleteStudentCommandHandler {
    private final StudentRepository studentRepository;

    @Transactional
    public void handle(String id) {
        try {
            studentRepository.deleteById(id);
            studentRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete student because there are existing records linked to them (such as enrollments or parents).");
        }
    }
}

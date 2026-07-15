package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.repositories.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class DeleteBranchCommandHandler {
    private final BranchRepository branchRepository;

    @Transactional
    public void handle(String id) {
        try {
            branchRepository.deleteById(id);
            branchRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete branch because it is currently in use (assigned to students, teachers, or courses).");
        }
    }
}

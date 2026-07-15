package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.CreateBranchCommand;
import com.mtp.school.cqrs.dto.BranchQueryResultDto;
import com.mtp.school.cqrs.mappers.BranchMapper;
import com.mtp.school.models.Branch;
import com.mtp.school.repositories.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateBranchCommandHandler {
    private final BranchRepository branchRepository;
    private final BranchMapper branchMapper;

    @Transactional
    public BranchQueryResultDto handle(CreateBranchCommand command) {
        Branch entity = branchMapper.toEntity(command);
        Branch saved = branchRepository.save(entity);
        return branchMapper.toDto(saved);
    }
}

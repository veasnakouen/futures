package com.mtp.school.cqrs.handlers.commands;

import com.mtp.school.cqrs.commands.UpdateBranchCommand;
import com.mtp.school.cqrs.dto.BranchQueryResultDto;
import com.mtp.school.cqrs.mappers.BranchMapper;
import com.mtp.school.models.Branch;
import com.mtp.school.repositories.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateBranchCommandHandler {
    private final BranchRepository branchRepository;
    private final BranchMapper branchMapper;

    @Transactional
    public Optional<BranchQueryResultDto> handle(UpdateBranchCommand command) {
        return branchRepository.findById(command.getId())
                .map(existing -> {
                    branchMapper.updateEntity(command, existing);
                    return branchRepository.save(existing);
                })
                .map(branchMapper::toDto);
    }
}

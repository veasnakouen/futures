package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.BranchQueryResultDto;
import com.mtp.school.cqrs.mappers.BranchMapper;
import com.mtp.school.cqrs.queries.GetAllBranchesQuery;
import com.mtp.school.repositories.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllBranchesQueryHandler {
    private final BranchRepository repository;
    private final BranchMapper mapper;

    public List<BranchQueryResultDto> handle(GetAllBranchesQuery query) {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}

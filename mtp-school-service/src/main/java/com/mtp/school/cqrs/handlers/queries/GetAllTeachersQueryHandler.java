package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.TeacherQueryResultDto;
import com.mtp.school.cqrs.mappers.TeacherMapper;
import com.mtp.school.cqrs.queries.GetAllTeachersQuery;
import com.mtp.school.repositories.TeacherRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllTeachersQueryHandler {

    private final TeacherRepository repository;
    private final TeacherMapper mapper;

    public Page<TeacherQueryResultDto> handle(GetAllTeachersQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}

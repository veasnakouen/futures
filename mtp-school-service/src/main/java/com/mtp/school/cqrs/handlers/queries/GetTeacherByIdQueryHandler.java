package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.TeacherQueryResultDto;
import com.mtp.school.cqrs.mappers.TeacherMapper;
import com.mtp.school.cqrs.queries.GetTeacherByIdQuery;
import com.mtp.school.repositories.TeacherRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetTeacherByIdQueryHandler {

    private final TeacherRepository repository;
    private final TeacherMapper mapper;

    public Optional<TeacherQueryResultDto> handle(GetTeacherByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}

package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.StudentQueryResultDto;
import com.mtp.school.cqrs.mappers.StudentMapper;
import com.mtp.school.cqrs.queries.GetAllStudentsQuery;
import com.mtp.school.repositories.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllStudentsQueryHandler {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    public Page<StudentQueryResultDto> handle(GetAllStudentsQuery query) {
        PageRequest pageRequest = PageRequest.of(query.getPage(), query.getSize());

        if (query.getOutreachWorkerName() != null && !query
                .getOutreachWorkerName()
                .trim()
                .isEmpty()) {
            return studentRepository
                    .findByOutreachWorkerNameContainingIgnoreCase(query.getOutreachWorkerName(), pageRequest)
                    .map(studentMapper::toDto);
        }

        return studentRepository
                .findAll(pageRequest)
                .map(studentMapper::toDto);
    }
}

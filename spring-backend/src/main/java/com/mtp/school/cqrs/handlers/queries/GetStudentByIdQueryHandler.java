package com.mtp.school.cqrs.handlers.queries;

import com.mtp.school.cqrs.dto.StudentQueryResultDto;
import com.mtp.school.cqrs.mappers.StudentMapper;
import com.mtp.school.cqrs.queries.GetStudentByIdQuery;
import com.mtp.school.repositories.StudentRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetStudentByIdQueryHandler {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    public Optional<StudentQueryResultDto> handle(GetStudentByIdQuery query) {
        return studentRepository.findById(query.getId())
                .map(studentMapper::toDto);
    }
}

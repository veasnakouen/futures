package com.mtp.school.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.domain.Pageable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllStudentsQuery {
    private Pageable pageable;
    private String search;
    private String outreachWorkerName;
}

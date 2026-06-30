package com.mtp.school.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllTeachersQuery {
    private int page;
    private int size;
}

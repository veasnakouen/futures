package com.mtp.clinic.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllPatientsQuery {
    private int page;
    private int size;
}

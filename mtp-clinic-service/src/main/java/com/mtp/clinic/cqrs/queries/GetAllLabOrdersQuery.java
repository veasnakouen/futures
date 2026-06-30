package com.mtp.clinic.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetAllLabOrdersQuery {
    private int page;
    private int size;
}

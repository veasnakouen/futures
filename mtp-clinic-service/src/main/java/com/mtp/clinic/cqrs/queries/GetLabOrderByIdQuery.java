package com.mtp.clinic.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetLabOrderByIdQuery {
    private String id;
}

package com.mtp.billing.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetInvoiceByIdQuery {
    private String id;
}

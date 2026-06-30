package com.mtp.billing.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetAllInvoicesQuery {
    private int page;
    private int size;
}

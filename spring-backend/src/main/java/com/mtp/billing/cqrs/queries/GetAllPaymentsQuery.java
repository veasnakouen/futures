package com.mtp.billing.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Pageable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllPaymentsQuery {
    private Pageable pageable;
    private int page;
    private int size;

    public GetAllPaymentsQuery(Pageable pageable) {
        this.pageable = pageable;
    }

    public GetAllPaymentsQuery(int page, int size) {
        this.page = page;
        this.size = size;
    }
}

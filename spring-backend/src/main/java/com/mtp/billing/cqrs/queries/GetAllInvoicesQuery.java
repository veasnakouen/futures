package com.mtp.billing.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllInvoicesQuery {
    private int page;
    private int size;
    private Pageable pageable;

    public GetAllInvoicesQuery(int page, int size) {
        this.page = page;
        this.size = size;
        this.pageable = PageRequest.of(page, size);
    }

    public GetAllInvoicesQuery(Pageable pageable) {
        this.pageable = pageable;
        this.page = pageable.getPageNumber();
        this.size = pageable.getPageSize();
    }
}

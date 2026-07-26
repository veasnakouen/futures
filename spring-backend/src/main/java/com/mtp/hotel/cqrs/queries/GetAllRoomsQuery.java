package com.mtp.hotel.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllRoomsQuery {
    private int page;
    private int size;
    private Pageable pageable;

    public GetAllRoomsQuery(int page, int size) {
        this.page = page;
        this.size = size;
        this.pageable = PageRequest.of(page, size);
    }

    public GetAllRoomsQuery(Pageable pageable) {
        this.pageable = pageable;
        this.page = pageable.getPageNumber();
        this.size = pageable.getPageSize();
    }
}

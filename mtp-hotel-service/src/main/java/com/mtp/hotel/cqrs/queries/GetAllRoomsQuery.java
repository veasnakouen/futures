package com.mtp.hotel.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetAllRoomsQuery {
    private int page;
    private int size;
}

package com.mtp.hotel.cqrs.queries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetHousekeepingTaskByIdQuery {
    private Integer id;
}

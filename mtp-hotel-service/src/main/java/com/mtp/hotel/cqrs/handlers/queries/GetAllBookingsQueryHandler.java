package com.mtp.hotel.cqrs.handlers.queries;

import com.mtp.hotel.cqrs.dto.BookingQueryResultDto;
import com.mtp.hotel.cqrs.mappers.BookingMapper;
import com.mtp.hotel.cqrs.queries.GetAllBookingsQuery;
import com.mtp.hotel.repositories.BookingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllBookingsQueryHandler {

    private final BookingRepository repository;
    private final BookingMapper mapper;

    public Page<BookingQueryResultDto> handle(GetAllBookingsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}

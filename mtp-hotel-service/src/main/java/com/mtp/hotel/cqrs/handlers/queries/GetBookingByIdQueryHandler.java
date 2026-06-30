package com.mtp.hotel.cqrs.handlers.queries;

import com.mtp.hotel.cqrs.dto.BookingQueryResultDto;
import com.mtp.hotel.cqrs.mappers.BookingMapper;
import com.mtp.hotel.cqrs.queries.GetBookingByIdQuery;
import com.mtp.hotel.repositories.BookingRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetBookingByIdQueryHandler {

    private final BookingRepository repository;
    private final BookingMapper mapper;

    public Optional<BookingQueryResultDto> handle(GetBookingByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}

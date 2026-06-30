package com.mtp.hotel.cqrs.handlers.queries;

import com.mtp.hotel.cqrs.dto.GuestQueryResultDto;
import com.mtp.hotel.cqrs.mappers.GuestMapper;
import com.mtp.hotel.cqrs.queries.GetGuestByIdQuery;
import com.mtp.hotel.repositories.GuestRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetGuestByIdQueryHandler {

    private final GuestRepository repository;
    private final GuestMapper mapper;

    public Optional<GuestQueryResultDto> handle(GetGuestByIdQuery query) {
        return repository.findById(query.getId())
                .map(mapper::toDto);
    }
}

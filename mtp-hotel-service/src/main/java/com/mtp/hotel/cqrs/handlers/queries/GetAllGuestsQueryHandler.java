package com.mtp.hotel.cqrs.handlers.queries;

import com.mtp.hotel.cqrs.dto.GuestQueryResultDto;
import com.mtp.hotel.cqrs.mappers.GuestMapper;
import com.mtp.hotel.cqrs.queries.GetAllGuestsQuery;
import com.mtp.hotel.repositories.GuestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllGuestsQueryHandler {

    private final GuestRepository repository;
    private final GuestMapper mapper;

    public Page<GuestQueryResultDto> handle(GetAllGuestsQuery query) {
        return repository.findAll(PageRequest.of(query.getPage(), query.getSize()))
                .map(mapper::toDto);
    }
}

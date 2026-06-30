package com.mtp.stock.cqrs.handlers.queries;

import com.mtp.stock.cqrs.dto.AssetQueryResultDto;
import com.mtp.stock.cqrs.mappers.AssetMapper;
import com.mtp.stock.cqrs.queries.GetAllAssetsQuery;
import com.mtp.stock.repositories.AssetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllAssetsQueryHandler {

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;

    public Page<AssetQueryResultDto> handle(GetAllAssetsQuery query) {
        Pageable pageable = PageRequest.of(query.getPage(), query.getSize());
        return assetRepository.findAll(pageable).map(assetMapper::toDto);
    }
}

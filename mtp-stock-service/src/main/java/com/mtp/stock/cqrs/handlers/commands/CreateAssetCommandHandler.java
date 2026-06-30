package com.mtp.stock.cqrs.handlers.commands;

import com.mtp.stock.cqrs.commands.CreateAssetCommand;
import com.mtp.stock.cqrs.dto.AssetQueryResultDto;
import com.mtp.stock.cqrs.mappers.AssetMapper;
import com.mtp.stock.models.CompanyAsset;
import com.mtp.stock.repositories.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CreateAssetCommandHandler {

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;

    @Transactional
    public AssetQueryResultDto handle(CreateAssetCommand command) {
        CompanyAsset entity = assetMapper.toEntity(command);
        CompanyAsset savedEntity = assetRepository.save(entity);
        return assetMapper.toDto(savedEntity);
    }
}

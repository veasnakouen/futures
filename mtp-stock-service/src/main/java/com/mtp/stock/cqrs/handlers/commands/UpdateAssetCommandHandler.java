package com.mtp.stock.cqrs.handlers.commands;

import com.mtp.stock.cqrs.commands.UpdateAssetCommand;
import com.mtp.stock.cqrs.dto.AssetQueryResultDto;
import com.mtp.stock.cqrs.mappers.AssetMapper;
import com.mtp.stock.repositories.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateAssetCommandHandler {

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;

    @Transactional
    public Optional<AssetQueryResultDto> handle(UpdateAssetCommand command) {
        return assetRepository.findById(command.getId()).map(asset -> {
            asset.setName(command.getName());
            asset.setSerialNumber(command.getSerialNumber());
            asset.setAssetType(command.getAssetType());
            asset.setStatus(command.getStatus());
            asset.setImageUrl(command.getImageUrl());
            
            return assetMapper.toDto(assetRepository.save(asset));
        });
    }
}

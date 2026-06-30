package com.mtp.stock.cqrs.handlers.commands;

import com.mtp.stock.cqrs.commands.ReturnAssetCommand;
import com.mtp.stock.cqrs.dto.AssetQueryResultDto;
import com.mtp.stock.cqrs.mappers.AssetMapper;
import com.mtp.stock.repositories.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReturnAssetCommandHandler {

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;

    @Transactional
    public Optional<AssetQueryResultDto> handle(ReturnAssetCommand command) {
        return assetRepository.findById(command.getAssetId()).map(asset -> {
            asset.setEmployee(null);
            asset.setStatus("Available");
            asset.setAssignedDate(null);
            return assetMapper.toDto(assetRepository.save(asset));
        });
    }
}

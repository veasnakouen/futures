package com.mtp.stock.cqrs.handlers.commands;

import com.mtp.stock.cqrs.commands.DeleteAssetCommand;
import com.mtp.stock.repositories.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteAssetCommandHandler {

    private final AssetRepository assetRepository;

    @Transactional
    public void handle(DeleteAssetCommand command) {
        assetRepository.findById(command.getId()).ifPresent(assetRepository::delete);
    }
}

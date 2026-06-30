package com.mtp.stock.cqrs.handlers.commands;

import com.mtp.stock.cqrs.commands.AssignAssetCommand;
import com.mtp.stock.cqrs.dto.AssetQueryResultDto;
import com.mtp.stock.cqrs.mappers.AssetMapper;
import com.mtp.stock.repositories.AssetRepository;
import com.mtp.stock.repositories.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignAssetCommandHandler {

    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;
    private final AssetMapper assetMapper;

    @Transactional
    public Optional<AssetQueryResultDto> handle(AssignAssetCommand command) {
        var empOpt = employeeRepository.findById(command.getEmployeeId());
        if (empOpt.isEmpty()) {
            throw new IllegalArgumentException("Employee not found");
        }

        return assetRepository.findById(command.getAssetId()).map(asset -> {
            asset.setEmployee(empOpt.get());
            asset.setStatus("Assigned");
            asset.setAssignedDate(LocalDateTime.now());
            return assetMapper.toDto(assetRepository.save(asset));
        });
    }
}

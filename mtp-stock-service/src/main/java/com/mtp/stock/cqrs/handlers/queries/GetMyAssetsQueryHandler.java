package com.mtp.stock.cqrs.handlers.queries;

import com.mtp.stock.cqrs.dto.AssetQueryResultDto;
import com.mtp.stock.cqrs.mappers.AssetMapper;
import com.mtp.stock.cqrs.queries.GetMyAssetsQuery;
import com.mtp.stock.repositories.AssetRepository;
import com.mtp.stock.repositories.EmployeeRepository;
import com.mtp.stock.models.stubs.EmployeeStub;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetMyAssetsQueryHandler {

    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;
    private final AssetMapper assetMapper;

    public List<AssetQueryResultDto> handle(GetMyAssetsQuery query) {
        Optional<EmployeeStub> empOpt = employeeRepository.findByEmailIgnoreCase(query.getEmail())
                .or(() -> employeeRepository.findByEmailIgnoreCase(query.getUsername()));

        if (empOpt.isEmpty()) {
            // Fallback: search assets assigned to employee ID 1 or return empty list
            return assetRepository.findCompanyAssetsByEmployeeId(1).stream()
                    .map(assetMapper::toDto)
                    .collect(Collectors.toList());
        }

        return assetRepository.findCompanyAssetsByEmployeeId(empOpt.get().getId()).stream()
                .map(assetMapper::toDto)
                .collect(Collectors.toList());
    }
}

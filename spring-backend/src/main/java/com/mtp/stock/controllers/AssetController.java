package com.mtp.stock.controllers;

import com.mtp.stock.cqrs.commands.*;
import com.mtp.stock.cqrs.dto.AssetQueryResultDto;
import com.mtp.stock.cqrs.handlers.commands.*;
import com.mtp.stock.cqrs.handlers.queries.*;
import com.mtp.stock.cqrs.queries.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/stock/hr/assets")
@RequiredArgsConstructor
public class AssetController {

    private final CreateAssetCommandHandler createAssetCommandHandler;
    private final UpdateAssetCommandHandler updateAssetCommandHandler;
    private final DeleteAssetCommandHandler deleteAssetCommandHandler;
    private final AssignAssetCommandHandler assignAssetCommandHandler;
    private final ReturnAssetCommandHandler returnAssetCommandHandler;
    
    private final GetAllAssetsQueryHandler getAllAssetsQueryHandler;
    private final GetMyAssetsQueryHandler getMyAssetsQueryHandler;

    @GetMapping("/me")
    public ResponseEntity<List<AssetQueryResultDto>> getMyAssets() {
        String username = "admin"; // TODO: read from gateway headers
        // Assuming email is the same for now, or extracted from token
        GetMyAssetsQuery query = new GetMyAssetsQuery(username, username);
        return ResponseEntity.ok(getMyAssetsQueryHandler.handle(query));
    }

    private static final java.util.Set<String> ALLOWED_SORT_FIELDS = java.util.Set.of("id", "name", "serialNumber", "assetType", "status", "vendor", "purchaseDate", "createdAt");

    @GetMapping
    public ResponseEntity<com.mtp.api.dto.ApiResponse<com.mtp.api.dto.pagination.PagedResponse<AssetQueryResultDto>>> getAll(
            @jakarta.validation.Valid @ModelAttribute com.mtp.api.dto.pagination.PaginationRequest request) {
        Pageable pageable = request.toPageable(ALLOWED_SORT_FIELDS);
        Page<AssetQueryResultDto> pageResult = getAllAssetsQueryHandler.handle(new GetAllAssetsQuery(pageable));
        com.mtp.api.dto.pagination.PagedResponse<AssetQueryResultDto> response = com.mtp.api.dto.pagination.PagedResponse.from(pageResult, request.getSortBy(), request.getSortOrder());
        return ResponseEntity.ok(com.mtp.api.dto.ApiResponse.success("Assets fetched successfully", response));
    }

    @PostMapping
    public AssetQueryResultDto create(@jakarta.validation.Valid @RequestBody CreateAssetCommand command) {
        return createAssetCommandHandler.handle(command);
    }

    @PostMapping("/{assetId}/assign/{employeeId}")
    public ResponseEntity<?> assignAsset(@PathVariable Integer assetId, @PathVariable Integer employeeId) {
        try {
            AssignAssetCommand command = new AssignAssetCommand(assetId, employeeId);
            return assignAssetCommandHandler.handle(command)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{assetId}/return")
    public ResponseEntity<?> returnAsset(@PathVariable Integer assetId) {
        ReturnAssetCommand command = new ReturnAssetCommand(assetId);
        return returnAssetCommandHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetQueryResultDto> update(@PathVariable Integer id,
            @jakarta.validation.Valid @RequestBody UpdateAssetCommand command) {
        command.setId(id);
        return updateAssetCommandHandler.handle(command)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        DeleteAssetCommand command = new DeleteAssetCommand(id);
        deleteAssetCommandHandler.handle(command);
        return ResponseEntity.ok().build();
    }
}

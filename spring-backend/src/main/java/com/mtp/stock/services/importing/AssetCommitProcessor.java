package com.mtp.stock.services.importing;

import com.mtp.stock.models.AssetInventoryImport;
import com.mtp.stock.models.CompanyAsset;
import com.mtp.stock.repositories.AssetInventoryImportRepository;
import com.mtp.stock.repositories.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class AssetCommitProcessor {

    private final AssetInventoryImportRepository importRepository;
    private final AssetRepository assetRepository;
    private final PlatformTransactionManager transactionManager;

    public int commitBatch(String sheetName) {
        List<AssetInventoryImport> stagingData;
        if (sheetName == null || sheetName.equalsIgnoreCase("all") || sheetName.trim().isEmpty()) {
            stagingData = importRepository.findAll();
            log.info("Commit All requested. Total records in staging: {}", stagingData.size());
        } else {
            stagingData = importRepository.findBySheetName(sheetName);
            log.info("Commit for sheet '{}' requested. Found: {}", sheetName, stagingData.size());
        }
        if (stagingData.isEmpty())
            return 0;

        int committedCount = 0;
        int batchSize = 500;
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);

        for (int i = 0; i < stagingData.size(); i += batchSize) {
            int end = Math.min(i + batchSize, stagingData.size());
            List<AssetInventoryImport> batch = stagingData.subList(i, end);

            final int startIdx = i;
            final int endIdx = end;
            try {
                Boolean success = transactionTemplate.execute(status -> {
                    try {
                        List<CompanyAsset> assetsToSave = new ArrayList<>();
                        for (AssetInventoryImport s : batch) {
                            CompanyAsset asset = new CompanyAsset();
                            String description = s.getDescription();
                            if (description == null || description.trim().isEmpty()) {
                                description = "Imported Item ("
                                        + (s.getAssetCode() != null ? s.getAssetCode() : "No Code") + ")";
                            }
                            asset.setName(description);
                            String sn = s.getAssetCode();
                            if (sn == null || sn.trim().isEmpty()) {
                                sn = "SN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                            }
                            asset.setSerialNumber(sn);
                            asset.setAssetType(s.getCategory() != null ? s.getCategory().getName() : "Other");
                            asset.setStatus("Available");
                            assetsToSave.add(asset);
                        }
                        assetRepository.saveAll(assetsToSave);
                        importRepository.deleteAll(batch);
                        return true;
                    } catch (Exception e) {
                        status.setRollbackOnly();
                        log.error("Batch commit failed for range {}-{}: {}", startIdx, endIdx, e.getMessage());
                        return false;
                    }
                });

                if (success != null && success) {
                    committedCount += batch.size();
                } else {
                    log.warn("Falling back to individual commit for batch {}-{} due to error", i, end);
                    for (AssetInventoryImport s : batch) {
                        try {
                            transactionTemplate.execute(status -> {
                                CompanyAsset asset = new CompanyAsset();
                                asset.setName(s.getDescription() != null ? s.getDescription() : "Imported Item");
                                asset.setSerialNumber(s.getAssetCode() != null ? s.getAssetCode()
                                        : "SN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                                asset.setAssetType(s.getCategory() != null ? s.getCategory().getName() : "Other");
                                asset.setStatus("Available");
                                assetRepository.save(asset);
                                importRepository.delete(s);
                                return true;
                            });
                            committedCount++;
                        } catch (Exception e) {
                            log.error("Individual commit failed for ID {}: {}", s.getId(), e.getMessage());
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Critical failure in batch commit {}-{}: {}", i, end, e.getMessage());
            }
        }
        return committedCount;
    }
}

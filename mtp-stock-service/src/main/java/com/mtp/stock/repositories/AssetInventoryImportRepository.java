package com.mtp.stock.repositories;

import com.mtp.stock.models.AssetInventoryImport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssetInventoryImportRepository extends JpaRepository<AssetInventoryImport, Long> {
    List<AssetInventoryImport> findByStatus(String status);
    List<AssetInventoryImport> findBySheetName(String sheetName);
    List<AssetInventoryImport> findByAssetCode(String assetCode);

    @org.springframework.data.jpa.repository.Query("SELECT new com.mtp.stock.dto.ImportSummaryDto(a.sheetName, COUNT(a), a.targetType, MAX(a.importDate)) " +
           "FROM AssetInventoryImport a GROUP BY a.sheetName, a.targetType")
    List<com.mtp.stock.dto.ImportSummaryDto> getSummary();
}

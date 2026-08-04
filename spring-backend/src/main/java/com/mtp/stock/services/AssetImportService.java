package com.mtp.stock.services;

import com.mtp.stock.dto.AssetImportDto;
import com.mtp.stock.dto.ImportProgress;
import com.mtp.stock.dto.ImportSummaryDto;
import com.mtp.stock.repositories.AssetInventoryImportRepository;
import com.mtp.stock.services.importing.AssetCommitProcessor;
import com.mtp.stock.services.importing.AssetStagingProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class AssetImportService {

    private final AssetInventoryImportRepository importRepository;
    private final AssetStagingProcessor stagingProcessor;
    private final AssetCommitProcessor commitProcessor;

    private final Map<String, ImportProgress> progressMap = new ConcurrentHashMap<>();

    public ImportProgress getProgress(String jobId) {
        ImportProgress progress = progressMap.getOrDefault(jobId, new ImportProgress(0, 0, "NOT_FOUND", "No job found", true, 0));
        if (progress != null && progress.isCompleted() && !"NOT_FOUND".equals(progress.getStatus())) {
            progressMap.remove(jobId);
        }
        return progress;
    }

    public String startImportAsync(MultipartFile file) throws IOException {
        String jobId = UUID.randomUUID().toString();
        byte[] bytes = file.getBytes();
        String filename = file.getOriginalFilename();

        progressMap.put(jobId, new ImportProgress(0, 0, "PENDING", "Initializing background job...", false, 0));
        this.runImportAsync(jobId, bytes, filename);
        return jobId;
    }

    @Async
    public void runImportAsync(String jobId, byte[] bytes, String filename) {
        ImportProgress progress = progressMap.get(jobId);
        try {
            stagingProcessor.processAsyncImport(bytes, filename, progress);
        } catch (Exception e) {
            log.error("Async Import Failed for job {}: {}", jobId, e.getMessage());
            progress.setStatus("FAILED");
            progress.setCompleted(true);
            progress.setMessage("Failure: " + e.getMessage());
        }
    }

    @Transactional
    public int saveBatch(List<AssetImportDto> items) {
        return stagingProcessor.saveBatch(items);
    }

    @Transactional
    public void clearStagingTable() {
        importRepository.deleteAll();
        log.info("Asset staging table has been cleared.");
    }

    public List<ImportSummaryDto> getImportSummary() {
        return importRepository.getSummary();
    }

    public int commitBatch(String sheetName) {
        return commitProcessor.commitBatch(sheetName);
    }
}

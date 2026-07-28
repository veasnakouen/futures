package com.mtp.stock.services;

import com.mtp.stock.models.*;
import com.mtp.stock.models.stubs.*;
import com.mtp.stock.dto.AssetImportDto;
import com.mtp.stock.dto.ImportSummaryDto;
import com.mtp.stock.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.concurrent.ConcurrentHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.scheduling.annotation.Async;
import com.mtp.stock.dto.ImportProgress;

@Service
@Slf4j
@RequiredArgsConstructor
public class AssetImportService {

    private final AssetInventoryImportRepository importRepository;
    private final CategoryRepository categoryRepository;
    private final AssetBrandRepository brandRepository;
    private final AssetSupplierRepository supplierRepository;
    private final AssetDonorRepository donorRepository;
    private final DepartmentRepository departmentRepository;
    private final AssetConditionRepository conditionRepository;
    private final AssetRepository assetRepository;
    private final InventoryRepository inventoryRepository;
    private final org.springframework.transaction.PlatformTransactionManager transactionManager;
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

        // Start the async process
        this.runImportAsync(jobId, bytes, filename);

        return jobId;
    }

    @Async
    public void runImportAsync(String jobId, byte[] bytes, String filename) {
        ImportProgress progress = progressMap.get(jobId);
        try (InputStream is = new java.io.ByteArrayInputStream(bytes);
                org.apache.poi.ss.usermodel.Workbook workbook = org.apache.poi.ss.usermodel.WorkbookFactory
                        .create(is)) {

            progress.setStatus("PROCESSING");
            progress.setMessage("Reading workbook structure...");

            int totalRows = 0;
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                totalRows += workbook.getSheetAt(i).getLastRowNum();
            }
            progress.setTotal(totalRows);

            int totalImported = 0;
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(i);
                String sheetName = sheet.getSheetName();

                List<AssetInventoryImport> imports = new ArrayList<>();

                // Caches...
                java.util.Map<String, Category> categoryCache = categoryRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(Category::getName, c -> c, (a, b) -> a));
                java.util.Map<String, AssetBrand> brandCache = brandRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetBrand::getName, b -> b, (a, b) -> a));
                java.util.Map<String, AssetCondition> conditionCache = conditionRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetCondition::getName, c -> c, (a, b) -> a));
                java.util.Map<String, AssetDonor> donorCache = donorRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetDonor::getName, d -> d, (a, b) -> a));
                java.util.Map<String, AssetSupplier> supplierCache = supplierRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetSupplier::getName, s -> s, (a, b) -> a));
                java.util.Map<String, DepartmentStub> departmentCache = departmentRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(DepartmentStub::getName, d -> d, (a, b) -> a));

                for (org.apache.poi.ss.usermodel.Row row : sheet) {
                    if (row.getRowNum() == 0)
                        continue;

                    try {
                        AssetInventoryImport assetImport = new AssetInventoryImport();
                        assetImport.setSheetName(sheetName);
                        assetImport.setImportDate(LocalDateTime.now());
                        assetImport.setStatus("Pending");

                        assetImport.setAssetCode(getCellValueAsString(row.getCell(0)));
                        assetImport.setDescription(getCellValueAsString(row.getCell(1)));

                        // Category
                        String categoryName = getCellValueAsString(row.getCell(2));
                        if (categoryName != null && !categoryName.trim().isEmpty()) {
                            assetImport.setCategory(categoryCache.computeIfAbsent(categoryName.trim(),
                                    name -> categoryRepository.save(new Category(null, name))));
                        }

                        // Brand
                        String brandName = getCellValueAsString(row.getCell(3));
                        if (brandName != null && !brandName.trim().isEmpty()) {
                            assetImport.setBrand(brandCache.computeIfAbsent(brandName.trim(),
                                    name -> brandRepository.save(new AssetBrand(null, name))));
                        }

                        assetImport.setModel(getCellValueAsString(row.getCell(4)));
                        assetImport.setSerialNumber(getCellValueAsString(row.getCell(5)));
                        assetImport.setSpecifications(getCellValueAsString(row.getCell(6)));

                        String qtyStr = getCellValueAsString(row.getCell(7));
                        if (qtyStr != null && !qtyStr.isEmpty()) {
                            try {
                                assetImport.setQuantity((int) Double.parseDouble(qtyStr));
                            } catch (Exception e) {
                            }
                        }

                        String priceStr = getCellValueAsString(row.getCell(8));
                        if (priceStr != null && !priceStr.isEmpty()) {
                            try {
                                assetImport.setUnitPrice(Double.parseDouble(priceStr));
                            } catch (Exception e) {
                            }
                        }

                        String conditionName = getCellValueAsString(row.getCell(9));
                        if (conditionName != null && !conditionName.trim().isEmpty()) {
                            assetImport.setCondition(conditionCache.computeIfAbsent(conditionName.trim(),
                                    name -> conditionRepository.save(new AssetCondition(null, name))));
                        }

                        String supplierName = getCellValueAsString(row.getCell(10));
                        if (supplierName != null && !supplierName.trim().isEmpty()) {
                            assetImport.setSupplier(supplierCache.computeIfAbsent(supplierName.trim(),
                                    name -> supplierRepository.save(new AssetSupplier(null, name, null))));
                        }

                        String donorName = getCellValueAsString(row.getCell(11));
                        if (donorName != null && !donorName.trim().isEmpty()) {
                            assetImport.setDonor(donorCache.computeIfAbsent(donorName.trim(),
                                    name -> donorRepository.save(new AssetDonor(null, name))));
                        }

                        String deptName = getCellValueAsString(row.getCell(12));
                        if (deptName != null && !deptName.trim().isEmpty()) {
                            assetImport.setDepartment(departmentCache.computeIfAbsent(deptName.trim(),
                                    name -> {
                                        DepartmentStub dept = new DepartmentStub();
                                        dept.setName(name);
                                        return departmentRepository.save(dept);
                                    }));
                        }

                        if (assetImport.getDescription() != null && !assetImport.getDescription().isEmpty()) {
                            assetImport.setTargetType("ASSET");
                            imports.add(assetImport);
                        }
                    } catch (Exception e) {
                        progress.setErrorCount(progress.getErrorCount() + 1);
                    }

                    if (imports.size() >= 100) {
                        importRepository.saveAll(imports);
                        totalImported += imports.size();
                        progress.setProcessed(totalImported);
                        progress.setMessage("Importing sheet: " + sheetName);
                        imports.clear();
                    }
                }

                if (!imports.isEmpty()) {
                    importRepository.saveAll(imports);
                    totalImported += imports.size();
                    progress.setProcessed(totalImported);
                    imports.clear();
                }
            }
            progress.setStatus("COMPLETED");
            progress.setCompleted(true);
            progress.setMessage("Successfully processed " + totalImported + " records.");
        } catch (Exception e) {
            log.error("Async Import Failed for job {}: {}", jobId, e.getMessage());
            progress.setStatus("FAILED");
            progress.setCompleted(true);
            progress.setMessage("Failure: " + e.getMessage());
        }
    }

    @Transactional
    public int importFromExcel(MultipartFile file) throws IOException {
        int totalImported = 0;
        try (InputStream is = file.getInputStream();
                org.apache.poi.ss.usermodel.Workbook workbook = org.apache.poi.ss.usermodel.WorkbookFactory
                        .create(is)) {

            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(i);
                String sheetName = sheet.getSheetName();
                log.info("Processing sheet: {}", sheetName);

                List<AssetInventoryImport> imports = new ArrayList<>();

                // Cache reference data to avoid repeated DB lookups
                java.util.Map<String, Category> categoryCache = categoryRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(Category::getName, c -> c, (a, b) -> a));
                java.util.Map<String, AssetBrand> brandCache = brandRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetBrand::getName, b -> b, (a, b) -> a));
                java.util.Map<String, AssetCondition> conditionCache = conditionRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetCondition::getName, c -> c, (a, b) -> a));
                java.util.Map<String, AssetDonor> donorCache = donorRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetDonor::getName, d -> d, (a, b) -> a));
                java.util.Map<String, AssetSupplier> supplierCache = supplierRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetSupplier::getName, s -> s, (a, b) -> a));
                java.util.Map<String, DepartmentStub> departmentCache = departmentRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(DepartmentStub::getName, d -> d, (a, b) -> a));

                for (org.apache.poi.ss.usermodel.Row row : sheet) {
                    if (row.getRowNum() == 0)
                        continue; // Skip header row

                    AssetInventoryImport assetImport = new AssetInventoryImport();
                    assetImport.setSheetName(sheetName);
                    assetImport.setImportDate(LocalDateTime.now());
                    assetImport.setStatus("Pending");

                    try {
                        assetImport.setAssetCode(getCellValueAsString(row.getCell(0)));
                        assetImport.setDescription(getCellValueAsString(row.getCell(1)));

                        // Map Normalized Relationships using cache
                        String categoryName = getCellValueAsString(row.getCell(2));
                        if (categoryName != null && !categoryName.trim().isEmpty()) {
                            assetImport.setCategory(categoryCache.computeIfAbsent(categoryName.trim(),
                                    name -> categoryRepository.save(new Category(null, name))));
                        }

                        String brandName = getCellValueAsString(row.getCell(3));
                        if (brandName != null && !brandName.trim().isEmpty()) {
                            assetImport.setBrand(brandCache.computeIfAbsent(brandName.trim(),
                                    name -> brandRepository.save(new AssetBrand(null, name))));
                        }

                        assetImport.setModel(getCellValueAsString(row.getCell(4)));
                        assetImport.setSerialNumber(getCellValueAsString(row.getCell(5)));
                        assetImport.setSpecifications(getCellValueAsString(row.getCell(6)));

                        String qtyStr = getCellValueAsString(row.getCell(7));
                        if (qtyStr != null && !qtyStr.isEmpty()) {
                            try {
                                assetImport.setQuantity((int) Double.parseDouble(qtyStr));
                            } catch (Exception e) {
                            }
                        }

                        String priceStr = getCellValueAsString(row.getCell(8));
                        if (priceStr != null && !priceStr.isEmpty()) {
                            try {
                                assetImport.setUnitPrice(Double.parseDouble(priceStr));
                            } catch (Exception e) {
                            }
                        }

                        String conditionName = getCellValueAsString(row.getCell(9));
                        if (conditionName != null && !conditionName.trim().isEmpty()) {
                            assetImport.setCondition(conditionCache.computeIfAbsent(conditionName.trim(),
                                    name -> conditionRepository.save(new AssetCondition(null, name))));
                        }

                        String supplierName = getCellValueAsString(row.getCell(10));
                        if (supplierName != null && !supplierName.trim().isEmpty()) {
                            assetImport.setSupplier(supplierCache.computeIfAbsent(supplierName.trim(),
                                    name -> supplierRepository.save(new AssetSupplier(null, name, null))));
                        }

                        String donorName = getCellValueAsString(row.getCell(11));
                        if (donorName != null && !donorName.trim().isEmpty()) {
                            assetImport.setDonor(donorCache.computeIfAbsent(donorName.trim(),
                                    name -> donorRepository.save(new AssetDonor(null, name))));
                        }

                        String deptName = getCellValueAsString(row.getCell(12));
                        if (deptName != null && !deptName.trim().isEmpty()) {
                            assetImport.setDepartment(departmentCache.computeIfAbsent(deptName.trim(),
                                    name -> {
                                        DepartmentStub dept = new DepartmentStub();
                                        dept.setName(name);
                                        return departmentRepository.save(dept);
                                    }));
                        }

                        if (assetImport.getDescription() != null && !assetImport.getDescription().isEmpty()) {
                            assetImport.setTargetType(
                                    detectTargetType(assetImport.getAssetCode(), assetImport.getUnitPrice()));
                            imports.add(assetImport);
                        }
                    } catch (Exception e) {
                        log.error("Error parsing row {} in sheet {}: {}", row.getRowNum(), sheetName, e.getMessage());
                    }

                    if (imports.size() >= 100) { // Increased batch size
                        importRepository.saveAll(imports);
                        totalImported += imports.size();
                        imports.clear();
                    }
                }

                if (!imports.isEmpty()) {
                    importRepository.saveAll(imports);
                    totalImported += imports.size();
                    imports.clear();
                }
            }
        }
        return totalImported;
    }

    @Transactional
    public int saveBatch(List<AssetImportDto> items) {
        // In-memory caches for the current batch to prevent unique constraint
        // violations
        java.util.Map<String, Category> categoryCache = new java.util.HashMap<>();
        java.util.Map<String, AssetBrand> brandCache = new java.util.HashMap<>();
        java.util.Map<String, AssetSupplier> supplierCache = new java.util.HashMap<>();
        java.util.Map<String, AssetCondition> conditionCache = new java.util.HashMap<>();
        java.util.Map<String, AssetDonor> donorCache = new java.util.HashMap<>();
        java.util.Map<String, DepartmentStub> departmentCache = new java.util.HashMap<>();

        List<AssetInventoryImport> imports = items.stream().map(dto -> {
            AssetInventoryImport entity = new AssetInventoryImport();
            entity.setAssetCode(dto.getAssetCode());
            entity.setDescription(dto.getDescription());

            if (dto.getCategory() != null && !dto.getCategory().trim().isEmpty()) {
                String name = dto.getCategory().trim();
                entity.setCategory(categoryCache.computeIfAbsent(name, n -> {
                    // Safety: Only link if exists. Prevent session crashes.
                    return categoryRepository.findByName(n).orElse(null);
                }));
            }

            if (dto.getBrand() != null && !dto.getBrand().trim().isEmpty()) {
                String name = dto.getBrand().trim();
                entity.setBrand(brandCache.computeIfAbsent(name, n -> {
                    // Safety: Only link if exists. Prevent session crashes.
                    return brandRepository.findByName(n).orElse(null);
                }));
            }

            entity.setModel(dto.getModel());
            entity.setSerialNumber(dto.getSerialNumber());
            entity.setSpecifications(dto.getSpecifications());
            entity.setQuantity(dto.getQuantity());
            entity.setUnitPrice(dto.getUnitPrice());
            entity.setTotalPrice(dto.getTotalPrice());

            if (dto.getItemCondition() != null && !dto.getItemCondition().trim().isEmpty()) {
                String name = dto.getItemCondition().trim();
                entity.setCondition(conditionCache.computeIfAbsent(name, n -> {
                    AssetCondition cond = conditionRepository.findByName(n).orElse(null);
                    if (cond == null) {
                        cond = conditionRepository.saveAndFlush(new AssetCondition(null, n));
                    }
                    return cond;
                }));
            }

            entity.setLocation(dto.getLocation());
            entity.setAssignedTo(dto.getAssignedTo());
            entity.setPurchaseDate(dto.getPurchaseDate());

            if (dto.getSupplier() != null && !dto.getSupplier().trim().isEmpty()) {
                String name = dto.getSupplier().trim();
                entity.setSupplier(supplierCache.computeIfAbsent(name, n -> {
                    // ONLY link if it already exists.
                    // DO NOT try to create new suppliers during the batch to avoid session crashes.
                    return supplierRepository.findByName(n).orElse(null);
                }));
            }

            entity.setRemarks(dto.getRemarks());
            entity.setSheetName(dto.getSheetName());
            entity.setTargetType(dto.getTargetType() != null ? dto.getTargetType()
                    : detectTargetType(dto.getAssetCode(), dto.getUnitPrice()));
            return entity;
        }).collect(Collectors.toList());

        importRepository.saveAll(imports);
        return imports.size();
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
        List<AssetInventoryImport> stagingData;
        if (sheetName == null || sheetName.equalsIgnoreCase("all") || sheetName.trim().isEmpty()) {
            stagingData = importRepository.findAll();
            log.info("Commit All requested. Total records in staging: {}", stagingData.size());
        } else {
            stagingData = importRepository.findBySheetName(sheetName);
            log.info("Commit for sheet '{}' requested. Found: {}", sheetName, stagingData.size());
        }
        log.info("Starting commit for sheet: {}. Found {} items in staging.", sheetName, stagingData.size());
        if (stagingData.isEmpty())
            return 0;

        int committedCount = 0;
        int batchSize = 500;
        org.springframework.transaction.support.TransactionTemplate transactionTemplate = new org.springframework.transaction.support.TransactionTemplate(
                transactionManager);

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
                                sn = "SN-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
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
                    // Fallback to individual processing if batch fails to identify problematic
                    // record
                    log.warn("Falling back to individual commit for batch {}-{} due to error", i, end);
                    for (AssetInventoryImport s : batch) {
                        try {
                            transactionTemplate.execute(status -> {
                                CompanyAsset asset = new CompanyAsset();
                                asset.setName(s.getDescription() != null ? s.getDescription() : "Imported Item");
                                asset.setSerialNumber(s.getAssetCode() != null ? s.getAssetCode()
                                        : "SN-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
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

    private String detectTargetType(String code, Double price) {
        // FORCE ALL TO ASSET for HR Inventory tab visibility per user request
        return "ASSET";
    }

    private String getCellValueAsString(org.apache.poi.ss.usermodel.Cell cell) {
        if (cell == null)
            return null;
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }
}

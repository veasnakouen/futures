package com.mtp.stock.services.importing;

import com.mtp.stock.dto.AssetImportDto;
import com.mtp.stock.dto.ImportProgress;
import com.mtp.stock.models.*;
import com.mtp.stock.models.stubs.*;
import com.mtp.stock.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class AssetStagingProcessor {

    private final AssetInventoryImportRepository importRepository;
    private final CategoryRepository categoryRepository;
    private final AssetBrandRepository brandRepository;
    private final AssetSupplierRepository supplierRepository;
    private final AssetDonorRepository donorRepository;
    private final DepartmentRepository departmentRepository;
    private final AssetConditionRepository conditionRepository;
    private final ExcelSheetParser parser;

    public void processAsyncImport(byte[] bytes, String filename, ImportProgress progress) throws Exception {
        try (InputStream is = new ByteArrayInputStream(bytes);
             Workbook workbook = WorkbookFactory.create(is)) {

            progress.setStatus("PROCESSING");
            progress.setMessage("Reading workbook structure...");

            int totalRows = 0;
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                totalRows += workbook.getSheetAt(i).getLastRowNum();
            }
            progress.setTotal(totalRows);

            int totalImported = 0;
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);
                String sheetName = sheet.getSheetName();

                List<AssetInventoryImport> imports = new ArrayList<>();

                Map<String, Category> categoryCache = categoryRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(Category::getName, c -> c, (a, b) -> a));
                Map<String, AssetBrand> brandCache = brandRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetBrand::getName, b -> b, (a, b) -> a));
                Map<String, AssetCondition> conditionCache = conditionRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetCondition::getName, c -> c, (a, b) -> a));
                Map<String, AssetDonor> donorCache = donorRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetDonor::getName, d -> d, (a, b) -> a));
                Map<String, AssetSupplier> supplierCache = supplierRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(AssetSupplier::getName, s -> s, (a, b) -> a));
                Map<String, DepartmentStub> departmentCache = departmentRepository.findAll().stream()
                        .collect(java.util.stream.Collectors.toMap(DepartmentStub::getName, d -> d, (a, b) -> a));

                for (Row row : sheet) {
                    if (row.getRowNum() == 0)
                        continue;

                    try {
                        AssetInventoryImport assetImport = new AssetInventoryImport();
                        assetImport.setSheetName(sheetName);
                        assetImport.setImportDate(LocalDateTime.now());
                        assetImport.setStatus("Pending");

                        assetImport.setAssetCode(parser.getCellValueAsString(row.getCell(0)));
                        assetImport.setDescription(parser.getCellValueAsString(row.getCell(1)));

                        String categoryName = parser.getCellValueAsString(row.getCell(2));
                        if (categoryName != null && !categoryName.trim().isEmpty()) {
                            assetImport.setCategory(categoryCache.computeIfAbsent(categoryName.trim(),
                                    name -> categoryRepository.save(new Category(null, name))));
                        }

                        String brandName = parser.getCellValueAsString(row.getCell(3));
                        if (brandName != null && !brandName.trim().isEmpty()) {
                            assetImport.setBrand(brandCache.computeIfAbsent(brandName.trim(),
                                    name -> brandRepository.save(new AssetBrand(null, name))));
                        }

                        assetImport.setModel(parser.getCellValueAsString(row.getCell(4)));
                        assetImport.setSerialNumber(parser.getCellValueAsString(row.getCell(5)));
                        assetImport.setSpecifications(parser.getCellValueAsString(row.getCell(6)));

                        String qtyStr = parser.getCellValueAsString(row.getCell(7));
                        if (qtyStr != null && !qtyStr.isEmpty()) {
                            try {
                                assetImport.setQuantity((int) Double.parseDouble(qtyStr));
                            } catch (Exception ignored) {}
                        }

                        String priceStr = parser.getCellValueAsString(row.getCell(8));
                        if (priceStr != null && !priceStr.isEmpty()) {
                            try {
                                assetImport.setUnitPrice(Double.parseDouble(priceStr));
                            } catch (Exception ignored) {}
                        }

                        String conditionName = parser.getCellValueAsString(row.getCell(9));
                        if (conditionName != null && !conditionName.trim().isEmpty()) {
                            assetImport.setCondition(conditionCache.computeIfAbsent(conditionName.trim(),
                                    name -> conditionRepository.save(new AssetCondition(null, name))));
                        }

                        String supplierName = parser.getCellValueAsString(row.getCell(10));
                        if (supplierName != null && !supplierName.trim().isEmpty()) {
                            assetImport.setSupplier(supplierCache.computeIfAbsent(supplierName.trim(),
                                    name -> supplierRepository.save(new AssetSupplier(null, name, null))));
                        }

                        String donorName = parser.getCellValueAsString(row.getCell(11));
                        if (donorName != null && !donorName.trim().isEmpty()) {
                            assetImport.setDonor(donorCache.computeIfAbsent(donorName.trim(),
                                    name -> donorRepository.save(new AssetDonor(null, name))));
                        }

                        String deptName = parser.getCellValueAsString(row.getCell(12));
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
        }
    }

    public int saveBatch(List<AssetImportDto> items) {
        Map<String, Category> categoryCache = new HashMap<>();
        Map<String, AssetBrand> brandCache = new HashMap<>();
        Map<String, AssetSupplier> supplierCache = new HashMap<>();
        Map<String, AssetCondition> conditionCache = new HashMap<>();

        List<AssetInventoryImport> imports = items.stream().map(dto -> {
            AssetInventoryImport entity = new AssetInventoryImport();
            entity.setAssetCode(dto.getAssetCode());
            entity.setDescription(dto.getDescription());

            if (dto.getCategory() != null && !dto.getCategory().trim().isEmpty()) {
                String name = dto.getCategory().trim();
                entity.setCategory(categoryCache.computeIfAbsent(name, n -> categoryRepository.findByName(n).orElse(null)));
            }

            if (dto.getBrand() != null && !dto.getBrand().trim().isEmpty()) {
                String name = dto.getBrand().trim();
                entity.setBrand(brandCache.computeIfAbsent(name, n -> brandRepository.findByName(n).orElse(null)));
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
                entity.setSupplier(supplierCache.computeIfAbsent(name, n -> supplierRepository.findByName(n).orElse(null)));
            }

            entity.setRemarks(dto.getRemarks());
            entity.setSheetName(dto.getSheetName());
            entity.setTargetType(dto.getTargetType() != null ? dto.getTargetType() : parser.detectTargetType(dto.getAssetCode(), dto.getUnitPrice()));
            return entity;
        }).collect(java.util.stream.Collectors.toList());

        importRepository.saveAll(imports);
        return imports.size();
    }
}

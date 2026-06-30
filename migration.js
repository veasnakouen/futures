const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Download/FuturesSystem2023-Mar-22/spring-backend/src/main/java/com/mtp/api';
const destDir = 'd:/Download/FuturesSystem2023-Mar-22/mtp-stock-service/src/main/java/com/mtp/stock';

const filesToMove = [
    // Controllers
    'controllers/AssetController.java',
    'controllers/AssetImportController.java',
    'controllers/InventoryController.java',
    'controllers/InventoryTransactionController.java',
    // Services
    'services/AssetImportService.java',
    'services/InventoryTransactionService.java',
    // Repositories
    'repositories/AssetBrandRepository.java',
    'repositories/AssetConditionRepository.java',
    'repositories/AssetDonorRepository.java',
    'repositories/AssetInventoryImportRepository.java',
    'repositories/AssetRepository.java',
    'repositories/AssetSupplierRepository.java',
    'repositories/InventoryRepository.java',
    'repositories/InventoryTransactionRepository.java',
    // Models
    'models/AssetBrand.java',
    'models/AssetCondition.java',
    'models/AssetDonor.java',
    'models/AssetInventoryImport.java',
    'models/AssetSupplier.java',
    'models/CompanyAsset.java',
    'models/InventoryItem.java',
    'models/InventoryTransaction.java',
    // DTOs & Projections
    'dto/AssetImportDto.java',
    'projections/AssetProjection.java',
    // Enums
    'enums/InventoryTransactionType.java'
];

filesToMove.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    
    if (fs.existsSync(srcPath)) {
        // Ensure dest dir exists
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        
        let content = fs.readFileSync(srcPath, 'utf8');
        
        // Change package
        content = content.replace(/package com\.mtp\.api\./g, 'package com.mtp.stock.');
        
        // Change imports
        content = content.replace(/import com\.mtp\.api\./g, 'import com.mtp.stock.');
        
        // Change controller mappings to include /stock
        if (file.includes('controllers/')) {
            content = content.replace(/@RequestMapping\("?\/api\/([^"]*)"?\)/g, '@RequestMapping("/api/stock/$1")');
        }

        // Handle Employee cross-reference
        if (content.includes('Employee ')) {
            content = content.replace(/import com\.mtp\.stock\.models\.Employee;/g, 'import com.mtp.stock.models.stubs.EmployeeStub;');
            content = content.replace(/Employee employee;/g, 'EmployeeStub employee;');
            content = content.replace(/Employee getEmployee\(\);/g, 'EmployeeStub getEmployee();');
        }
        
        // Handle Department cross-reference
        if (content.includes('Department ')) {
            content = content.replace(/import com\.mtp\.stock\.models\.Department;/g, 'import com.mtp.stock.models.stubs.DepartmentStub;');
            content = content.replace(/Department department;/g, 'DepartmentStub department;');
            content = content.replace(/Department getDepartment\(\);/g, 'DepartmentStub getDepartment();');
        }

        fs.writeFileSync(destPath, content, 'utf8');
        
        // Delete original file
        fs.unlinkSync(srcPath);
        console.log('Moved and updated: ' + file);
    } else {
        console.warn('File not found: ' + srcPath);
    }
});

console.log('Migration complete!');

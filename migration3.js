const fs = require('fs');
const path = require('path');

const stockDir = 'd:/Download/FuturesSystem2023-Mar-22/mtp-stock-service/src/main/java/com/mtp/stock';

// 1. Add Cloudinary dependency
const buildGradlePath = 'd:/Download/FuturesSystem2023-Mar-22/mtp-stock-service/build.gradle';
let gradle = fs.readFileSync(buildGradlePath, 'utf8');
if (!gradle.includes('cloudinary-http5')) {
    gradle = gradle.replace('dependencies {', `dependencies {\n    implementation 'com.cloudinary:cloudinary-http5:2.1.0'`);
    fs.writeFileSync(buildGradlePath, gradle, 'utf8');
}

// 2. Create UserStub and UserRepository
const userStubDest = path.join(stockDir, 'models/stubs/UserStub.java');
fs.writeFileSync(userStubDest, `package com.mtp.stock.models.stubs;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String userName;
    private String email;
}
`);

const userRepoDest = path.join(stockDir, 'repositories/UserRepository.java');
fs.writeFileSync(userRepoDest, `package com.mtp.stock.repositories;
import com.mtp.stock.models.stubs.UserStub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserStub, String> {
    Optional<UserStub> findByUserName(String userName);
}
`);

// 3. Fix missing stub imports in Models
const modelsToFix = [
    'models/CompanyAsset.java',
    'models/AssetInventoryImport.java',
    'models/InventoryTransaction.java'
];

modelsToFix.forEach(m => {
    let p = path.join(stockDir, m);
    if(fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        if(!content.includes('import com.mtp.stock.models.stubs.')) {
            content = content.replace(/(import jakarta\.persistence\.\*;)/, '$1\nimport com.mtp.stock.models.stubs.*;\n');
            fs.writeFileSync(p, content, 'utf8');
        }
    }
});

// 4. Fix AssetController imports
const assetCtrlPath = path.join(stockDir, 'controllers/AssetController.java');
if(fs.existsSync(assetCtrlPath)) {
    let content = fs.readFileSync(assetCtrlPath, 'utf8');
    content = content.replace(/com\.mtp\.api\.repositories\.UserRepository/g, 'com.mtp.stock.repositories.UserRepository');
    content = content.replace(/com\.mtp\.api\.models\.User/g, 'com.mtp.stock.models.stubs.UserStub');
    content = content.replace(/com\.mtp\.api\.projections/g, 'com.mtp.stock.projections');
    content = content.replace(/com\.mtp\.api\.repositories/g, 'com.mtp.stock.repositories');
    fs.writeFileSync(assetCtrlPath, content, 'utf8');
}

// 5. Fix AssetRepository imports
const assetRepoPath = path.join(stockDir, 'repositories/AssetRepository.java');
if(fs.existsSync(assetRepoPath)) {
    let content = fs.readFileSync(assetRepoPath, 'utf8');
    content = content.replace(/com\.mtp\.api\.projections/g, 'com.mtp.stock.projections');
    fs.writeFileSync(assetRepoPath, content, 'utf8');
}

// 6. Fix AssetProjection
const assetProjPath = path.join(stockDir, 'projections/AssetProjection.java');
if(fs.existsSync(assetProjPath)) {
    let content = fs.readFileSync(assetProjPath, 'utf8');
    content = content.replace(/package com\.mtp\.api\.projections;/, 'package com.mtp.stock.projections;');
    content = content.replace(/import com\.mtp\.stock\.models\.Employee;/, 'import com.mtp.stock.models.stubs.EmployeeStub;');
    content = content.replace(/import com\.mtp\.stock\.models\.Department;/, 'import com.mtp.stock.models.stubs.DepartmentStub;');
    content = content.replace(/Employee getEmployee\(\);/, 'EmployeeStub getEmployee();');
    content = content.replace(/Department getDepartment\(\);/, 'DepartmentStub getDepartment();');
    fs.writeFileSync(assetProjPath, content, 'utf8');
}

// 7. Fix AssetInventoryImportRepository imports
const aiiRepoPath = path.join(stockDir, 'repositories/AssetInventoryImportRepository.java');
if(fs.existsSync(aiiRepoPath)) {
    let content = fs.readFileSync(aiiRepoPath, 'utf8');
    content = content.replace(/com\.mtp\.api\.dto/g, 'com.mtp.stock.dto');
    fs.writeFileSync(aiiRepoPath, content, 'utf8');
}

// 8. Fix InventoryController imageUploadService
const invCtrlPath = path.join(stockDir, 'controllers/InventoryController.java');
if(fs.existsSync(invCtrlPath)) {
    let content = fs.readFileSync(invCtrlPath, 'utf8');
    content = content.replace(/com\.mtp\.api\.services/g, 'com.mtp.stock.services');
    fs.writeFileSync(invCtrlPath, content, 'utf8');
}

console.log('Phase 3 Migration Fixes applied!');

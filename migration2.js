const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Download/FuturesSystem2023-Mar-22/spring-backend/src/main/java/com/mtp/api';
const destDir = 'd:/Download/FuturesSystem2023-Mar-22/mtp-stock-service/src/main/java/com/mtp/stock';

const filesToMove = [
    'dto/ImportSummaryDto.java',
    'dto/ImportProgress.java',
    'models/Category.java',
    'repositories/CategoryRepository.java'
];

filesToMove.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    if (fs.existsSync(srcPath)) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        let content = fs.readFileSync(srcPath, 'utf8');
        content = content.replace(/package com\.mtp\.api\./g, 'package com.mtp.stock.');
        content = content.replace(/import com\.mtp\.api\./g, 'import com.mtp.stock.');
        fs.writeFileSync(destPath, content, 'utf8');
        fs.unlinkSync(srcPath);
        console.log('Moved: ' + file);
    }
});

// Create Stub Repositories
const employeeRepoDest = path.join(destDir, 'repositories/EmployeeRepository.java');
fs.writeFileSync(employeeRepoDest, `package com.mtp.stock.repositories;
import com.mtp.stock.models.stubs.EmployeeStub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeStub, Long> {
}
`);

const deptRepoDest = path.join(destDir, 'repositories/DepartmentRepository.java');
fs.writeFileSync(deptRepoDest, `package com.mtp.stock.repositories;
import com.mtp.stock.models.stubs.DepartmentStub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentStub, Integer> {
}
`);

// Add POI to build.gradle
const buildGradlePath = 'd:/Download/FuturesSystem2023-Mar-22/mtp-stock-service/build.gradle';
let gradle = fs.readFileSync(buildGradlePath, 'utf8');
if (!gradle.includes('org.apache.poi')) {
    gradle = gradle.replace('dependencies {', `dependencies {
    implementation 'org.apache.poi:poi:5.2.3'
    implementation 'org.apache.poi:poi-ooxml:5.2.3'`);
    fs.writeFileSync(buildGradlePath, gradle, 'utf8');
    console.log('Added Apache POI to build.gradle');
}

// Fix missing ImageUploadService by creating a dummy one for now, or copy from monolith
const imgUploadSrc = path.join(srcDir, 'services/ImageUploadService.java');
const imgUploadDest = path.join(destDir, 'services/ImageUploadService.java');
if (fs.existsSync(imgUploadSrc)) {
    let content = fs.readFileSync(imgUploadSrc, 'utf8');
    content = content.replace(/package com\.mtp\.api\./g, 'package com.mtp.stock.');
    content = content.replace(/import com\.mtp\.api\./g, 'import com.mtp.stock.');
    fs.writeFileSync(imgUploadDest, content, 'utf8');
    // We DON'T delete it from monolith because monolith still uses it!
    console.log('Copied ImageUploadService');
}

console.log('Phase 2 Migration Complete!');

const fs = require('fs');
const path = require('path');

const stockDir = 'd:/Download/FuturesSystem2023-Mar-22/mtp-stock-service/src/main/java/com/mtp/stock';

// 1. Fix EmployeeStub to have Integer id and String email
const empStubPath = path.join(stockDir, 'models/stubs/EmployeeStub.java');
fs.writeFileSync(empStubPath, `package com.mtp.stock.models.stubs;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "Employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeStub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
}
`);

// 2. Fix EmployeeRepository to use Integer and have findByEmailIgnoreCase
const empRepoPath = path.join(stockDir, 'repositories/EmployeeRepository.java');
fs.writeFileSync(empRepoPath, `package com.mtp.stock.repositories;
import com.mtp.stock.models.stubs.EmployeeStub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeStub, Integer> {
    Optional<EmployeeStub> findByEmailIgnoreCase(String email);
}
`);

// 3. Replace Department with DepartmentStub in AssetImportService
const aisPath = path.join(stockDir, 'services/AssetImportService.java');
if (fs.existsSync(aisPath)) {
    let content = fs.readFileSync(aisPath, 'utf8');
    content = content.replace(/Department::getName/g, 'DepartmentStub::getName');
    content = content.replace(/new Department\(null, name, null\)/g, 'new DepartmentStub(null, name)');
    content = content.replace(/<String, Department>/g, '<String, DepartmentStub>');
    content = content.replace(/import com\.mtp\.stock\.models\.Department;/g, 'import com.mtp.stock.models.stubs.DepartmentStub;');
    fs.writeFileSync(aisPath, content, 'utf8');
}

// 4. Fix AssetController SecurityContextHolder
const acPath = path.join(stockDir, 'controllers/AssetController.java');
if (fs.existsSync(acPath)) {
    let content = fs.readFileSync(acPath, 'utf8');
    content = content.replace(/String username = org\.springframework\.security\.core\.context\.SecurityContextHolder\.getContext\(\)\s*\.getAuthentication\(\)\.getName\(\);/g, 'String username = "admin"; // TODO: read from gateway headers');
    fs.writeFileSync(acPath, content, 'utf8');
}

console.log('Phase 4 fixes applied!');

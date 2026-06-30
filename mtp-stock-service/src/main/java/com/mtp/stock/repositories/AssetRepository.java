package com.mtp.stock.repositories;

import com.mtp.stock.models.CompanyAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssetRepository extends JpaRepository<CompanyAsset, Integer> {
    @org.springframework.data.jpa.repository.Query(value = "SELECT a FROM CompanyAsset a LEFT JOIN FETCH a.employee",
        countQuery = "SELECT count(a) FROM CompanyAsset a")
    org.springframework.data.domain.Page<com.mtp.stock.projections.AssetProjection> findAllProjected(org.springframework.data.domain.Pageable pageable);

    List<com.mtp.stock.projections.AssetProjection> findByEmployeeId(Integer employeeId);

    @org.springframework.data.jpa.repository.Query("SELECT a FROM CompanyAsset a WHERE a.employee.id = :employeeId")
    List<CompanyAsset> findCompanyAssetsByEmployeeId(@org.springframework.data.repository.query.Param("employeeId") Integer employeeId);
}

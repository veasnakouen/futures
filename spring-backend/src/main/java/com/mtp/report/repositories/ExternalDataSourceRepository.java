package com.mtp.report.repositories;

import com.mtp.report.models.ExternalDataSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExternalDataSourceRepository extends JpaRepository<ExternalDataSource, Long> {
}

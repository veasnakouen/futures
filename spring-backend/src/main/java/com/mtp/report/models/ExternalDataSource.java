package com.mtp.report.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "mtp_external_data_sources")
public class ExternalDataSource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    private String type; // "CSV" or "JDBC"
    
    private String tableName; // For CSV: dynamically created table. For JDBC: target table.

    private String jdbcUrl;
    private String username;
    private String password;

    @Column(columnDefinition = "VARCHAR(MAX)")
    private String columnsJson; // JSON array of column names

}

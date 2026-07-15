package com.mtp.api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Table(name = "ClientDocuments")
@Data
public class ClientDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "ClientId")
    private Long clientId;

    @Column(name = "FileName")
    private String fileName;

    @Column(name = "FileType")
    private String fileType;

    @Column(name = "FileSize")
    private String fileSize;

    @Column(name = "FileUrl")
    private String fileUrl;

    @Column(name = "UploadDate")
    private LocalDateTime uploadDate = LocalDateTime.now();
}

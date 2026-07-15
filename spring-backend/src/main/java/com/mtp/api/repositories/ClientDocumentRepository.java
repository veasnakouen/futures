package com.mtp.api.repositories;

import com.mtp.api.models.ClientDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientDocumentRepository extends JpaRepository<ClientDocument, Long> {
    List<ClientDocument> findByClientId(Long clientId);
}

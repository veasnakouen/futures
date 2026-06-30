package com.mtp.api.repositories;

import com.mtp.api.models.WebhookEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WebhookEndpointRepository extends JpaRepository<WebhookEndpoint, Integer> {
    List<WebhookEndpoint> findByIsActiveTrue();
}

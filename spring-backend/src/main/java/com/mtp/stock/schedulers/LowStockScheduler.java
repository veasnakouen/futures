package com.mtp.stock.schedulers;

import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.repositories.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class LowStockScheduler {

    private final InventoryRepository inventoryRepository;
    private final RestTemplate resilientRestTemplate;

    @Value("${notification.service.url:http://localhost:8081}")
    private String notificationServiceUrl;

    /**
     * Runs every day at 8:00 AM to check for items that require restocking.
     * Communicates with spring-backend to send notifications.
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void notifyLowStockItems() {
        log.info("Running LowStockScheduler to check for items needing restock...");

        List<InventoryItem> lowStockItems = inventoryRepository.findItemsRequiringRestock();

        int notificationsSent = 0;
        for (InventoryItem item : lowStockItems) {
            try {
                String title = "Low Stock Alert";
                String message = String.format("Item %s (SKU: %s) has dropped to %d, which is at or below its reorder level of %d.",
                        item.getName(), item.getSku(), item.getStockQuantity(), item.getReorderLevel() != null ? item.getReorderLevel() : 0);

                sendNotificationRequest("admin", title, message, "LOW_STOCK_ALERT");
                notificationsSent++;
            } catch (Exception e) {
                log.warn("Resilient fallback: Low stock notification skipped for item {} because notification service at {} is offline", item.getSku(), notificationServiceUrl);
            }
        }

        log.info("Completed low stock check. Sent {} notifications out of {} low stock items.", notificationsSent, lowStockItems.size());
    }

    private void sendNotificationRequest(String recipient, String title, String message, String type) {
        String url = notificationServiceUrl + "/api/notifications/test";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = new HashMap<>();
        payload.put("recipient", recipient);
        payload.put("title", title);
        payload.put("message", message);
        payload.put("type", type);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        resilientRestTemplate.postForEntity(url, request, String.class);
    }
}

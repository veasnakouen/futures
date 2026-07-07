package com.mtp.stock.events;

import com.mtp.stock.config.RabbitMQConfig;
import com.mtp.stock.services.StockTransferService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class InventoryEventListener {

    private static final Logger logger = LoggerFactory.getLogger(InventoryEventListener.class);

    @Autowired
    private StockTransferService stockTransferService;

    /**
     * Listens for an ItemConsumedEvent published by any other service (e.g. Clinic or POS)
     * Payload expected format:
     * {
     *   "sourceService": "CLINIC",
     *   "itemId": 1,
     *   "locationId": 2, // The Clinic Pharmacy location
     *   "quantity": 5
     * }
     */
    @RabbitListener(queues = RabbitMQConfig.ITEM_CONSUMED_QUEUE)
    public void handleItemConsumedEvent(Map<String, Object> payload) {
        logger.info("Received ItemConsumedEvent via RabbitMQ: {}", payload);
        
        try {
            Long itemId = Long.valueOf(payload.get("itemId").toString());
            Long locationId = Long.valueOf(payload.get("locationId").toString());
            Integer quantity = Integer.valueOf(payload.get("quantity").toString());

            stockTransferService.consumeStockFromLocation(itemId, locationId, quantity);
            logger.info("Successfully deducted {} units of item {} from location {}", quantity, itemId, locationId);
        } catch (Exception e) {
            logger.error("Failed to process ItemConsumedEvent. Payload: {}, Error: {}", payload, e.getMessage());
            // Depending on architecture, you might publish to a Dead Letter Queue or trigger a Saga Rollback event here
        }
    }
}

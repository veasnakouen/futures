package com.mtp.clinic.cqrs.handlers.commands;

import com.mtp.clinic.cqrs.commands.CreatePrescriptionCommand;
import com.mtp.clinic.cqrs.dto.PrescriptionQueryResultDto;
import com.mtp.clinic.cqrs.mappers.PrescriptionMapper;
import com.mtp.clinic.models.Prescription;
import com.mtp.clinic.repositories.PrescriptionRepository;
import com.mtp.clinic.feign.StockServiceClient;
import com.mtp.clinic.models.PrescriptionItem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CreatePrescriptionCommandHandler {

    private final PrescriptionRepository repository;
    private final PrescriptionMapper mapper;
    private final StockServiceClient stockServiceClient;

    // Hardcode clinic location ID for this example (assuming 1 is the Clinic node)
    private static final Long CLINIC_LOCATION_ID = 1L;

    @Transactional
    public PrescriptionQueryResultDto handle(CreatePrescriptionCommand command) {
        Prescription entity = mapper.toEntity(command);
        Prescription savedEntity = repository.save(entity);

        // Real-time stock tracking integration via Feign
        if (savedEntity.getItems() != null) {
            for (PrescriptionItem item : savedEntity.getItems()) {
                if (item.getInventoryItemId() != null && item.getQuantityDispensed() != null && item.getQuantityDispensed() > 0) {
                    try {
                        stockServiceClient.consumeStock(Map.of(
                            "itemId", item.getInventoryItemId(),
                            "locationId", CLINIC_LOCATION_ID,
                            "quantity", item.getQuantityDispensed()
                        ));
                    } catch (Exception e) {
                        // Log error or throw specific exception if strict consistency is required
                        System.err.println("Failed to deduct stock for item: " + item.getInventoryItemId() + ". Error: " + e.getMessage());
                    }
                }
            }
        }

        return mapper.toDto(savedEntity);
    }
}

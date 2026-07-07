package com.mtp.pos.controllers;

import com.mtp.grpc.inventory.CheckInventoryRequest;
import com.mtp.grpc.inventory.CheckInventoryResponse;
import com.mtp.grpc.inventory.InventoryServiceGrpc;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pos/grpc-test")
public class PosGrpcClientController {

    @GrpcClient("stockService")
    private InventoryServiceGrpc.InventoryServiceBlockingStub inventoryStub;

    @GetMapping
    public Map<String, Object> checkStock(@RequestParam String itemId) {
        CheckInventoryRequest request = CheckInventoryRequest.newBuilder()
                .setItemId(itemId)
                .build();

        CheckInventoryResponse response = inventoryStub.checkStock(request);

        Map<String, Object> result = new HashMap<>();
        result.put("itemId", itemId);
        result.put("available", response.getAvailable());
        result.put("quantity", response.getQuantity());
        result.put("message", "Data fetched via gRPC from Stock Service!");

        return result;
    }
}

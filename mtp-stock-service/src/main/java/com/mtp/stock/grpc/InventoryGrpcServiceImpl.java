package com.mtp.stock.grpc;

import com.mtp.grpc.inventory.CheckInventoryRequest;
import com.mtp.grpc.inventory.CheckInventoryResponse;
import com.mtp.grpc.inventory.InventoryServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@GrpcService
public class InventoryGrpcServiceImpl extends InventoryServiceGrpc.InventoryServiceImplBase {

    @Override
    public void checkStock(CheckInventoryRequest request, StreamObserver<CheckInventoryResponse> responseObserver) {
        log.info("Received gRPC request to check stock for item: {}", request.getItemId());

        // Mock logic for demonstration: if itemId is "123", it's available with qty 50.
        boolean isAvailable = request.getItemId() != null && !request.getItemId().isEmpty();
        int quantity = isAvailable ? 50 : 0;

        CheckInventoryResponse response = CheckInventoryResponse.newBuilder()
                .setAvailable(isAvailable)
                .setQuantity(quantity)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}

package com.mtp.clinic.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;

@FeignClient(name = "mtp-stock-service")
public interface StockServiceClient {

    @PostMapping("/api/stock/locations/consume")
    ResponseEntity<?> consumeStock(@RequestBody Map<String, Object> payload);
}

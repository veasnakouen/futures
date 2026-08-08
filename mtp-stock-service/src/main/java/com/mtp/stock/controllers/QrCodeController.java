package com.mtp.stock.controllers;

import com.mtp.stock.services.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/qr")
@RequiredArgsConstructor
public class QrCodeController {

    private final QrCodeService qrCodeService;

    private ResponseEntity<byte[]> createPngResponse(byte[] imageBytes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/asset/{id}")
    public ResponseEntity<byte[]> getAssetQrCode(@PathVariable Integer id) {
        return qrCodeService.generateAssetQrCode(id)
                .map(this::createPngResponse)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<byte[]> getProductQrCode(@PathVariable Long id) {
        return qrCodeService.generateProductQrCode(id)
                .map(this::createPngResponse)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/location/{id}")
    public ResponseEntity<byte[]> getLocationQrCode(@PathVariable Long id) {
        return qrCodeService.generateLocationQrCode(id)
                .map(this::createPngResponse)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{id}")
    public ResponseEntity<byte[]> getDepartmentQrCode(@PathVariable Integer id) {
        return qrCodeService.generateDepartmentQrCode(id)
                .map(this::createPngResponse)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

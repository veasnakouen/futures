package com.mtp.stock.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.mtp.stock.models.CompanyAsset;
import com.mtp.stock.models.InventoryItem;
import com.mtp.stock.models.Location;
import com.mtp.stock.models.stubs.DepartmentStub;
import com.mtp.stock.repositories.AssetRepository;
import com.mtp.stock.repositories.DepartmentRepository;
import com.mtp.stock.repositories.InventoryRepository;
import com.mtp.stock.repositories.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QrCodeService {

    private final AssetRepository assetRepository;
    private final InventoryRepository inventoryRepository;
    private final LocationRepository locationRepository;
    private final DepartmentRepository departmentRepository;

    public byte[] generateQrCode(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }

    public Optional<byte[]> generateAssetQrCode(Integer id) {
        return assetRepository.findById(id).map(asset -> {
            try {
                String payload = String.format("{\"type\":\"ASSET\", \"id\":%d, \"serial\":\"%s\"}",
                        asset.getId(), asset.getSerialNumber());
                return generateQrCode(payload, 250, 250);
            } catch (Exception e) {
                throw new RuntimeException("Error generating asset QR", e);
            }
        });
    }

    public Optional<byte[]> generateProductQrCode(Long id) {
        return inventoryRepository.findById(id).map(item -> {
            try {
                String payload = String.format("{\"type\":\"PRODUCT\", \"id\":%d, \"sku\":\"%s\"}",
                        item.getId(), item.getSku());
                return generateQrCode(payload, 250, 250);
            } catch (Exception e) {
                throw new RuntimeException("Error generating product QR", e);
            }
        });
    }

    public Optional<byte[]> generateLocationQrCode(Long id) {
        return locationRepository.findById(id).map(location -> {
            try {
                String payload = String.format("{\"type\":\"LOCATION\", \"id\":%d, \"name\":\"%s\"}",
                        location.getId(), location.getName());
                return generateQrCode(payload, 250, 250);
            } catch (Exception e) {
                throw new RuntimeException("Error generating location QR", e);
            }
        });
    }

    public Optional<byte[]> generateDepartmentQrCode(Integer id) {
        return departmentRepository.findById(id).map(dept -> {
            try {
                String payload = String.format("{\"type\":\"DEPARTMENT\", \"id\":%d, \"name\":\"%s\"}",
                        dept.getId(), dept.getName());
                return generateQrCode(payload, 250, 250);
            } catch (Exception e) {
                throw new RuntimeException("Error generating department QR", e);
            }
        });
    }
}

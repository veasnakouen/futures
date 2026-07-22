package com.mtp.pos.services;

import com.mtp.pos.dtos.PosProductDto;
import com.mtp.pos.models.PosProduct;
import com.mtp.pos.repositories.PosProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PosProductService {
    private final PosProductRepository repository;

    public PosProductService(PosProductRepository repository) {
        this.repository = repository;
    }

    public List<PosProductDto> getAllProducts() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public PosProductDto createProduct(PosProductDto dto) {
        String sku = dto.getSku();
        if (sku == null || sku.trim().isEmpty()) {
            sku = generateSku();
        }

        PosProduct product = PosProduct.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .sku(sku)
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .category(dto.getCategory())
                .barcode(dto.getBarcode())
                .costPrice(dto.getCostPrice())
                .taxRate(dto.getTaxRate())
                .status(dto.getStatus())
                .imageUrl(dto.getImageUrl())
                .unit(dto.getUnit())
                .brand(dto.getBrand())
                .build();
        return mapToDto(repository.save(product));
    }

    public PosProductDto updateProduct(String id, PosProductDto dto) {
        PosProduct product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setSku(dto.getSku());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        product.setCategory(dto.getCategory());
        product.setBarcode(dto.getBarcode());
        product.setCostPrice(dto.getCostPrice());
        product.setTaxRate(dto.getTaxRate());
        product.setStatus(dto.getStatus());
        product.setImageUrl(dto.getImageUrl());
        product.setUnit(dto.getUnit());
        product.setBrand(dto.getBrand());
        return mapToDto(repository.save(product));
    }

    public void deleteProduct(String id) {
        repository.deleteById(id);
    }

    public String generateSku() {
        String prefix = "POS";
        String maxSku = repository.findMaxSkuByPrefix(prefix);
        String newSku = prefix + "-00001";

        if (maxSku != null && maxSku.startsWith(prefix + "-")) {
            try {
                String numPart = maxSku.substring(prefix.length() + 1);
                int nextNum = Integer.parseInt(numPart) + 1;
                newSku = String.format("%s-%05d", prefix, nextNum);
            } catch (Exception e) {
                newSku = prefix + "-" + System.currentTimeMillis();
            }
        }
        return newSku;
    }

    private PosProductDto mapToDto(PosProduct product) {
        PosProductDto dto = new PosProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setSku(product.getSku());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setCategory(product.getCategory());
        dto.setBarcode(product.getBarcode());
        dto.setCostPrice(product.getCostPrice());
        dto.setTaxRate(product.getTaxRate());
        dto.setStatus(product.getStatus());
        dto.setImageUrl(product.getImageUrl());
        dto.setUnit(product.getUnit());
        dto.setBrand(product.getBrand());
        return dto;
    }
}

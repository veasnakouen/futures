package com.mtp.pos.services;

import com.mtp.pos.dtos.PosSaleDto;
import com.mtp.pos.dtos.PosSaleItemDto;
import com.mtp.pos.models.PosProduct;
import com.mtp.pos.models.PosSale;
import com.mtp.pos.models.PosSaleItem;
import com.mtp.pos.repositories.PosProductRepository;
import com.mtp.pos.repositories.PosSaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PosSaleService {
    private final PosSaleRepository repository;
    private final PosProductRepository productRepository;

    public PosSaleService(PosSaleRepository repository, PosProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<PosSaleDto> getAllSales() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public PosSaleDto createSale(PosSaleDto dto) {
        PosSale sale = PosSale.builder()
                .cashierId(dto.getCashierId())
                .paymentMethod(dto.getPaymentMethod())
                .totalAmount(dto.getTotalAmount())
                .receiptNumber(dto.getReceiptNumber())
                .items(new ArrayList<>())
                .build();

        if (dto.getItems() != null) {
            for (PosSaleItemDto itemDto : dto.getItems()) {
                PosSaleItem item = PosSaleItem.builder()
                        .sale(sale)
                        .productId(itemDto.getProductId())
                        .productName(itemDto.getProductName())
                        .quantity(itemDto.getQuantity())
                        .unitPrice(itemDto.getUnitPrice())
                        .subtotal(itemDto.getSubtotal())
                        .discount(itemDto.getDiscount())
                        .build();
                sale.getItems().add(item);

                // Update product stock
                PosProduct product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + itemDto.getProductId()));
                
                int newQuantity = product.getStockQuantity() - itemDto.getQuantity();
                product.setStockQuantity(Math.max(newQuantity, 0)); // Prevent negative stock
                
                if (product.getStockQuantity() == 0) {
                    product.setStatus("OUT_OF_STOCK");
                }
                productRepository.save(product);
            }
        }

        return mapToDto(repository.save(sale));
    }

    private PosSaleDto mapToDto(PosSale sale) {
        PosSaleDto dto = new PosSaleDto();
        dto.setId(sale.getId());
        dto.setCashierId(sale.getCashierId());
        dto.setPaymentMethod(sale.getPaymentMethod());
        dto.setTotalAmount(sale.getTotalAmount());
        dto.setReceiptNumber(sale.getReceiptNumber());
        dto.setTransactionDate(sale.getTransactionDate());
        
        if (sale.getItems() != null) {
            dto.setItems(sale.getItems().stream().map(item -> {
                PosSaleItemDto itemDto = new PosSaleItemDto();
                itemDto.setId(item.getId());
                itemDto.setProductId(item.getProductId());
                itemDto.setProductName(item.getProductName());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setUnitPrice(item.getUnitPrice());
                itemDto.setSubtotal(item.getSubtotal());
                itemDto.setDiscount(item.getDiscount());
                return itemDto;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}

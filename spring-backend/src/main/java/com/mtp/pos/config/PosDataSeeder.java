package com.mtp.pos.config;

import com.mtp.pos.models.PosProduct;
import com.mtp.pos.repositories.PosProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class PosDataSeeder implements CommandLineRunner {

    private final PosProductRepository posProductRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (posProductRepository.count() == 0) {
            System.out.println(">>> SEEDER: Auto-populating initial POS Product Catalog...");

            PosProduct p1 = PosProduct.builder()
                    .name("Organic Espresso Coffee Beans 1kg")
                    .sku("COF-001")
                    .barcode("88392019201")
                    .price(new BigDecimal("18.50"))
                    .stockQuantity(120)
                    .category("Beverages")
                    .imageUrl("https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80")
                    .status("ACTIVE")
                    .build();

            PosProduct p2 = PosProduct.builder()
                    .name("Paracetamol 500mg (Box of 100)")
                    .sku("MED-002")
                    .barcode("88392019202")
                    .price(new BigDecimal("12.00"))
                    .stockQuantity(85)
                    .category("Pharmacy")
                    .imageUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80")
                    .status("ACTIVE")
                    .build();

            PosProduct p3 = PosProduct.builder()
                    .name("Mini-Bar Sparkling Mineral Water 500ml")
                    .sku("HTL-001")
                    .barcode("88392019203")
                    .price(new BigDecimal("3.50"))
                    .stockQuantity(300)
                    .category("Minibar")
                    .imageUrl("https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80")
                    .status("ACTIVE")
                    .build();

            PosProduct p4 = PosProduct.builder()
                    .name("Advanced STEM Textbook Pack")
                    .sku("SCH-003")
                    .barcode("88392019204")
                    .price(new BigDecimal("24.50"))
                    .stockQuantity(65)
                    .category("Books")
                    .imageUrl("https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80")
                    .status("ACTIVE")
                    .build();

            posProductRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
        }
    }
}

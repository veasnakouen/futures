package com.mtp.stock.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "InventoryItems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.Size(max = 50, message = "SKU cannot exceed 50 characters")
    private String sku;

    @jakarta.validation.constraints.NotBlank(message = "Item name is required")
    @jakarta.validation.constraints.Size(max = 255, message = "Name cannot exceed 255 characters")
    private String name;

    @jakarta.validation.constraints.Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private AssetCategory category;
    private String brand;

    @jakarta.validation.constraints.DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price;

    private BigDecimal costPrice;

    private BigDecimal discountPercentage;

    @jakarta.validation.constraints.NotNull(message = "Stock quantity is required")
    @jakarta.validation.constraints.Min(value = 0, message = "Quantity cannot be negative")
    @Column(name = "quantity")
    private Integer stockQuantity;

    @jakarta.validation.constraints.Min(value = 0, message = "Reorder level cannot be negative")
    private Integer reorderLevel;

    private Double weight;

    private String unitOfMeasure;
    private String supplierName;
    private String donorName;
    private String grantCode;
    private String locationBin;
    private String batchNumber;
    private String expiryDate;

    private Boolean active = true;

    private Boolean featured = false;

    private Double rating;

    private Integer reviewCount;

    private Boolean trackStock = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private com.mtp.stock.models.stubs.DepartmentStub department;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String imageUrl;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Domain Methods ---

    public void addStock(int amount) {
        if (amount < 0)
            throw new IllegalArgumentException("Cannot add negative stock");
        this.stockQuantity = (this.stockQuantity == null ? 0 : this.stockQuantity) + amount;
    }

    public void removeStock(int amount) {
        if (amount < 0)
            throw new IllegalArgumentException("Cannot remove negative stock");
        if (this.stockQuantity == null || this.stockQuantity < amount) {
            throw new IllegalStateException("Insufficient stock to fulfill request");
        }
        this.stockQuantity -= amount;
    }

    public boolean requiresRestocking() {
        int threshold = (this.reorderLevel != null) ? this.reorderLevel : 0;
        return this.stockQuantity != null && this.stockQuantity <= threshold;
    }

    public BigDecimal calculateTotalValue() {
        if (this.stockQuantity == null || this.price == null)
            return BigDecimal.ZERO;
        return this.price.multiply(BigDecimal.valueOf(this.stockQuantity));
    }
}

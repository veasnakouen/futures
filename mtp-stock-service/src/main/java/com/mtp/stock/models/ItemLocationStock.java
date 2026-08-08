package com.mtp.stock.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

import org.hibernate.envers.Audited;

@Entity
@Table(name = "ItemLocationStocks", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "inventory_item_id", "location_id" })
})
@Audited
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemLocationStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private InventoryItem inventoryItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Location location;

    @NotNull
    @Min(0)
    private Integer quantity = 0;

    @NotNull
    @Min(0)
    private Integer allocatedQuantity = 0;

    @Min(0)
    private Integer reorderLevel = 0;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    public int getAvailableStock() {
        int qty = this.quantity != null ? this.quantity : 0;
        int alloc = this.allocatedQuantity != null ? this.allocatedQuantity : 0;
        return qty - alloc;
    }
}

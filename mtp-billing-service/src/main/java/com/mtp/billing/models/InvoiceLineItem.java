package com.mtp.billing.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "sys_invoice_line_items")
@NoArgsConstructor
public class InvoiceLineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    @JsonIgnore
    private Invoice invoice;

    private String itemCode; // Replaces cptCode (can be Room#, Course Code, or CPT)
    private String description;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal total;
}

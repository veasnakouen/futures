package com.mtp.api.models;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Configuration
@ConfigurationProperties(prefix = "printer")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Printer {
    private String name;
    private String paperSize;
    private String ipAddress;
    private int port;
    private String model;
    private String status;
    private String location;
    private String driverPath;
    private int printCount;
    private boolean cutting;
    private String orientation;
    private boolean active;
    private String country;
    private String region;
    private String city;
    private String address;
    private long defaultBranchId;
    private long companyId;
    private String branchIds;
    private boolean forReceipt;
    private boolean forInvoice;
    private boolean forJobOrder;
    private boolean forReturnTicket;
    private boolean forDeliveryReceipt;
    private boolean forQuotation;
    private boolean forProductionOrder;
    private boolean forRequisitionForm;
    private boolean forStockCard;
    private boolean forStockCardSummary;
}

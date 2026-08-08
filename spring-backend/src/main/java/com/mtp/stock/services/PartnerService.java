package com.mtp.stock.services;

import com.mtp.stock.models.AssetSupplier;
import com.mtp.stock.models.InventoryRetailer;
import com.mtp.stock.models.InventoryCustomer;

import java.util.List;

public interface PartnerService {
    // Suppliers
    List<AssetSupplier> getAllSuppliers();
    AssetSupplier createSupplier(AssetSupplier supplier);
    AssetSupplier updateSupplier(Integer id, AssetSupplier supplier);
    void deleteSupplier(Integer id);

    // Retailers
    List<InventoryRetailer> getAllRetailers();
    InventoryRetailer createRetailer(InventoryRetailer retailer);
    InventoryRetailer updateRetailer(Integer id, InventoryRetailer retailer);
    void deleteRetailer(Integer id);

    // Customers
    List<InventoryCustomer> getAllCustomers();
    InventoryCustomer createCustomer(InventoryCustomer customer);
    InventoryCustomer updateCustomer(Integer id, InventoryCustomer customer);
    void deleteCustomer(Integer id);
}

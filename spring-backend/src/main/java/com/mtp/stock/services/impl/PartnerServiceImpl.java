package com.mtp.stock.services.impl;

import com.mtp.stock.models.AssetSupplier;
import com.mtp.stock.models.InventoryRetailer;
import com.mtp.stock.models.InventoryCustomer;
import com.mtp.stock.repositories.AssetSupplierRepository;
import com.mtp.stock.repositories.InventoryRetailerRepository;
import com.mtp.stock.repositories.InventoryCustomerRepository;
import com.mtp.stock.services.PartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PartnerServiceImpl implements PartnerService {

    private final AssetSupplierRepository supplierRepository;
    private final InventoryRetailerRepository retailerRepository;
    private final InventoryCustomerRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AssetSupplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public AssetSupplier createSupplier(AssetSupplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public AssetSupplier updateSupplier(Integer id, AssetSupplier supplier) {
        AssetSupplier existing = supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
        existing.setName(supplier.getName());
        existing.setContactInfo(supplier.getContactInfo());
        existing.setContactPerson(supplier.getContactPerson());
        existing.setPhone(supplier.getPhone());
        existing.setEmail(supplier.getEmail());
        existing.setAddress(supplier.getAddress());
        existing.setTaxId(supplier.getTaxId());
        existing.setStatus(supplier.getStatus() != null ? supplier.getStatus() : existing.getStatus());
        return supplierRepository.save(existing);
    }

    @Override
    public void deleteSupplier(Integer id) {
        supplierRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryRetailer> getAllRetailers() {
        return retailerRepository.findAll();
    }

    @Override
    public InventoryRetailer createRetailer(InventoryRetailer retailer) {
        return retailerRepository.save(retailer);
    }

    @Override
    public InventoryRetailer updateRetailer(Integer id, InventoryRetailer retailer) {
        InventoryRetailer existing = retailerRepository.findById(id).orElseThrow(() -> new RuntimeException("Retailer not found"));
        existing.setName(retailer.getName());
        existing.setContactInfo(retailer.getContactInfo());
        existing.setAddress(retailer.getAddress());
        existing.setContactPerson(retailer.getContactPerson());
        existing.setPhone(retailer.getPhone());
        existing.setEmail(retailer.getEmail());
        existing.setTaxId(retailer.getTaxId());
        existing.setStatus(retailer.getStatus() != null ? retailer.getStatus() : existing.getStatus());
        return retailerRepository.save(existing);
    }

    @Override
    public void deleteRetailer(Integer id) {
        retailerRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryCustomer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public InventoryCustomer createCustomer(InventoryCustomer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public InventoryCustomer updateCustomer(Integer id, InventoryCustomer customer) {
        InventoryCustomer existing = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        existing.setName(customer.getName());
        existing.setContactInfo(customer.getContactInfo());
        existing.setEmail(customer.getEmail());
        existing.setContactPerson(customer.getContactPerson());
        existing.setPhone(customer.getPhone());
        existing.setAddress(customer.getAddress());
        existing.setTaxId(customer.getTaxId());
        existing.setStatus(customer.getStatus() != null ? customer.getStatus() : existing.getStatus());
        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }
}

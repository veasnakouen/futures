package com.mtp.stock.repositories;

import com.mtp.stock.models.InventoryCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryCustomerRepository extends JpaRepository<InventoryCustomer, Integer> {
}

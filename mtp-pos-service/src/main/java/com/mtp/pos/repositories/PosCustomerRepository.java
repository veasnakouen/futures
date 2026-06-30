package com.mtp.pos.repositories;

import com.mtp.pos.models.PosCustomer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PosCustomerRepository extends JpaRepository<PosCustomer, String> {
}

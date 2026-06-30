package com.mtp.stock.repositories;
import com.mtp.stock.models.stubs.DepartmentStub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentStub, Integer> {
}

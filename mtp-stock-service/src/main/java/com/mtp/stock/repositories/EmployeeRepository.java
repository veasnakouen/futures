package com.mtp.stock.repositories;
import com.mtp.stock.models.stubs.EmployeeStub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeStub, Integer> {
    Optional<EmployeeStub> findByEmailIgnoreCase(String email);
}

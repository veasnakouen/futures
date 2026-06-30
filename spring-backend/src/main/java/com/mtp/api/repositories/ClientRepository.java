package com.mtp.api.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.mtp.api.models.Client;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer>, JpaSpecificationExecutor<Client> {

    Page<Client> findAll(Pageable pageable);

    Optional<Client> findByClientCode(String clientCode);

    @org.springframework.data.jpa.repository.Query("SELECT c.status, COUNT(c) FROM Client c WHERE c.status IS NOT NULL GROUP BY c.status")
    java.util.List<Object[]> countByStatus();

    @org.springframework.data.jpa.repository.Query("SELECT c.gender, COUNT(c) FROM Client c WHERE c.gender IS NOT NULL GROUP BY c.gender")
    java.util.List<Object[]> countByGender();

    @org.springframework.data.jpa.repository.Query("SELECT CAST(c.registerDate AS date), COUNT(c) FROM Client c WHERE c.registerDate IS NOT NULL GROUP BY CAST(c.registerDate AS date)")
    java.util.List<Object[]> countByRegisterDate();

    org.springframework.data.domain.Page<Client> findByRegisterDateBetween(
        java.time.LocalDateTime start, 
        java.time.LocalDateTime end, 
        org.springframework.data.domain.Pageable pageable
    );
}

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
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer>, JpaSpecificationExecutor<Client> {

    Page<Client> findAll(Pageable pageable);

    @Query("SELECT c.id as id, c.firstName as firstName, c.lastName as lastName, c.gender as gender, " +
           "c.branch as branch, c.clientCode as clientCode, c.photo as photo, c.status as status, " +
           "c.email as email, c.contactPhone as contactPhone, c.registerDate as registerDate " +
           "FROM Client c " +
           "WHERE (:name IS NULL OR :name = '' OR LOWER(c.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(c.clientCode) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:branch IS NULL OR :branch = '' OR c.branch = :branch) " +
           "AND (:status IS NULL OR :status = '' OR c.status = :status)")
    Page<ClientSummary> findAllSummaries(
            @Param("name") String name,
            @Param("branch") String branch,
            @Param("status") String status,
            Pageable pageable);

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

    interface ClientSummary {
        Integer getId();
        String getFirstName();
        String getLastName();
        String getGender();
        String getBranch();
        String getClientCode();
        String getPhoto();
        String getStatus();
        String getEmail();
        String getContactPhone();
        java.time.LocalDateTime getRegisterDate();
    }
}

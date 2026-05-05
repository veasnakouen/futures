package com.mtp.api.repositories;

import com.mtp.api.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByIdNo(String idNo);

    /**
     * Lightweight projection query for the employee list view.
     *
     * PROBLEM: The default findAll() loads the entire Employee entity,
     * including the @Lob "photo" field which can be hundreds of KB per record.
     * For 100+ employees this means MBs of Base64 data in every list API call.
     *
     * SOLUTION: This query fetches only the columns needed for the directory list.
     * The photo column is intentionally excluded — it's loaded separately
     * only when viewing an individual employee's detail modal.
     *
     * Result: JSON payload for employee list drops from ~5MB to ~20KB.
     */
    @Query("SELECT e.id as id, " +
            "e.firstNameEnglish as firstNameEnglish, " +
            "e.lastNameEnglish as lastNameEnglish, " +
            "e.idNo as idNo, " +
            "e.email as email, " +
            "e.phoneNumber as phoneNumber, " +
            "e.status as status, " +
            "e.contractType as contractType, " +
            "e.joinDate as joinDate, " +
            "e.department as department, " +
            "e.position as position, " +
            "e.basicSalary as basicSalary, " +
            "e.bankName as bankName, " +
            "e.bankAccountNumber as bankAccountNumber, " +
            "e.emergencyContactName as emergencyContactName, " +
            "e.emergencyContact as emergencyContact, " +
            "e.emergencyContactPhone as emergencyContactPhone, " +
            "e.firstNameKhmer as firstNameKhmer, " +
            "e.lastNameKhmer as lastNameKhmer, " +
            "e.customFields as customFields, " +
            "e.title as title, " +
            "e.gender as gender, " +
            "e.dateOfBirth as dateOfBirth, " +
            "e.placeOfBirth as placeOfBirth, " +
            "e.address as address, " +
            "e.country as country, " +
            "e.nationality as nationality, " +
            "e.bloodGroup as bloodGroup, " +
            "e.contractStartDate as contractStartDate, " +
            "e.contractEndDate as contractEndDate, " +
            "e.manager as manager, " +
            "e.maritalStatus as maritalStatus, " +
            "e.children as children, " +
            "e.identityCardNumber as identityCardNumber, " +
            "e.identityCardType as identityCardType, " +
            "e.note as note, " +
            "e.photo as photo " +
            "FROM Employee e " +
            "WHERE (:search IS NULL OR e.firstNameEnglish LIKE %:search% OR e.lastNameEnglish LIKE %:search% OR e.idNo LIKE %:search%) " +
            "AND (:dept IS NULL OR :dept = '' OR e.department.name = :dept) " +
            "AND (:status IS NULL OR :status = '' OR e.status = :status) " +
            "AND (:contract IS NULL OR :contract = '' OR e.contractType = :contract)")
    Page<EmployeeSummary> findAllSummaries(
            @Param("search") String search,
            @Param("dept") String dept,
            @Param("status") String status,
            @Param("contract") String contract,
            Pageable pageable);

    /**
     * Interface-based projection — Spring Data JPA auto-implements this.
     * Maps each alias in the @Query above to a getter method.
     */
    interface EmployeeSummary {
        Integer getId();

        String getFirstNameEnglish();

        String getLastNameEnglish();

        String getIdNo();

        String getEmail();

        String getPhoneNumber();

        String getStatus();

        String getContractType();

        java.time.LocalDate getJoinDate();

        Object getDepartment(); // returns the Department entity

        Object getPosition(); // returns the Position entity

        Double getBasicSalary();

        String getBankName();

        String getBankAccountNumber();

        String getEmergencyContactName();

        String getEmergencyContact();

        String getEmergencyContactPhone();
        String getFirstNameKhmer();
        String getLastNameKhmer();
        String getCustomFields();
        String getPhoto();
        String getTitle();
        String getGender();
        java.time.LocalDate getDateOfBirth();
        String getPlaceOfBirth();
        String getAddress();
        String getCountry();
        String getNationality();
        String getBloodGroup();
        java.time.LocalDate getContractStartDate();
        java.time.LocalDate getContractEndDate();
        String getManager();
        String getMaritalStatus();
        String getChildren();
        String getIdentityCardNumber();
        String getIdentityCardType();
        String getNote();
    }
}

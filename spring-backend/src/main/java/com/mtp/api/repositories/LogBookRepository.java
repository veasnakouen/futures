package com.mtp.api.repositories;

import com.mtp.api.models.LogBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogBookRepository extends JpaRepository<LogBook, Integer> {
    Page<LogBook> findByNoteContainingOrPhoneContaining(String note, String phone, Pageable pageable);
}

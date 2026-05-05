package com.mtp.api.repositories;

import com.mtp.api.models.Lession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessionRepository extends JpaRepository<Lession, Integer> {
    List<Lession> findBySubjectId(Integer subjectId);
}

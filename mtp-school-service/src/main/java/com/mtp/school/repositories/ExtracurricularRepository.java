package com.mtp.school.repositories;

import com.mtp.school.models.Extracurricular;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExtracurricularRepository extends JpaRepository<Extracurricular, String> {
}

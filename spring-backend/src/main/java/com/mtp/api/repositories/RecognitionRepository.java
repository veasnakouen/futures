package com.mtp.api.repositories;

import com.mtp.api.models.Recognition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecognitionRepository extends JpaRepository<Recognition, Integer> {
}

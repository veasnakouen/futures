package com.mtp.api.repositories;

import com.mtp.api.models.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LanguageRepository extends JpaRepository<Language, Integer> {
    List<Language> findByClientId(Integer clientId);
}

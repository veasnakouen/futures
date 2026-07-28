package com.mtp.api.repositories;

import com.mtp.api.models.AppTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppTranslationRepository extends JpaRepository<AppTranslation, Long> {
    List<AppTranslation> findByLang(String lang);
    Optional<AppTranslation> findByLangAndTranslationKey(String lang, String translationKey);
}

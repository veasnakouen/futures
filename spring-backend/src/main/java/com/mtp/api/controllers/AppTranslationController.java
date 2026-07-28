package com.mtp.api.controllers;

import com.mtp.api.models.AppTranslation;
import com.mtp.api.services.AppTranslationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/translations")
@Slf4j
public class AppTranslationController {

    @Autowired
    private AppTranslationService translationService;

    @GetMapping
    public ResponseEntity<Map<String, Map<String, String>>> getAllTranslationsGrouped() {
        log.info("Fetching all database i18n translations grouped by language");
        return ResponseEntity.ok(translationService.getAllGroupedByLang());
    }

    @GetMapping("/{lang}")
    public ResponseEntity<Map<String, String>> getTranslationsByLang(@PathVariable String lang) {
        log.info("Fetching database i18n translations for language: {}", lang);
        return ResponseEntity.ok(translationService.getTranslationsForLang(lang));
    }

    @PostMapping
    public ResponseEntity<AppTranslation> saveOrUpdate(@RequestBody AppTranslation translation) {
        log.info("Saving i18n translation key [{}] for lang [{}]", translation.getTranslationKey(), translation.getLang());
        AppTranslation saved = translationService.saveOrUpdate(
            translation.getLang(),
            translation.getTranslationKey(),
            translation.getTranslationValue(),
            translation.getCategory()
        );
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/bulk-seed")
    public ResponseEntity<List<AppTranslation>> bulkSeed(@RequestBody List<AppTranslation> translations) {
        log.info("Bulk seeding {} i18n translation entries", translations.size());
        List<AppTranslation> saved = translationService.bulkSave(translations);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTranslation(@PathVariable Long id) {
        log.info("Deleting translation entry id: {}", id);
        translationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

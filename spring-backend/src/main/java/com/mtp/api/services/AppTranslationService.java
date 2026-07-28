package com.mtp.api.services;

import com.mtp.api.models.AppTranslation;
import com.mtp.api.repositories.AppTranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppTranslationService {

    @Autowired
    private AppTranslationRepository repository;

    public List<AppTranslation> findAll() {
        return repository.findAll();
    }

    public Map<String, String> getTranslationsForLang(String lang) {
        List<AppTranslation> list = repository.findByLang(lang);
        Map<String, String> result = new HashMap<>();
        for (AppTranslation item : list) {
            result.put(item.getTranslationKey(), item.getTranslationValue());
        }
        return result;
    }

    public Map<String, Map<String, String>> getAllGroupedByLang() {
        List<AppTranslation> all = repository.findAll();
        Map<String, Map<String, String>> grouped = new HashMap<>();

        for (AppTranslation item : all) {
            grouped.computeIfAbsent(item.getLang(), k -> new HashMap<>())
                   .put(item.getTranslationKey(), item.getTranslationValue());
        }
        return grouped;
    }

    @Transactional
    public AppTranslation saveOrUpdate(String lang, String key, String value, String category) {
        Optional<AppTranslation> existing = repository.findByLangAndTranslationKey(lang, key);
        AppTranslation entity;
        if (existing.isPresent()) {
            entity = existing.get();
            entity.setTranslationValue(value);
            if (category != null && !category.isEmpty()) {
                entity.setCategory(category);
            }
        } else {
            entity = new AppTranslation();
            entity.setLang(lang);
            entity.setTranslationKey(key);
            entity.setTranslationValue(value);
            entity.setCategory(category != null ? category : "GENERAL");
        }
        return repository.save(entity);
    }

    @Transactional
    public List<AppTranslation> bulkSave(List<AppTranslation> items) {
        List<AppTranslation> savedList = new ArrayList<>();
        for (AppTranslation item : items) {
            if (item.getLang() != null && item.getTranslationKey() != null && item.getTranslationValue() != null) {
                AppTranslation saved = saveOrUpdate(
                    item.getLang(), 
                    item.getTranslationKey(), 
                    item.getTranslationValue(), 
                    item.getCategory()
                );
                savedList.add(saved);
            }
        }
        return savedList;
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}

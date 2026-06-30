package com.mtp.pos.services;

import com.mtp.pos.dtos.PosCategoryDto;
import com.mtp.pos.models.PosCategory;
import com.mtp.pos.repositories.PosCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PosCategoryService {

    private final PosCategoryRepository repository;

    public List<PosCategoryDto> getAllCategories() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public PosCategoryDto createCategory(PosCategoryDto dto) {
        PosCategory category = PosCategory.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .colorCode(dto.getColorCode())
                .icon(dto.getIcon())
                .build();
        return mapToDto(repository.save(category));
    }

    private PosCategoryDto mapToDto(PosCategory entity) {
        PosCategoryDto dto = new PosCategoryDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setColorCode(entity.getColorCode());
        dto.setIcon(entity.getIcon());
        return dto;
    }
}

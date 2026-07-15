package com.mtp.pos.services;

import com.mtp.pos.dtos.PosBrandDto;
import com.mtp.pos.models.PosBrand;
import com.mtp.pos.repositories.PosBrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PosBrandService {

    private final PosBrandRepository repository;

    public List<PosBrandDto> getAllBrands() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public PosBrandDto createBrand(PosBrandDto dto) {
        PosBrand brand = PosBrand.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .logoUrl(dto.getLogoUrl())
                .build();
        return mapToDto(repository.save(brand));
    }

    private PosBrandDto mapToDto(PosBrand entity) {
        PosBrandDto dto = new PosBrandDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setLogoUrl(entity.getLogoUrl());
        return dto;
    }
}

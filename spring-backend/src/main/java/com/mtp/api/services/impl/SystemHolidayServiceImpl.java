package com.mtp.api.services.impl;

import com.mtp.api.dto.SystemHolidayDto;
import com.mtp.api.models.SystemHoliday;
import com.mtp.api.exceptions.ResourceNotFoundException;
import com.mtp.api.repositories.SystemHolidayRepository;
import com.mtp.api.services.SystemHolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SystemHolidayServiceImpl implements SystemHolidayService {

    @Autowired
    private SystemHolidayRepository holidayRepository;

    @Override
    public List<SystemHolidayDto> getAllHolidays() {
        return holidayRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SystemHolidayDto getHolidayById(Integer id) {
        SystemHoliday holiday = holidayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Holiday not found"));
        return mapToDto(holiday);
    }

    @Override
    public SystemHolidayDto createHoliday(SystemHolidayDto dto) {
        SystemHoliday holiday = new SystemHoliday();
        mapToEntity(dto, holiday);
        holiday = holidayRepository.save(holiday);
        return mapToDto(holiday);
    }

    @Override
    public SystemHolidayDto updateHoliday(Integer id, SystemHolidayDto dto) {
        SystemHoliday holiday = holidayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Holiday not found"));
        mapToEntity(dto, holiday);
        holiday = holidayRepository.save(holiday);
        return mapToDto(holiday);
    }

    @Override
    public void deleteHoliday(Integer id) {
        holidayRepository.deleteById(id);
    }

    private SystemHolidayDto mapToDto(SystemHoliday entity) {
        SystemHolidayDto dto = new SystemHolidayDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setCategory(entity.getCategory());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    private void mapToEntity(SystemHolidayDto dto, SystemHoliday entity) {
        entity.setName(dto.getName());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setCategory(dto.getCategory());
        entity.setDescription(dto.getDescription());
    }
}

package com.mtp.api.services.impl;

import com.mtp.api.dto.TimetableDto;
import com.mtp.api.models.Timetable;
import com.mtp.api.repositories.TimetableRepository;
import com.mtp.api.services.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimetableServiceImpl implements TimetableService {

    @Autowired
    private TimetableRepository timetableRepository;

    @Override
    public List<TimetableDto> getAllTimetables() {
        return timetableRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TimetableDto getTimetableById(Integer id) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));
        return mapToDto(timetable);
    }

    @Override
    public TimetableDto createTimetable(TimetableDto dto) {
        Timetable timetable = new Timetable();
        mapToEntity(dto, timetable);
        timetable = timetableRepository.save(timetable);
        return mapToDto(timetable);
    }

    @Override
    public TimetableDto updateTimetable(Integer id, TimetableDto dto) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable not found"));
        mapToEntity(dto, timetable);
        timetable = timetableRepository.save(timetable);
        return mapToDto(timetable);
    }

    @Override
    public void deleteTimetable(Integer id) {
        timetableRepository.deleteById(id);
    }

    private TimetableDto mapToDto(Timetable entity) {
        TimetableDto dto = new TimetableDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setOnDutyTime(entity.getOnDutyTime());
        dto.setOffDutyTime(entity.getOffDutyTime());
        dto.setLateTime(entity.getLateTime());
        dto.setLeaveEarlyTime(entity.getLeaveEarlyTime());
        return dto;
    }

    private void mapToEntity(TimetableDto dto, Timetable entity) {
        entity.setName(dto.getName());
        entity.setOnDutyTime(dto.getOnDutyTime());
        entity.setOffDutyTime(dto.getOffDutyTime());
        entity.setLateTime(dto.getLateTime());
        entity.setLeaveEarlyTime(dto.getLeaveEarlyTime());
    }
}

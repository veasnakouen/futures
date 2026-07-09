package com.mtp.api.services;

import com.mtp.api.dto.TimetableDto;
import java.util.List;

public interface TimetableService {
    List<TimetableDto> getAllTimetables();
    TimetableDto getTimetableById(Integer id);
    TimetableDto createTimetable(TimetableDto timetableDto);
    TimetableDto updateTimetable(Integer id, TimetableDto timetableDto);
    void deleteTimetable(Integer id);
}

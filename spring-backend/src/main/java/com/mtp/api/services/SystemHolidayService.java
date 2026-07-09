package com.mtp.api.services;

import com.mtp.api.dto.SystemHolidayDto;
import java.util.List;

public interface SystemHolidayService {
    List<SystemHolidayDto> getAllHolidays();
    SystemHolidayDto getHolidayById(Integer id);
    SystemHolidayDto createHoliday(SystemHolidayDto holidayDto);
    SystemHolidayDto updateHoliday(Integer id, SystemHolidayDto holidayDto);
    void deleteHoliday(Integer id);
}

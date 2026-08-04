package com.mtp.api.services.attendance;

import com.mtp.api.models.Timetable;
import com.mtp.api.models.WeeklySchedule;
import com.mtp.api.repositories.TimetableRepository;
import com.mtp.api.repositories.WeeklyScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AttendanceScheduleEvaluator {

    private final WeeklyScheduleRepository weeklyScheduleRepository;
    private final TimetableRepository timetableRepository;

    public static class ScheduleEvalResult {
        public final Timetable timetable;
        public final String targetTimetableName;

        public ScheduleEvalResult(Timetable timetable, String targetTimetableName) {
            this.timetable = timetable;
            this.targetTimetableName = targetTimetableName;
        }
    }

    public ScheduleEvalResult evaluateSchedule(Integer employeeId, LocalDateTime now) {
        DayOfWeek day = now.getDayOfWeek();
        Optional<WeeklySchedule> weeklyOpt = weeklyScheduleRepository.findByEmployeeId(employeeId);

        String shiftPattern = "Off";
        if (weeklyOpt.isPresent()) {
            WeeklySchedule ws = weeklyOpt.get();
            switch (day) {
                case MONDAY: shiftPattern = ws.getMondayShift(); break;
                case TUESDAY: shiftPattern = ws.getTuesdayShift(); break;
                case WEDNESDAY: shiftPattern = ws.getWednesdayShift(); break;
                case THURSDAY: shiftPattern = ws.getThursdayShift(); break;
                case FRIDAY: shiftPattern = ws.getFridayShift(); break;
                case SATURDAY: shiftPattern = ws.getSaturdayShift(); break;
                case SUNDAY: shiftPattern = ws.getSundayShift(); break;
            }
        }

        if (shiftPattern == null) shiftPattern = "Off";

        String targetTimetableName = null;
        if (shiftPattern.contains("AM:") && shiftPattern.contains("PM:")) {
            if (now.getHour() < 12) {
                targetTimetableName = shiftPattern.split("\\|")[0].replace("AM:", "").trim();
            } else {
                targetTimetableName = shiftPattern.split("\\|")[1].replace("PM:", "").trim();
            }
        } else {
            targetTimetableName = shiftPattern;
        }

        Timetable timetable = null;
        if (targetTimetableName != null && !targetTimetableName.equalsIgnoreCase("Off")) {
            final String finalTargetName = targetTimetableName;
            List<Timetable> timetables = timetableRepository.findAll();
            timetable = timetables.stream()
                    .filter(t -> t.getName().equalsIgnoreCase(finalTargetName))
                    .findFirst()
                    .orElse(null);
        }

        return new ScheduleEvalResult(timetable, targetTimetableName);
    }

    public String computeLateStatus(Timetable timetable, LocalDateTime now, String targetTimetableName) {
        if (timetable != null && timetable.getOnDutyTime() != null) {
            try {
                LocalTime onDuty = LocalTime.parse(timetable.getOnDutyTime().replaceAll("(?i)\\s*(AM|PM)", "").trim());
                int lateGrace = timetable.getLateTime() != null ? timetable.getLateTime() : 0;
                if (now.toLocalTime().isAfter(onDuty.plusMinutes(lateGrace))) {
                    return "LATE";
                }
                return "ON_TIME";
            } catch (Exception e) {
                return "PARSING_ERROR";
            }
        }
        return "NO_STRICT_TIMETABLE";
    }
}

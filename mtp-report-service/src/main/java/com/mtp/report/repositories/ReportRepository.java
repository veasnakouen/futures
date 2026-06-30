package com.mtp.report.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class ReportRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String buildWhereClause(Long departmentId, String status, String startDate, String endDate, List<Object> args) {
        StringBuilder whereClause = new StringBuilder(" WHERE (e.status = 'Active' OR e.status = 'Working') ");

        if (departmentId != null) {
            whereClause.append(" AND d.id = ? ");
            args.add(departmentId);
        }

        if (status != null && !status.isEmpty()) {
            whereClause.append(" AND e.status = ? ");
            args.add(status);
        }

        // The original query used a hardcoded DATEADD for attendance.
        // We can make the clockIn condition dynamic if dates are provided.
        return whereClause.toString();
    }

    private String buildAttendanceCondition(String startDate, String endDate, List<Object> args) {
        StringBuilder condition = new StringBuilder(" ON a.EmployeeId = e.id ");
        
        if (startDate != null && !startDate.isEmpty()) {
            condition.append(" AND a.clockIn >= ? ");
            args.add(startDate);
        } else {
            condition.append(" AND a.clockIn >= DATEADD(year, -1, GETDATE()) ");
        }

        if (endDate != null && !endDate.isEmpty()) {
            condition.append(" AND a.clockIn <= ? ");
            args.add(endDate);
        }
        
        return condition.toString();
    }

    public List<Map<String, Object>> getEmployeeEvaluationReport(Long departmentId, String status, String startDate, String endDate, int offset, int size) {
        List<Object> args = new ArrayList<>();
        
        // We need separate arg lists for the JOIN condition and the WHERE condition 
        // to maintain the correct order for JDBC prepared statements.
        List<Object> joinArgs = new ArrayList<>();
        String attendanceCondition = buildAttendanceCondition(startDate, endDate, joinArgs);
        
        List<Object> whereArgs = new ArrayList<>();
        String whereClause = buildWhereClause(departmentId, status, startDate, endDate, whereArgs);
        
        args.addAll(joinArgs);
        args.addAll(whereArgs);

        String sql = "SELECT " +
                "    e.idNo as EmployeeID, " +
                "    e.firstNameEnglish + ' ' + e.lastNameEnglish as EmployeeName, " +
                "    d.name as Department, " +
                "    p.name as Position, " +
                "    e.basicSalary as CurrentSalary, " +
                "    e.joinDate as JoinDate, " +
                "    e.status as Status, " +
                "    COUNT(a.id) as TotalAttendanceRecords, " +
                "    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as DaysPresent, " +
                "    SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) as DaysLate, " +
                "    SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as DaysAbsent " +
                "FROM Employees e WITH (NOLOCK) " +
                "LEFT JOIN Departments d WITH (NOLOCK) ON e.DepartmentId = d.id " +
                "LEFT JOIN Positions p WITH (NOLOCK) ON e.PositionId = p.id " +
                "LEFT JOIN Attendance a WITH (NOLOCK) " + attendanceCondition +
                whereClause +
                "GROUP BY e.idNo, e.firstNameEnglish, e.lastNameEnglish, d.name, p.name, e.basicSalary, e.joinDate, e.status " +
                "ORDER BY d.name, EmployeeName " +
                "OFFSET ? ROWS FETCH NEXT ? ROWS ONLY";

        args.add(offset);
        args.add(size);

        return jdbcTemplate.queryForList(sql, args.toArray());
    }

    public List<Map<String, Object>> getExportEmployeeEvaluationReport(Long departmentId, String status, String startDate, String endDate) {
        List<Object> args = new ArrayList<>();
        
        List<Object> joinArgs = new ArrayList<>();
        String attendanceCondition = buildAttendanceCondition(startDate, endDate, joinArgs);
        
        List<Object> whereArgs = new ArrayList<>();
        String whereClause = buildWhereClause(departmentId, status, startDate, endDate, whereArgs);
        
        args.addAll(joinArgs);
        args.addAll(whereArgs);

        String sql = "SELECT " +
                "    e.idNo as EmployeeID, " +
                "    e.firstNameEnglish + ' ' + e.lastNameEnglish as EmployeeName, " +
                "    d.name as Department, " +
                "    p.name as Position, " +
                "    e.basicSalary as CurrentSalary, " +
                "    e.joinDate as JoinDate, " +
                "    e.status as Status, " +
                "    COUNT(a.id) as TotalAttendanceRecords, " +
                "    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as DaysPresent, " +
                "    SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) as DaysLate, " +
                "    SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as DaysAbsent " +
                "FROM Employees e WITH (NOLOCK) " +
                "LEFT JOIN Departments d WITH (NOLOCK) ON e.DepartmentId = d.id " +
                "LEFT JOIN Positions p WITH (NOLOCK) ON e.PositionId = p.id " +
                "LEFT JOIN Attendance a WITH (NOLOCK) " + attendanceCondition +
                whereClause +
                "GROUP BY e.idNo, e.firstNameEnglish, e.lastNameEnglish, d.name, p.name, e.basicSalary, e.joinDate, e.status " +
                "ORDER BY d.name, EmployeeName";

        return jdbcTemplate.queryForList(sql, args.toArray());
    }

    public long countEmployeeEvaluations(Long departmentId, String status, String startDate, String endDate) {
        // For count, we only need a simpler query. If we're grouping by employee, we just count distinct employees.
        List<Object> args = new ArrayList<>();
        
        List<Object> joinArgs = new ArrayList<>();
        String attendanceCondition = buildAttendanceCondition(startDate, endDate, joinArgs);
        
        List<Object> whereArgs = new ArrayList<>();
        String whereClause = buildWhereClause(departmentId, status, startDate, endDate, whereArgs);
        
        args.addAll(joinArgs);
        args.addAll(whereArgs);

        String sql = "SELECT COUNT(DISTINCT e.id) " +
                "FROM Employees e WITH (NOLOCK) " +
                "LEFT JOIN Departments d WITH (NOLOCK) ON e.DepartmentId = d.id " +
                "LEFT JOIN Attendance a WITH (NOLOCK) " + attendanceCondition +
                whereClause;

        Long count = jdbcTemplate.queryForObject(sql, Long.class, args.toArray());
        return count != null ? count : 0L;
    }
}

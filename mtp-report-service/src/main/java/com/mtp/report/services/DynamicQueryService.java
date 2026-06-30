package com.mtp.report.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.context.expression.MapAccessor;

@Service
public class DynamicQueryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private com.mtp.report.repositories.ExternalDataSourceRepository externalRepo;

    // Allowed internal tables
    private static final Map<String, List<String>> INTERNAL_SOURCES = new HashMap<>();

    static {
        // Table -> Allowed Columns
        INTERNAL_SOURCES.put("Employees", Arrays.asList("idNo", "firstNameEnglish", "lastNameEnglish", "gender",
                "basicSalary", "joinDate", "status"));
        INTERNAL_SOURCES.put("Departments", Arrays.asList("name", "description"));
        INTERNAL_SOURCES.put("Positions", Arrays.asList("name", "level"));
        INTERNAL_SOURCES.put("Attendance", Arrays.asList("clockIn", "clockOut", "status"));
    }

    public Map<String, List<String>> getMetadata() {
        Map<String, List<String>> allSources = new HashMap<>(INTERNAL_SOURCES);
        try {
            for (com.mtp.report.models.ExternalDataSource ext : externalRepo.findAll()) {
                if (ext.getColumnsJson() != null) {
                    List<String> cols = new com.fasterxml.jackson.databind.ObjectMapper()
                            .readValue(ext.getColumnsJson(), List.class);
                    allSources.put(ext.getName(), cols);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return allSources;
    }

    public Map<String, Object> executePreviewQuery(Map<String, Object> queryPayload) {
        // payload format:
        // {
        // "source": "Employees",
        // "fields": ["firstNameEnglish", "status"],
        // "filters": [ { "field": "status", "operator": "=", "value": "Active" } ]
        // }

        String source = (String) queryPayload.get("source");
        Map<String, List<String>> allSources = getMetadata();

        if (source == null || !allSources.containsKey(source)) {
            throw new IllegalArgumentException("Invalid or unauthorized data source: " + source);
        }

        List<String> requestedFields = (List<String>) queryPayload.get("fields");
        if (requestedFields == null || requestedFields.isEmpty()) {
            throw new IllegalArgumentException("No fields selected for query.");
        }

        // Validate fields
        List<String> allowedFields = allSources.get(source);
        for (String field : requestedFields) {
            if (!allowedFields.contains(field)) {
                throw new IllegalArgumentException("Invalid or unauthorized field: " + field);
            }
        }

        // Aggregation logic
        String groupBy = (String) queryPayload.get("groupBy");
        List<Map<String, String>> aggregations = (List<Map<String, String>>) queryPayload.get("aggregations");
        boolean isAggregated = (groupBy != null && !groupBy.isEmpty())
                || (aggregations != null && !aggregations.isEmpty());

        // Build SELECT
        StringBuilder sql = new StringBuilder("SELECT ");
        List<String> selectParts = new ArrayList<>();

        if (isAggregated) {
            selectParts.addAll(requestedFields);
            if (aggregations != null) {
                for (Map<String, String> agg : aggregations) {
                    String func = agg.get("function").toUpperCase();
                    String field = agg.get("field");
                    if (!allowedFields.contains(field))
                        throw new IllegalArgumentException("Invalid aggregation field: " + field);
                    if (!Arrays.asList("COUNT", "SUM", "AVG", "MIN", "MAX").contains(func))
                        throw new IllegalArgumentException("Invalid function: " + func);
                    
                    String overClause = (groupBy != null && !groupBy.isEmpty()) ? " OVER(PARTITION BY " + groupBy + ")" : " OVER()";
                    
                    String aggExpression;
                    if (func.equals("SUM") || func.equals("AVG")) {
                        aggExpression = func + "(TRY_CAST(" + field + " AS FLOAT))" + overClause;
                    } else {
                        aggExpression = func + "(" + field + ")" + overClause;
                    }
                    selectParts.add(aggExpression + " AS " + field + "_" + func.toLowerCase());
                }
            }
        } else {
            selectParts.addAll(requestedFields);
        }

        sql.append(String.join(", ", selectParts));

        // Resolve Target Table
        String targetTable = source;
        com.mtp.report.models.ExternalDataSource extDb = null;
        if (!INTERNAL_SOURCES.containsKey(source)) {
            com.mtp.report.models.ExternalDataSource ext = externalRepo.findAll().stream()
                    .filter(e -> e.getName().equals(source)).findFirst().orElse(null);
            if (ext != null) {
                targetTable = ext.getTableName();
                if ("JDBC".equalsIgnoreCase(ext.getType())) {
                    extDb = ext;
                }
            }
        }

        sql.append(" FROM ").append(targetTable).append(" WITH (NOLOCK) ");

        List<Object> args = new ArrayList<>();

        // Build WHERE
        List<Map<String, String>> filters = (List<Map<String, String>>) queryPayload.get("filters");
        if (filters != null && !filters.isEmpty()) {
            sql.append(" WHERE 1=1 ");
            for (Map<String, String> filter : filters) {
                String field = filter.get("field");
                String operator = filter.get("operator");
                String value = filter.get("value");

                if (!allowedFields.contains(field))
                    continue;

                // Safe operators
                if (operator.equals("=") || operator.equals("!=")) {
                    sql.append(" AND ").append(field).append(" ").append(operator).append(" ? ");
                    args.add(value);
                } else if (operator.equals(">") || operator.equals("<") || operator.equals(">=") || operator.equals("<=")) {
                    sql.append(" AND TRY_CAST(").append(field).append(" AS FLOAT) ").append(operator).append(" ? ");
                    try {
                        args.add(Double.parseDouble(value));
                    } catch (NumberFormatException e) {
                        args.add(0.0); // Fallback if user types invalid number in filter
                    }
                } else if (operator.equalsIgnoreCase("LIKE")) {
                    sql.append(" AND ").append(field).append(" LIKE ? ");
                    args.add("%" + value + "%");
                }
            }
        }

        // Build GROUP BY is no longer needed since we use OVER() window functions!

        // Pagination
        int page = queryPayload.containsKey("page") ? (int) queryPayload.get("page") : 0;
        int size = queryPayload.containsKey("size") ? (int) queryPayload.get("size") : 50;
        int offset = page * size;

        // For generic table, we need an ORDER BY before OFFSET
        sql.append(" ORDER BY ").append(requestedFields.get(0)).append(" DESC ");

        sql.append(" OFFSET ? ROWS FETCH NEXT ? ROWS ONLY");
        args.add(offset);
        args.add(size);

        JdbcTemplate targetJdbcTemplate = jdbcTemplate;
        if (extDb != null) {
            org.springframework.jdbc.datasource.DriverManagerDataSource dataSource = new org.springframework.jdbc.datasource.DriverManagerDataSource();
            dataSource.setUrl(extDb.getJdbcUrl());
            dataSource.setUsername(extDb.getUsername());
            dataSource.setPassword(extDb.getPassword());
            // Assume SQL Server or MySQL based on URL
            if (extDb.getJdbcUrl().contains("sqlserver"))
                dataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            else
                dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
            targetJdbcTemplate = new JdbcTemplate(dataSource);

            // Note: WITH (NOLOCK) and OFFSET/FETCH NEXT are SQL Server specific.
            // A full BI engine would abstract dialect generation. We will assume SQL Server
            // for now.
        }

        List<Map<String, Object>> content = targetJdbcTemplate.queryForList(sql.toString(), args.toArray());

        // --- PHASE 1: CUSTOM FIELDS (In-Memory Processing) ---
        List<Map<String, String>> customFields = (List<Map<String, String>>) queryPayload.get("customFields");
        if (customFields != null && !customFields.isEmpty()) {
            ExpressionParser parser = new SpelExpressionParser();

            // Convert to a mutable list of maps so we can append custom fields
            List<Map<String, Object>> mutableContent = new ArrayList<>();
            for (Map<String, Object> row : content) {
                // queryForList returns unmodifiable or case-insensitive maps, wrap in a
                // standard mutable Map, and safely convert string numbers to double for SpEL
                Map<String, Object> mutableRow = new HashMap<>();
                for (Map.Entry<String, Object> entry : row.entrySet()) {
                    Object val = entry.getValue();
                    if (val instanceof String) {
                        try {
                            val = Double.parseDouble(((String) val).trim());
                        } catch (NumberFormatException ex) {
                            // Keep as string if it's not a valid number
                        }
                    }
                    mutableRow.put(entry.getKey(), val);
                }

                StandardEvaluationContext context = new StandardEvaluationContext(mutableRow);
                context.addPropertyAccessor(new MapAccessor());

                for (Map<String, String> cf : customFields) {
                    String name = cf.get("name");
                    String type = cf.get("type");
                    String formula = cf.get("formula");

                    if ("blank".equalsIgnoreCase(type)) {
                        mutableRow.put(name, "");
                    } else if ("calculated".equalsIgnoreCase(type) && formula != null && !formula.trim().isEmpty()) {
                        try {
                            Object val = parser.parseExpression(formula).getValue(context);
                            mutableRow.put(name, val);
                        } catch (Exception e) {
                            mutableRow.put(name, "Error");
                            System.err
                                    .println("SpEL Evaluation Error for formula [" + formula + "]: " + e.getMessage());
                        }
                    }
                }
                mutableContent.add(mutableRow);
            }
            content = mutableContent;
        }
        // -----------------------------------------------------

        Map<String, Object> response = new HashMap<>();
        System.out.println("DEBUG SQL: " + sql.toString());
        if (!content.isEmpty()) {
            System.out.println("DEBUG KEYS: " + content.get(0).keySet());
        }
        response.put("content", content);
        response.put("currentPage", page);
        response.put("size", size);
        return response;
    }
}

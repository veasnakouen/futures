package com.mtp.report.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.expression.MapAccessor;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.SimpleEvaluationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class DynamicQueryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private com.mtp.report.repositories.ExternalDataSourceRepository externalRepo;

    private static final ObjectMapper MAPPER = new ObjectMapper();

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
                    List<String> cols = MAPPER.readValue(ext.getColumnsJson(), List.class);
                    allSources.put(ext.getName(), cols);
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse external data source metadata JSON", e);
        }
        return allSources;
    }

    public Map<String, Object> executePreviewQuery(Map<String, Object> queryPayload) {
        String source = (String) queryPayload.get("source");
        Map<String, List<String>> allSources = getMetadata();

        if (source == null || !allSources.containsKey(source)) {
            throw new IllegalArgumentException("Invalid data source: " + source);
        }

        List<String> allowedCols = allSources.get(source);
        List<String> requestedFields = (List<String>) queryPayload.get("fields");

        if (requestedFields == null || requestedFields.isEmpty()) {
            requestedFields = allowedCols;
        } else {
            for (String f : requestedFields) {
                if (!allowedCols.contains(f)) {
                    throw new IllegalArgumentException("Field not allowed: " + f);
                }
            }
        }

        // Handle Pagination
        int page = 1;
        int size = 50;
        if (queryPayload.containsKey("page")) {
            page = Integer.parseInt(queryPayload.get("page").toString());
        }
        if (queryPayload.containsKey("size")) {
            size = Integer.parseInt(queryPayload.get("size").toString());
        }
        int offset = (page - 1) * size;

        // Build SELECT
        StringBuilder sql = new StringBuilder("SELECT ");

        // Check Aggregations / Group By
        List<String> groupBy = (List<String>) queryPayload.get("groupBy");
        List<Map<String, String>> aggregations = (List<Map<String, String>>) queryPayload.get("aggregations");

        if (aggregations != null && !aggregations.isEmpty()) {
            List<String> selectParts = new ArrayList<>();
            for (String f : requestedFields) {
                selectParts.add(f);
            }
            for (Map<String, String> agg : aggregations) {
                String func = agg.get("func");
                String field = agg.get("field");
                String alias = agg.get("alias");
                if (allowedCols.contains(field)) {
                    if (!Arrays.asList("COUNT", "SUM", "AVG", "MIN", "MAX").contains(func)) {
                        throw new IllegalArgumentException("Invalid function: " + func);
                    }
                    String overClause = (groupBy != null && !groupBy.isEmpty()) ? " OVER(PARTITION BY " + String.join(", ", groupBy) + ")" : " OVER()";
                    String aggExpression;
                    if (func.equals("SUM") || func.equals("AVG")) {
                        aggExpression = func + "(TRY_CAST(" + field + " AS FLOAT))" + overClause;
                    } else {
                        aggExpression = func + "(" + field + ")" + overClause;
                    }
                    selectParts.add(aggExpression + " AS " + (alias != null ? alias : (func + "_" + field)));
                }
            }
            sql.append(String.join(", ", selectParts));
        } else {
            sql.append(String.join(", ", requestedFields));
        }

        // Determine Table or External Connection
        String targetTable = source;
        JdbcTemplate targetJdbcTemplate = this.jdbcTemplate;

        if (!INTERNAL_SOURCES.containsKey(source)) {
            for (com.mtp.report.models.ExternalDataSource ext : externalRepo.findAll()) {
                if (ext.getName().equals(source)) {
                    targetTable = ext.getTableName();
                    org.springframework.jdbc.datasource.DriverManagerDataSource dataSource = new org.springframework.jdbc.datasource.DriverManagerDataSource();
                    dataSource.setUrl(ext.getJdbcUrl());
                    dataSource.setUsername(ext.getUsername());
                    dataSource.setPassword(ext.getPassword());
                    if (ext.getJdbcUrl().contains("sqlserver")) {
                        dataSource.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
                    } else {
                        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
                    }
                    targetJdbcTemplate = new JdbcTemplate(dataSource);
                }
            }
        }

        sql.append(" FROM ").append(targetTable).append(" ");

        List<Object> args = new ArrayList<>();

        // Build WHERE
        List<Map<String, String>> filters = (List<Map<String, String>>) queryPayload.get("filters");
        if (filters != null && !filters.isEmpty()) {
            sql.append(" WHERE 1=1 ");
            for (Map<String, String> filter : filters) {
                String field = filter.get("field");
                String operator = filter.get("operator");
                String value = filter.get("value");

                if (field != null && allowedCols.contains(field) && operator != null && value != null) {
                    if (operator.equals("=") || operator.equals("!=")) {
                        sql.append(" AND ").append(field).append(" ").append(operator).append(" ? ");
                        args.add(value);
                    } else if (operator.equals(">") || operator.equals("<") || operator.equals(">=") || operator.equals("<=")) {
                        sql.append(" AND TRY_CAST(").append(field).append(" AS FLOAT) ").append(operator).append(" ? ");
                        try {
                            args.add(Double.parseDouble(value));
                        } catch (NumberFormatException e) {
                            args.add(0);
                        }
                    } else if (operator.equalsIgnoreCase("LIKE")) {
                        sql.append(" AND ").append(field).append(" LIKE ? ");
                        args.add("%" + value + "%");
                    }
                }
            }
        }

        // Build ORDER BY & OFFSET FETCH
        String sortBy = (String) queryPayload.get("sortBy");
        String sortOrder = (String) queryPayload.get("sortOrder");
        if (sortBy != null && allowedCols.contains(sortBy)) {
            sql.append(" ORDER BY ").append(sortBy).append(" ").append("DESC".equalsIgnoreCase(sortOrder) ? "DESC" : "ASC");
        } else {
            sql.append(" ORDER BY ").append(requestedFields.get(0)).append(" ASC");
        }

        sql.append(" OFFSET ? ROWS FETCH NEXT ? ROWS ONLY");
        args.add(offset);
        args.add(size);

        List<Map<String, Object>> content = targetJdbcTemplate.queryForList(sql.toString(), args.toArray());

        // --- PHASE 1: CUSTOM FIELDS (Hardened & Sandboxed SpEL Processing) ---
        List<Map<String, String>> customFields = (List<Map<String, String>>) queryPayload.get("customFields");
        if (customFields != null && !customFields.isEmpty()) {
            ExpressionParser parser = new SpelExpressionParser();

            List<Map<String, Object>> mutableContent = new ArrayList<>();
            for (Map<String, Object> row : content) {
                Map<String, Object> mutableRow = new HashMap<>();
                for (Map.Entry<String, Object> entry : row.entrySet()) {
                    Object val = entry.getValue();
                    if (val instanceof String) {
                        try {
                            val = Double.parseDouble(((String) val).trim());
                        } catch (NumberFormatException ignored) {
                        }
                    }
                    mutableRow.put(entry.getKey(), val);
                }

                EvaluationContext context = SimpleEvaluationContext.forPropertyAccessors(new MapAccessor()).build();

                for (Map<String, String> cf : customFields) {
                    String name = cf.get("name");
                    String type = cf.get("type");
                    String formula = cf.get("formula");

                    if ("blank".equalsIgnoreCase(type)) {
                        mutableRow.put(name, "");
                    } else if ("calculated".equalsIgnoreCase(type) && formula != null && !formula.trim().isEmpty()) {
                        if (!isSafeFormula(formula)) {
                            log.warn("Blocked potentially malicious SpEL formula: [{}]", formula);
                            mutableRow.put(name, "Access Denied");
                        } else {
                            try {
                                Object val = parser.parseExpression(formula).getValue(context, mutableRow);
                                mutableRow.put(name, val);
                            } catch (Exception e) {
                                log.warn("SpEL Evaluation Error for formula [{}]: {}", formula, e.getMessage());
                                mutableRow.put(name, "Error");
                            }
                        }
                    }
                }
                mutableContent.add(mutableRow);
            }
            content = mutableContent;
        }

        Map<String, Object> response = new HashMap<>();
        log.debug("Executed Dynamic Query SQL: {}", sql);
        response.put("content", content);
        response.put("currentPage", page);
        response.put("size", size);
        return response;
    }

    private boolean isSafeFormula(String formula) {
        if (formula == null || formula.trim().isEmpty()) return true;
        String lower = formula.toLowerCase();
        return !lower.contains("t(") &&
               !lower.contains("java.") &&
               !lower.contains("javax.") &&
               !lower.contains("runtime") &&
               !lower.contains("processbuilder") &&
               !lower.contains("class") &&
               !lower.contains("exec");
    }
}

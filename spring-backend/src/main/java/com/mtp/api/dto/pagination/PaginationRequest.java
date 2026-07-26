package com.mtp.api.dto.pagination;

import com.mtp.api.util.SortUtils;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

/**
 * Standardized Pagination Request DTO for API Query Operations.
 * Enforces 1-based page index translation, bounds page size, and validates sorting.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequest {

    public static final int DEFAULT_PAGE = 1;
    public static final int DEFAULT_SIZE = 20;
    public static final int MAX_SIZE = 100;
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_ORDER = "DESC";

    @Min(value = 1, message = "Page number must be greater than 0")
    @Builder.Default
    private int page = DEFAULT_PAGE;

    @Min(value = 1, message = "Page size must be at least 1")
    @Max(value = MAX_SIZE, message = "Page size cannot exceed " + MAX_SIZE)
    @Builder.Default
    private int size = DEFAULT_SIZE;

    @Builder.Default
    private String sortBy = DEFAULT_SORT_BY;

    @Builder.Default
    private String sortOrder = DEFAULT_SORT_ORDER;

    /**
     * Converts 1-based API page number to 0-based Spring Data Pageable instance.
     */
    public Pageable toPageable() {
        return toPageable(null);
    }

    /**
     * Converts 1-based API page number to 0-based Spring Data Pageable instance
     * with field whitelist security validation.
     *
     * @param allowedFields Set of permitted entity property names for sorting
     * @return Validated Spring Data Pageable instance
     */
    public Pageable toPageable(Set<String> allowedFields) {
        int safePage = Math.max(1, page) - 1; // Translate 1-based UI index to 0-based Spring Data index
        int safeSize = (size <= 0) ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);
        
        String safeSortBy = (sortBy == null || sortBy.trim().isEmpty()) ? DEFAULT_SORT_BY : sortBy.trim();
        if (allowedFields != null && !allowedFields.isEmpty()) {
            safeSortBy = SortUtils.sanitizeSortField(safeSortBy, allowedFields, DEFAULT_SORT_BY);
        }

        Sort.Direction direction = "ASC".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(safePage, safeSize, Sort.by(direction, safeSortBy));
    }
}

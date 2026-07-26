package com.mtp.api.dto.pagination;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.Collections;
import java.util.List;

/**
 * Enterprise Paged Response Wrapper DTO.
 * Eliminates raw Spring Data internal structure leaks and standardizes UI metadata.
 *
 * @param <T> Content element type
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {

    private List<T> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean isFirst;
    private boolean isLast;
    private boolean hasNext;
    private boolean hasPrevious;
    private String sortBy;
    private String sortOrder;

    /**
     * Constructs a PagedResponse from a Spring Data Page object.
     * Automatically translates internal 0-indexed page index back to 1-indexed UI page number.
     *
     * @param page Spring Data Page instance
     * @param sortBy Active sort property name
     * @param sortOrder Active sort direction ("ASC" | "DESC")
     * @return Standardized PagedResponse instance
     */
    public static <T> PagedResponse<T> from(Page<T> page, String sortBy, String sortOrder) {
        if (page == null) {
            return PagedResponse.<T>builder()
                    .content(Collections.emptyList())
                    .pageNumber(1)
                    .pageSize(20)
                    .totalElements(0)
                    .totalPages(0)
                    .isFirst(true)
                    .isLast(true)
                    .hasNext(false)
                    .hasPrevious(false)
                    .sortBy(sortBy)
                    .sortOrder(sortOrder)
                    .build();
        }

        return PagedResponse.<T>builder()
                .content(page.getContent())
                .pageNumber(page.getNumber() + 1) // Convert 0-indexed Spring Data page back to 1-indexed UI page
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .sortBy(sortBy)
                .sortOrder(sortOrder)
                .build();
    }

    public static <T> PagedResponse<T> from(Page<T> page) {
        String sortBy = "id";
        String sortOrder = "DESC";

        if (page != null && page.getSort().isSorted()) {
            var order = page.getSort().iterator().next();
            sortBy = order.getProperty();
            sortOrder = order.getDirection().name();
        }

        return from(page, sortBy, sortOrder);
    }
}

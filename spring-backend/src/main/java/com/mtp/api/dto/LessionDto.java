package com.mtp.api.dto;

import lombok.Data;

@Data
public class LessionDto {
    private Integer id;
    private String name;
    private Integer subjectId;
    private String subjectName;
}

package com.mtp.school.cqrs.dto;

import com.mtp.school.models.RelationshipType;
import lombok.Data;

import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class StudentParentDto extends ParentQueryResultDto {
    private RelationshipType relationshipType;
}

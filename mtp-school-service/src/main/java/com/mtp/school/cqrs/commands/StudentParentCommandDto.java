package com.mtp.school.cqrs.commands;

import com.mtp.school.models.RelationshipType;
import lombok.Data;

@Data
public class StudentParentCommandDto {
    private String parentId;
    private RelationshipType relationshipType;
}
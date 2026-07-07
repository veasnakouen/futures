package com.mtp.school.cqrs.commands;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UpdateBranchCommand extends CreateBranchCommand {
    private String id;
}

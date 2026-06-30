package com.mtp.stock.cqrs.commands;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeleteAssetCommand {
    private Integer id;
}

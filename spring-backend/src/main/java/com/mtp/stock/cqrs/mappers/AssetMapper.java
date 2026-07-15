package com.mtp.stock.cqrs.mappers;

import com.mtp.stock.cqrs.commands.CreateAssetCommand;
import com.mtp.stock.cqrs.dto.AssetQueryResultDto;
import com.mtp.stock.models.CompanyAsset;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE)
public interface AssetMapper {

    AssetMapper INSTANCE = Mappers.getMapper(AssetMapper.class);

    // Command to Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "assignedDate", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    CompanyAsset toEntity(CreateAssetCommand command);

    // Entity to Query Result DTO
    @Mapping(source = "employee.id", target = "employeeId")
    @Mapping(target = "employeeName", expression = "java(entity.getEmployee() != null ? entity.getEmployee().getFirstName() + \" \" + entity.getEmployee().getLastName() : null)")
    AssetQueryResultDto toDto(CompanyAsset entity);
}

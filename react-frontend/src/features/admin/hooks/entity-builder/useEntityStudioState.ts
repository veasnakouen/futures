import { useState, useEffect } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";

export interface CustomEntity {
  id: string;
  entityKey: string;
  entityLabel: string;
  tableName: string;
  idStrategy: string;
  columnType: string;
  indexes: string;
  category: string;
  iconName: string;
  description: string;
  createdAt?: string;
}

export const INITIAL_MOCK_ENTITIES: CustomEntity[] = [
  {
    id: "ent-users",
    entityKey: "SYSTEM_USER",
    entityLabel: "System Security User",
    tableName: "AspNetUsers",
    idStrategy: "@Id @GeneratedValue(UUID)",
    columnType: "nvarchar(128)",
    indexes: "idx_user_username, idx_user_email",
    category: "HR",
    iconName: "Users",
    description: "Core authentication entity mapping AspNetUsers database table with custom attributes.",
  },
  {
    id: "1",
    entityKey: "EQUIPMENT_TRACKER",
    entityLabel: "Medical Equipment Tracker",
    tableName: "tb_medical_equipment",
    idStrategy: "@Id @GeneratedValue(UUID)",
    columnType: "nvarchar(128)",
    indexes: "idx_equip_serial, idx_equip_status",
    category: "CLINIC",
    iconName: "Stethoscope",
    description: "Tracks hospital machinery, warranty dates, and assigned clinic patients.",
  },
  {
    id: "2",
    entityKey: "VEHICLE_LOG",
    entityLabel: "Vehicle Fleet Maintenance",
    tableName: "tb_vehicle_log",
    idStrategy: "@Id @GeneratedValue(IDENTITY)",
    columnType: "varchar(255)",
    indexes: "idx_vehicle_plate",
    category: "GENERAL",
    iconName: "Car",
    description: "Logs organization transport vehicles, fuel usage, and driver staff assignments.",
  },
];

export function useEntityStudioState() {
  const [entities, setEntities] = useState<CustomEntity[]>(INITIAL_MOCK_ENTITIES);
  const [selectedEntityKey, setSelectedEntityKey] = useState<string>("EQUIPMENT_TRACKER");
  const [loading, setLoading] = useState(false);
  const [showEntityModal, setShowEntityModal] = useState(false);

  const [newEntity, setNewEntity] = useState({
    entityLabel: "",
    entityKey: "",
    className: "User",
    packageName: "com.mtp.api.models",
    tableName: "AspNetUsers",
    idStrategy: "@Id @GeneratedValue(UUID)",
    columnType: "nvarchar(128)",
    indexes: "idx_user_username, idx_user_email",
    category: "CLINIC",
    iconName: "Boxes",
    description: "",
  });

  const [entityStudioTab, setEntityStudioTab] = useState<"DIRECTIVES" | "FIELDS" | "METHODS" | "CODE_PREVIEW">("DIRECTIVES");
  const [isCustomCodeOverride, setIsCustomCodeOverride] = useState(false);
  const [customJavaCode, setCustomJavaCode] = useState("");
  const [entityFields, setEntityFields] = useState<Array<{ name: string; type: string; isNotNull?: boolean; isUnique?: boolean }>>([
    { name: "userName", type: "String", isNotNull: true, isUnique: true },
    { name: "email", type: "String", isNotNull: true, isUnique: true },
    { name: "password", type: "String", isNotNull: true },
    { name: "isActive", type: "Boolean" },
  ]);

  const [entityMethods, setEntityMethods] = useState<Array<{ name: string; signature: string; body: string; annotation?: string; enabled: boolean }>>([
    {
      name: "Null-safe isActive Getter",
      signature: "public Boolean isActive()",
      body: "return isActive != null ? isActive : true;",
      enabled: true,
    },
    {
      name: "setActive Setter",
      signature: "public void setActive(Boolean active)",
      body: "this.isActive = active;",
      enabled: true,
    },
    {
      name: "PrePersist Creation Timestamp",
      signature: "protected void onCreate()",
      body: "if (this.createdAt == null) {\n        this.createdAt = LocalDateTime.now();\n    }",
      annotation: "@PrePersist",
      enabled: true,
    },
  ]);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/dynamic-entities");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setEntities(res.data);
      }
    } catch (err) {
      console.warn("Using fallback dynamic entities state", err);
    } finally {
      setLoading(false);
    }
  };

  const applyPresetTemplate = (preset: "USER" | "EQUIPMENT" | "VEHICLE") => {
    if (preset === "USER") {
      setNewEntity({
        entityLabel: "System Security User",
        entityKey: "SYSTEM_USER",
        className: "User",
        packageName: "com.mtp.api.models",
        tableName: "AspNetUsers",
        idStrategy: "@Id @GeneratedValue(UUID)",
        columnType: "nvarchar(128)",
        indexes: "idx_user_username, idx_user_email",
        category: "HR",
        iconName: "Users",
        description: "Spring Boot Security user model mapping AspNetUsers DB table.",
      });
      setEntityFields([
        { name: "userName", type: "String", isNotNull: true, isUnique: true },
        { name: "email", type: "String", isNotNull: true, isUnique: true },
        { name: "password", type: "String", isNotNull: true },
        { name: "isActive", type: "Boolean" },
        { name: "createdAt", type: "LocalDateTime" },
      ]);
      setEntityMethods([
        {
          name: "Null-safe isActive Getter",
          signature: "public Boolean isActive()",
          body: "return isActive != null ? isActive : true;",
          enabled: true,
        },
        {
          name: "setActive Setter",
          signature: "public void setActive(Boolean active)",
          body: "this.isActive = active;",
          enabled: true,
        },
        {
          name: "PrePersist Creation Timestamp",
          signature: "protected void onCreate()",
          body: "if (this.createdAt == null) {\n        this.createdAt = LocalDateTime.now();\n    }",
          annotation: "@PrePersist",
          enabled: true,
        },
      ]);
      toast.success("Loaded AspNetUsers Spring Boot template!");
    } else if (preset === "EQUIPMENT") {
      setNewEntity({
        entityLabel: "Medical Equipment",
        entityKey: "EQUIPMENT_TRACKER",
        className: "MedicalEquipment",
        packageName: "com.mtp.api.models",
        tableName: "tb_medical_equipment",
        idStrategy: "@Id @GeneratedValue(UUID)",
        columnType: "nvarchar(128)",
        indexes: "idx_equip_serial, idx_equip_status",
        category: "CLINIC",
        iconName: "Stethoscope",
        description: "Tracks hospital machinery, warranty dates, and clinic patient assignments.",
      });
      setEntityFields([
        { name: "equipmentName", type: "String", isNotNull: true },
        { name: "serialNumber", type: "String", isNotNull: true, isUnique: true },
        { name: "cost", type: "BigDecimal" },
        { name: "purchaseDate", type: "LocalDateTime" },
        { name: "status", type: "String" },
      ]);
      setEntityMethods([
        {
          name: "PrePersist Creation Callback",
          signature: "protected void onCreate()",
          body: "this.purchaseDate = LocalDateTime.now();",
          annotation: "@PrePersist",
          enabled: true,
        },
      ]);
      toast.success("Loaded Medical Equipment Spring Boot template!");
    } else if (preset === "VEHICLE") {
      setNewEntity({
        entityLabel: "Vehicle Fleet Log",
        entityKey: "VEHICLE_LOG",
        className: "VehicleLog",
        packageName: "com.mtp.api.models",
        tableName: "tb_vehicle_log",
        idStrategy: "@Id @GeneratedValue(IDENTITY)",
        columnType: "varchar(255)",
        indexes: "idx_vehicle_plate",
        category: "GENERAL",
        iconName: "Car",
        description: "Logs organization transport vehicles, fuel usage, and driver staff assignments.",
      });
      setEntityFields([
        { name: "plateNumber", type: "String", isNotNull: true, isUnique: true },
        { name: "driverName", type: "String" },
        { name: "fuelLevel", type: "BigDecimal" },
        { name: "status", type: "String" },
      ]);
      setEntityMethods([]);
      toast.success("Loaded Vehicle Fleet Log template!");
    }
  };

  const handleAddFieldToEntity = () => {
    setEntityFields([...entityFields, { name: "customField" + (entityFields.length + 1), type: "String" }]);
  };

  const handleRemoveField = (index: number) => {
    setEntityFields(entityFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: string, val: any) => {
    const updated = [...entityFields];
    updated[index] = { ...updated[index], [key]: val };
    setEntityFields(updated);
  };

  const handleAddMethod = () => {
    setEntityMethods([
      ...entityMethods,
      {
        name: "Custom Method " + (entityMethods.length + 1),
        signature: "public String getFormattedSummary()",
        body: 'return "Summary: " + this.id;',
        enabled: true,
      },
    ]);
  };

  const handleRemoveMethod = (index: number) => {
    setEntityMethods(entityMethods.filter((_, i) => i !== index));
  };

  const handleMethodChange = (index: number, key: string, val: any) => {
    const updated = [...entityMethods];
    updated[index] = { ...updated[index], [key]: val };
    setEntityMethods(updated);
  };

  const generatedJavaCode = `package ${newEntity.packageName || "com.mtp.api.models"};

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@Table(name = "${newEntity.tableName || "tb_" + (newEntity.className || "Entity").toLowerCase()}"${
    newEntity.indexes
      ? `, indexes = {\n${newEntity.indexes
          .split(",")
          .map((idx) => `        @Index(name = "${idx.trim()}", columnList = "${idx.trim().replace("idx_", "").replace(/^[a-z]+_/, "")}")`)
          .join(",\n")}\n}`
      : ""
  })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ${newEntity.className || "CustomEntity"} {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "Id", length = 128, columnDefinition = "${newEntity.columnType || "nvarchar(128)"}")
    private String id;
${entityFields
  .map((f) => {
    const annotations: string[] = [];
    if (f.isNotNull) annotations.push("    @NotNull");
    if (f.isUnique) annotations.push(`    @Column(name = "${f.name}", unique = true)`);
    else annotations.push(`    @Column(name = "${f.name}")`);
    return `\n${annotations.join("\n")}\n    private ${f.type} ${f.name};`;
  })
  .join("")}
${entityMethods
  .filter((m) => m.enabled)
  .map(
    (m) => `\n    ${m.annotation ? m.annotation + "\n    " : ""}${m.signature} {\n        ${m.body.replace(/\n/g, "\n        ")}\n    }`
  )
  .join("")}
}`;

  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntity.entityLabel.trim()) {
      toast.error("Entity Label is required");
      return;
    }
    const autoKey = newEntity.entityKey.trim()
      ? newEntity.entityKey.toUpperCase().replace(/[^A-Z0-9_]/g, "_")
      : newEntity.entityLabel.toUpperCase().replace(/[^A-Z0-9_]/g, "_");

    const entityPayload: CustomEntity = {
      id: "ent-" + Date.now(),
      entityKey: autoKey,
      entityLabel: newEntity.entityLabel,
      tableName: newEntity.tableName.trim() || `tb_${autoKey.toLowerCase()}`,
      idStrategy: newEntity.idStrategy,
      columnType: newEntity.columnType || "nvarchar(128)",
      indexes: newEntity.indexes || `idx_${autoKey.toLowerCase()}_id`,
      category: newEntity.category,
      iconName: newEntity.iconName,
      description: newEntity.description,
      createdAt: new Date().toISOString(),
    };

    try {
      await api.post("/admin/dynamic-entities", entityPayload);
    } catch (err) {
      console.warn("Saved entity locally", err);
    }

    setEntities([entityPayload, ...entities]);
    setSelectedEntityKey(autoKey);
    setShowEntityModal(false);
    setNewEntity({
      entityLabel: "",
      entityKey: "",
      className: "User",
      packageName: "com.mtp.api.models",
      tableName: "",
      idStrategy: "@Id @GeneratedValue(UUID)",
      columnType: "nvarchar(128)",
      indexes: "",
      category: "CLINIC",
      iconName: "Boxes",
      description: "",
    });
    toast.success(`Dynamic Entity "${entityPayload.entityLabel}" created with JPA Annotations!`);
  };

  return {
    entities,
    setEntities,
    selectedEntityKey,
    setSelectedEntityKey,
    loading,
    showEntityModal,
    setShowEntityModal,
    newEntity,
    setNewEntity,
    entityStudioTab,
    setEntityStudioTab,
    isCustomCodeOverride,
    setIsCustomCodeOverride,
    customJavaCode,
    setCustomJavaCode,
    entityFields,
    setEntityFields,
    entityMethods,
    setEntityMethods,
    applyPresetTemplate,
    handleAddFieldToEntity,
    handleRemoveField,
    handleFieldChange,
    handleAddMethod,
    handleRemoveMethod,
    handleMethodChange,
    generatedJavaCode,
    handleCreateEntity,
  };
}

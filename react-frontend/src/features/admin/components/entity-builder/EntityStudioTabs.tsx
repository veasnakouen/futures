import React from "react";
import { Label, TextInput, Select } from "@/lib/flowbite-compat";
import { Boxes, Sparkles, Plus, Trash2, Users, Stethoscope, GraduationCap, Receipt, Package } from "lucide-react";

interface Props {
  state: any;
}

export default function EntityStudioTabs({ state }: Props) {
  const {
    newEntity,
    setNewEntity,
    entityStudioTab,
    applyPresetTemplate,
    entityFields,
    handleAddFieldToEntity,
    handleRemoveField,
    handleFieldChange,
    entityMethods,
    handleAddMethod,
    handleRemoveMethod,
    handleMethodChange,
    generatedJavaCode,
    isCustomCodeOverride,
    setIsCustomCodeOverride,
    customJavaCode,
    setCustomJavaCode,
  } = state;

  return (
    <div className="space-y-4">
      {/* Tab 1: JPA Directives */}
      {entityStudioTab === "DIRECTIVES" && (
        <div className="space-y-5 animate-fade-in">
          {/* Card A: Entity & Table Naming */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-blue-50/30 dark:from-gray-800/60 dark:to-gray-800/80 border border-gray-100 dark:border-gray-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1.5">
                <Boxes size={15} /> 1. Entity & Database Table Naming
              </h4>
              <span className="text-[10px] text-gray-400 font-bold bg-white dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">
                ⚡ Auto-Derives Class & Table Names
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="entityLabel" value="Entity Display Name" className="font-bold text-xs" />
                  <span className="text-[10px] text-gray-400">UI Menu Title</span>
                </div>
                <TextInput
                  id="entityLabel"
                  required
                  placeholder="e.g. Medical Stock"
                  value={newEntity.entityLabel}
                  onChange={(e) => {
                    const val = e.target.value;
                    const pascalCase = val
                      .replace(/[^a-zA-Z0-9\s]/g, "")
                      .split(/\s+/)
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join("");
                    const snakeCase = val.trim()
                      ? "tb_" + val.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_")
                      : "";

                    setNewEntity({
                      ...newEntity,
                      entityLabel: val,
                      className: pascalCase || newEntity.className,
                      tableName: snakeCase || newEntity.tableName,
                    });
                  }}
                  className="[&_input]:rounded-xl [&_input]:py-2.5 font-bold"
                />
                <p className="text-[10px] text-gray-400 mt-1">Human-readable label shown in navigation menus and record tables.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="className" value="Java Class Name (@Entity)" className="font-bold text-xs" />
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">.java POJO</span>
                </div>
                <TextInput
                  id="className"
                  required
                  placeholder="e.g. MedicalStock"
                  value={newEntity.className}
                  onChange={(e) => setNewEntity({ ...newEntity, className: e.target.value })}
                  className="[&_input]:rounded-xl [&_input]:py-2.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400"
                />
                <p className="text-[10px] text-gray-400 mt-1">Spring Boot entity POJO class name (PascalCase standard).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="tableName" value="Physical DB Table Name (@Table)" className="font-bold text-xs" />
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold">SQL @Table</span>
                </div>
                <TextInput
                  id="tableName"
                  required
                  placeholder="e.g. tb_medical_stock"
                  value={newEntity.tableName}
                  onChange={(e) => setNewEntity({ ...newEntity, tableName: e.target.value })}
                  className="[&_input]:rounded-xl [&_input]:py-2.5 font-mono text-xs text-purple-600 dark:text-purple-400"
                />
                <p className="text-[10px] text-gray-400 mt-1">Physical table name in PostgreSQL/MySQL database.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="packageName" value="Package Declaration" className="font-bold text-xs" />
                  <span className="text-[10px] text-gray-400 font-mono">Java Package</span>
                </div>
                <TextInput
                  id="packageName"
                  value={newEntity.packageName}
                  onChange={(e) => setNewEntity({ ...newEntity, packageName: e.target.value })}
                  className="[&_input]:rounded-xl [&_input]:py-2.5 font-mono text-xs text-gray-600 dark:text-gray-300"
                />
                <p className="text-[10px] text-gray-400 mt-1">Java namespace e.g. <code className="text-gray-600 dark:text-gray-300 font-bold">com.mtp.api.models</code>.</p>
              </div>
            </div>

            {/* Live Preview Pill Banner */}
            <div className="p-2.5 bg-gray-900 text-emerald-400 rounded-xl font-mono text-[11px] flex items-center justify-between border border-gray-800">
              <span>
                <span className="text-purple-400">@Entity</span> <span className="text-purple-400">@Table</span>(name = <span className="text-amber-300">"{newEntity.tableName || "tb_entity"}"</span>) <span className="text-blue-400">public class</span> <span className="text-white font-bold">{newEntity.className || "CustomEntity"}</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-sans">Live Generator Sync</span>
            </div>
          </div>

          {/* Card B: Primary Key & Database Identity */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-purple-50/30 dark:from-gray-800/60 dark:to-gray-800/80 border border-gray-100 dark:border-gray-700/60 space-y-3">
            <h4 className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider flex items-center gap-1.5">
              <Sparkles size={15} /> 2. Primary Key Generator & Database Identity
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="idStrategy" value="Primary Key Strategy (@Id)" className="font-bold text-xs" />
                  <span className="text-[10px] text-purple-600 font-bold">PK Generator</span>
                </div>
                <Select
                  id="idStrategy"
                  value={newEntity.idStrategy}
                  onChange={(e) => {
                    const strategy = e.target.value;
                    let colType = "nvarchar(128)";
                    if (strategy.includes("UUID")) colType = "VARCHAR(36)";
                    else if (strategy.includes("IDENTITY") || strategy.includes("AUTO")) colType = "BIGINT AUTO_INCREMENT";
                    else if (strategy.includes("MANUAL")) colType = "VARCHAR(64)";

                    setNewEntity({
                      ...newEntity,
                      idStrategy: strategy,
                      columnType: colType,
                    });
                  }}
                  className="[&_select]:rounded-xl [&_select]:py-2.5 font-mono text-xs font-bold"
                >
                  <option value="@Id @GeneratedValue(UUID)">UUID (Recommended - 36 Char Unique String)</option>
                  <option value="@Id @GeneratedValue(IDENTITY)">Auto-Increment (BIGINT Identity Number)</option>
                  <option value="@Id @GeneratedValue(AUTO)">Auto Sequence (BigInteger Database Sequence)</option>
                  <option value="@Id (MANUAL)">Manual Assignment (Custom Code / String ID)</option>
                </Select>
                <p className="text-[10px] text-gray-400 mt-1">Defines how primary key IDs are generated in Spring Data JPA.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="columnType" value="SQL Primary Key Type (@Column)" className="font-bold text-xs" />
                  <span className="text-[10px] text-gray-400 font-mono">SQL Datatype</span>
                </div>
                <TextInput
                  id="columnType"
                  placeholder="e.g. VARCHAR(36)"
                  value={newEntity.columnType}
                  onChange={(e) => setNewEntity({ ...newEntity, columnType: e.target.value })}
                  className="[&_input]:rounded-xl [&_input]:py-2.5 font-mono text-xs text-purple-600 dark:text-purple-400 font-bold"
                />
                <p className="text-[10px] text-gray-400 mt-1">Database column SQL datatype definition.</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="indexes" value="Database Index Directives (@Index)" className="font-bold text-xs" />
                <span className="text-[10px] text-gray-400 font-mono">Optional Indexes</span>
              </div>
              <TextInput
                id="indexes"
                placeholder="e.g. idx_stock_code, idx_stock_name"
                value={newEntity.indexes}
                onChange={(e) => setNewEntity({ ...newEntity, indexes: e.target.value })}
                className="[&_input]:rounded-xl [&_input]:py-2.5 font-mono text-xs"
              />
              <p className="text-[10px] text-gray-400 mt-1">Comma-separated column index names for high-speed SQL query lookup.</p>
            </div>
          </div>

          {/* Card C: Module Domain Category */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-blue-50/30 dark:from-gray-800/60 dark:to-gray-800/80 border border-gray-100 dark:border-gray-700/60 space-y-3">
            <Label value="3. Module Domain Category" className="font-bold text-xs block text-gray-900 dark:text-white" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {[
                { key: "HR", label: "Human Resources", icon: <Users size={16} />, desc: "Security, users & access control" },
                { key: "CLINIC", label: "Clinic & Health", icon: <Stethoscope size={16} />, desc: "Patients, wards & medical logs" },
                { key: "SCHOOL", label: "School & Education", icon: <GraduationCap size={16} />, desc: "Students, courses & grades" },
                { key: "FINANCE", label: "Billing & Finance", icon: <Receipt size={16} />, desc: "Invoices, journals & payments" },
                { key: "POS", label: "Point of Sale", icon: <Package size={16} />, desc: "Products, stock & transactions" },
                { key: "GENERAL", label: "General System", icon: <Boxes size={16} />, desc: "Core metadata & governance" },
              ].map((cat) => {
                const isCatSelected = newEntity.category === cat.key;
                return (
                  <div
                    key={cat.key}
                    onClick={() => setNewEntity({ ...newEntity, category: cat.key })}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                      isCatSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30 text-blue-900 dark:text-blue-100 shadow-sm"
                        : "bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className={`p-2 rounded-xl text-white ${
                      cat.key === "HR" ? "bg-purple-600" :
                      cat.key === "CLINIC" ? "bg-rose-600" :
                      cat.key === "SCHOOL" ? "bg-amber-600" :
                      cat.key === "FINANCE" ? "bg-emerald-600" :
                      cat.key === "POS" ? "bg-indigo-600" : "bg-blue-600"
                    }`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs leading-tight">{cat.label}</h5>
                      <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Property Fields Builder */}
      {entityStudioTab === "FIELDS" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
              Java Class Fields & Multi-Annotation Stack
            </h4>
            <button
              type="button"
              onClick={handleAddFieldToEntity}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold text-xs rounded-xl hover:bg-blue-100 transition-all flex items-center gap-1"
            >
              <Plus size={14} /> Add Property Field
            </button>
          </div>

          <div className="space-y-3">
            {entityFields.map((field: any, idx: number) => {
              return (
                <div
                  key={idx}
                  className="p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-3"
                >
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    <div className="flex-1">
                      <TextInput
                        placeholder="fieldName e.g. userName"
                        value={field.name}
                        onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                        className="[&_input]:rounded-xl [&_input]:py-2 font-mono text-xs font-bold"
                      />
                    </div>

                    <div className="w-40">
                      <Select
                        value={field.type}
                        onChange={(e) => handleFieldChange(idx, "type", e.target.value)}
                        className="[&_select]:rounded-xl [&_select]:py-2 font-mono text-xs"
                      >
                        <option value="String">String</option>
                        <option value="Long">Long</option>
                        <option value="BigDecimal">BigDecimal</option>
                        <option value="Boolean">Boolean</option>
                        <option value="LocalDateTime">LocalDateTime</option>
                      </Select>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1 cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={!!field.isNotNull}
                          onChange={(e) => handleFieldChange(idx, "isNotNull", e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        @NotNull
                      </label>

                      <label className="inline-flex items-center gap-1 cursor-pointer text-xs font-bold text-gray-600 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={!!field.isUnique}
                          onChange={(e) => handleFieldChange(idx, "isUnique", e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        unique = true
                      </label>

                      {entityFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Custom Methods */}
      {entityStudioTab === "METHODS" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
              Custom Methods & JPA Callbacks (@PrePersist, Getters)
            </h4>
            <button
              type="button"
              onClick={handleAddMethod}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-bold text-xs rounded-xl hover:bg-blue-100 transition-all flex items-center gap-1"
            >
              <Plus size={14} /> Add Method
            </button>
          </div>

          <div className="space-y-3">
            {entityMethods.map((m: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={m.enabled}
                      onChange={(e) => handleMethodChange(idx, "enabled", e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <TextInput
                      placeholder="Method Display Name"
                      value={m.name}
                      onChange={(e) => handleMethodChange(idx, "name", e.target.value)}
                      className="[&_input]:rounded-lg [&_input]:py-1 font-bold text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMethod(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <TextInput
                    placeholder="Signature e.g. public Boolean isActive()"
                    value={m.signature}
                    onChange={(e) => handleMethodChange(idx, "signature", e.target.value)}
                    className="[&_input]:rounded-lg [&_input]:py-1 font-mono text-xs"
                  />
                  <TextInput
                    placeholder="Annotation e.g. @PrePersist"
                    value={m.annotation || ""}
                    onChange={(e) => handleMethodChange(idx, "annotation", e.target.value)}
                    className="[&_input]:rounded-lg [&_input]:py-1 font-mono text-xs text-purple-600"
                  />
                </div>

                <textarea
                  rows={2}
                  value={m.body}
                  onChange={(e) => handleMethodChange(idx, "body", e.target.value)}
                  className="w-full p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-xs text-emerald-600 dark:text-emerald-400 outline-none"
                  placeholder="Method body statements..."
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Generated Source */}
      {entityStudioTab === "CODE_PREVIEW" && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
              Generated Java Spring Boot @Entity Class Code
            </h4>
            <button
              type="button"
              onClick={() => setIsCustomCodeOverride(!isCustomCodeOverride)}
              className="px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-lg transition-all"
            >
              {isCustomCodeOverride ? "Revert to Auto-Generator" : "Override with Manual Code"}
            </button>
          </div>

          <pre className="p-4 bg-gray-900 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 border border-gray-800">
            {isCustomCodeOverride ? customJavaCode : generatedJavaCode}
          </pre>
        </div>
      )}
    </div>
  );
}

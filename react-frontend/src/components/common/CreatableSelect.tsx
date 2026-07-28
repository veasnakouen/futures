import React from "react";
import ReactSelectCreatable from 'react-select/creatable';

interface CreatableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CreatableSelect: React.FC<CreatableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select or type new vendor...",
  disabled = false,
}) => {
  const selectOptions = options.map((opt) => ({ label: opt, value: opt }));
  const selectValue = value ? { label: value, value: value } : null;

  return (
    <ReactSelectCreatable
      isClearable
      isDisabled={disabled}
      options={selectOptions}
      value={selectValue}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      onChange={(selected: any) => onChange(selected ? selected.value : "")}
      placeholder={placeholder}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 99999 }),
        menu: (base) => ({
          ...base,
          zIndex: 99999,
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }),
        control: (base, state) => ({
          ...base,
          minHeight: "40px",
          borderRadius: "0.375rem",
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
          boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.4)" : "none",
          backgroundColor: "#ffffff",
          "&:hover": {
            borderColor: "#9ca3af",
          },
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "#2563eb"
            : state.isFocused
            ? "#eff6ff"
            : "#ffffff",
          color: state.isSelected ? "#ffffff" : "#1f2937",
          fontSize: "0.875rem",
          padding: "8px 12px",
          cursor: "pointer",
          "&:active": {
            backgroundColor: "#3b82f6",
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: "#111827",
          fontWeight: 600,
          fontSize: "0.875rem",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#9ca3af",
          fontSize: "0.875rem",
        }),
      }}
    />
  );
};

export default CreatableSelect;

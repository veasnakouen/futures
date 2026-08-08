import React, { useState } from "react";
import ReactSelectCreatable from 'react-select/creatable';
import { components, type OptionProps } from "react-select";
import { Edit2, Trash2, Check, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface CreatableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  menuPlacement?: "auto" | "bottom" | "top";
  fieldName?: string;
  onRenameOption?: (oldValue: string, newValue: string) => Promise<void> | void;
  onDeleteOption?: (value: string) => Promise<void> | void;
}

const CustomOption = (props: OptionProps<any> & { selectProps: any }) => {
  const { onRenameOption, onDeleteOption, isSuperAdmin } = props.selectProps;
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(props.data.value || "");
  const [isBusy, setIsBusy] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!editVal || editVal.trim() === "" || editVal.trim() === props.data.value) {
      setIsEditing(false);
      return;
    }
    if (onRenameOption) {
      try {
        setIsBusy(true);
        await onRenameOption(props.data.value, editVal.trim());
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to rename option:", err);
      } finally {
        setIsBusy(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!onDeleteOption) return;
    if (window.confirm(`Are you sure you want to delete "${props.data.value}" from all records?`)) {
      try {
        setIsBusy(true);
        await onDeleteOption(props.data.value);
      } catch (err) {
        console.error("Failed to delete option:", err);
      } finally {
        setIsBusy(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50/90 dark:bg-gray-800 border-b border-indigo-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave(e as any);
            } else if (e.key === "Escape") {
              setIsEditing(false);
            }
          }}
          disabled={isBusy}
          className="flex-1 text-xs px-2 py-1 border border-indigo-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          autoFocus
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={isBusy}
          title="Save changes"
          className="p-1 rounded text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-colors"
        >
          {isBusy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(false);
          }}
          disabled={isBusy}
          title="Cancel"
          className="p-1 rounded text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between group/opt w-full">
        <span className="truncate pr-2">{props.data.label}</span>
        {isSuperAdmin && (onRenameOption || onDeleteOption) && (
          <div
            className="opacity-0 group-hover/opt:opacity-100 flex items-center gap-1 transition-opacity"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {onRenameOption && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditVal(props.data.value);
                  setIsEditing(true);
                }}
                title="Superadmin: Rename this option"
                className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Edit2 size={12} />
              </button>
            )}
            {onDeleteOption && (
              <button
                type="button"
                onClick={handleDelete}
                title="Superadmin: Delete this option"
                className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
              >
                {isBusy ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              </button>
            )}
          </div>
        )}
      </div>
    </components.Option>
  );
};

const CreatableSelect: React.FC<CreatableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select or type new option...",
  disabled = false,
  menuPlacement = "auto",
  onRenameOption,
  onDeleteOption,
}) => {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.roles?.some(
    (r) =>
      typeof r === "string" &&
      (r.toUpperCase().includes("SUPER_ADMIN") || r.toUpperCase().includes("SUPERADMIN"))
  ) ?? false;

  const selectOptions = options.map((opt) => ({ label: opt, value: opt }));
  const selectValue = value ? { label: value, value: value } : null;

  return (
    <ReactSelectCreatable
      isClearable
      isDisabled={disabled}
      options={selectOptions}
      value={selectValue}
      onChange={(selected: any) => onChange(selected ? selected.value : "")}
      placeholder={placeholder}
      menuPlacement={menuPlacement}
      classNamePrefix="react-select"
      components={{
        Option: CustomOption,
      }}
      // Pass props through selectProps to Option component
      {...({
        onRenameOption,
        onDeleteOption,
        isSuperAdmin,
      } as any)}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "38px",
          backgroundColor: "hsl(var(--background))",
          borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--border))",
          boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring) / 0.2)" : "none",
          borderRadius: "0.5rem",
          "&:hover": {
            borderColor: "hsl(var(--ring) / 0.5)",
          },
        }),
        menu: (base) => ({
          ...base,
          zIndex: 99999,
          backgroundColor: "hsl(var(--popover))",
          borderRadius: "0.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid hsl(var(--border))",
          overflow: "hidden",
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "hsl(var(--primary))"
            : state.isFocused
            ? "hsl(var(--accent))"
            : "transparent",
          color: state.isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--popover-foreground))",
          fontSize: "0.875rem",
          padding: "6px 10px",
          cursor: "pointer",
          "&:active": {
            backgroundColor: "hsl(var(--primary) / 0.8)",
          },
        }),
        singleValue: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
          fontWeight: 600,
          fontSize: "0.875rem",
        }),
        placeholder: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
          fontSize: "0.875rem",
        }),
        input: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
        }),
      }}
    />
  );
};

export default CreatableSelect;

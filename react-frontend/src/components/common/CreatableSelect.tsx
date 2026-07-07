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
  placeholder = "Select or type...",
  disabled = false,
}) => {
  const selectOptions = options.map(opt => ({ label: opt, value: opt }));
  const selectValue = value ? { label: value, value: value } : null;

  return (
    <ReactSelectCreatable
      unstyled
      isClearable
      isDisabled={disabled}
      options={selectOptions}
      value={selectValue}
      onChange={(selected: any) => onChange(selected ? selected.value : '')}
      placeholder={placeholder}
      menuPosition="fixed"
      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      classNamePrefix="react-select"
      classNames={{
        control: ({ isFocused }) => 
          `flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors cursor-text ${
            isFocused ? 'ring-1 ring-ring border-primary outline-none' : 'hover:border-primary/50'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`,
        placeholder: () => "text-muted-foreground",
        input: () => "text-foreground",
        singleValue: () => "text-foreground",
        menu: () => "mt-1 rounded-md border bg-popover shadow-md overflow-hidden z-[9999]",
        menuList: () => "p-1",
        option: ({ isFocused, isSelected }) =>
          `relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors ${
            isSelected ? 'bg-primary text-primary-foreground font-medium' : isFocused ? 'bg-accent text-accent-foreground' : 'text-popover-foreground hover:bg-accent/50 hover:text-accent-foreground'
          }`,
        noOptionsMessage: () => "p-2 text-sm text-muted-foreground",
        clearIndicator: () => "text-muted-foreground hover:text-foreground cursor-pointer p-1",
        dropdownIndicator: () => "text-muted-foreground hover:text-foreground cursor-pointer p-1",
        indicatorSeparator: () => "bg-border mx-1 my-1",
        valueContainer: () => "gap-1",
      }}
      styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 })
      }}
    />
  );
};

export default CreatableSelect;

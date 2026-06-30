import React, { useState, useRef, useEffect } from "react";
import { TextInput } from "@/lib/flowbite-compat";
import { ChevronDown } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={ref}>
      <TextInput
        disabled={disabled}
        value={search}
        onChange={(e: any) => {
          setSearch(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="pr-10 rounded-md"
      />
      <div
        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            // Optional: clear search to show all when opening via arrow
            if (!isOpen) setSearch("");
          }
        }}
      >
        <ChevronDown size={18} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div
                key={i}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-gray-200"
                onClick={() => {
                  setSearch(opt);
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500 italic bg-gray-50 dark:bg-gray-800">
              Press Enter or click away to add "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatableSelect;

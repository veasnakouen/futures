import React from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: any;
  onChange: (value: string) => void;
  containerClassName?: string;
  inputClassName?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  containerClassName = "",
  inputClassName = "",
  className = "",
  placeholder = "Search...",
  ...props
}) => {
  const safeValue =
    typeof value === "string" || typeof value === "number"
      ? String(value)
      : "";

  return (
    <div className={`relative flex-1 min-w-[200px] group ${containerClassName}`}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10"
        size={18}
      />
      <input
        {...props}
        type="text"
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 pr-10 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/70 dark:border-gray-700/70 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner placeholder:text-gray-400 placeholder:font-medium ${inputClassName} ${className}`}
      />
      {Boolean(safeValue) && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors z-10 cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

import React from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
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
  return (
    <div className={`relative flex-1 group ${containerClassName}`}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10"
        size={18}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 pr-10 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all shadow-inner placeholder:text-gray-400 ${inputClassName} ${className}`}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors z-10"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

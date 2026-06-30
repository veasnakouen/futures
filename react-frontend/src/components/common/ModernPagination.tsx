import React, { useState, useEffect } from "react";
import { Button, Dropdown, DropdownItem } from '@/lib/flowbite-compat';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

interface ModernPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showInfo?: boolean;
  className?: string;
}

const ModernPagination: React.FC<ModernPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showInfo = true,
  className = "",
}) => {
  const [goToPage, setGoToPage] = useState("");

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setGoToPage("");
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis-start");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis-end");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div
      className={`flex flex-col lg:flex-row items-center justify-between gap-6 px-6 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-md border border-gray-100 dark:border-gray-700/50 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Left Side: Info & Page Size */}
      <div className="flex flex-wrap items-center gap-4">
        {showInfo && totalItems !== undefined && pageSize !== undefined && (
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-black text-gray-900 dark:text-white">
              {Math.min(totalItems, (currentPage - 1) * pageSize + 1)}-
              {Math.min(totalItems, currentPage * pageSize)}
            </span>{" "}
            of{" "}
            <span className="font-black text-gray-900 dark:text-white">
              {totalItems}
            </span>{" "}
            entries
          </div>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Rows
            </span>
            <Dropdown
              inline
              placement="top-start"
              className="bg-white dark:bg-gray-800 border-none shadow-2xl rounded-xl p-2 min-w-[150px] z-50"
              label={
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md text-xs font-bold text-gray-700 dark:text-gray-200 hover:border-blue-400 transition-all">
                  {pageSize}
                </div>
              }
              arrowIcon={false}
            >
              {pageSizeOptions.map((option) => (
                <DropdownItem
                  key={option}
                  onClick={() => onPageSizeChange(option)}
                  className={`font-bold text-xs rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 ${pageSize === option ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {option} per page
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        )}
      </div>

      {/* Middle: Page Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="First Page"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((p, idx) => {
            if (p === "ellipsis-start" || p === "ellipsis-end") {
              return (
                <div key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                  <MoreHorizontal size={14} />
                </div>
              );
            }
            const pageNum = p as number;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[40px] h-10 rounded-md text-sm font-black transition-all ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Next Page"
        >
          <ChevronRight size={18} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Last Page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>

      {/* Right Side: Go to Page */}
      <form onSubmit={handleGoToPage} className="flex items-center gap-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:inline">
          Go to
        </span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          placeholder={String(currentPage)}
          className="w-16 h-10 px-3 text-center text-sm font-black bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:text-white transition-all"
        />
        <button
          type="submit"
          className="p-2.5 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </form>
    </div>
  );
};

export default ModernPagination;

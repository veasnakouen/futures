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
      className={`w-full flex flex-col md:flex-row items-center justify-between gap-4 px-5 py-3.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Left Side: Info & Page Size Selector */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-gray-500 dark:text-gray-400">
        {showInfo && totalItems !== undefined && pageSize !== undefined && (
          <div className="font-medium">
            Showing{" "}
            <span className="font-extrabold text-gray-900 dark:text-white">
              {Math.min(totalItems, (currentPage - 1) * pageSize + 1)}-
              {Math.min(totalItems, currentPage * pageSize)}
            </span>{" "}
            of{" "}
            <span className="font-extrabold text-gray-900 dark:text-white">
              {totalItems}
            </span>{" "}
            entries
          </div>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200 dark:border-gray-700">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              Rows
            </span>
            <Dropdown
              inline
              placement="top-start"
              className="bg-white dark:bg-gray-800 border-none shadow-2xl rounded-xl p-1.5 min-w-[130px] z-50"
              label={
                <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700/60 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  {pageSize}
                </div>
              }
              arrowIcon={false}
            >
              {pageSizeOptions.map((option) => (
                <DropdownItem
                  key={option}
                  onClick={() => onPageSizeChange(option)}
                  className={`font-bold text-xs rounded-lg ${pageSize === option ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {option} per page
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        )}
      </div>

      {/* Right Side: Page Controls & Go To Input */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="First Page"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1 mx-1">
            {getPageNumbers().map((p, idx) => {
              if (p === "ellipsis-start" || p === "ellipsis-end") {
                return (
                  <div key={`ellipsis-${idx}`} className="px-1 text-gray-400">
                    <MoreHorizontal size={14} />
                  </div>
                );
              }
              const pageNum = p as number;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-black transition-all ${currentPage === pageNum
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:bg-gray-700/60"
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
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Last Page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>

        {/* Inline Go To Page Form */}
        <form onSubmit={handleGoToPage} className="flex items-center gap-1.5 pl-2 border-l border-gray-200 dark:border-gray-700">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider hidden sm:inline">
            Go to
          </span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            placeholder={String(currentPage)}
            className="w-12 h-8 px-2 text-center text-xs font-bold bg-gray-100 dark:bg-gray-700/60 rounded-lg border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 outline-none dark:text-white transition-all"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
            title="Jump to page"
          >
            <ChevronRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModernPagination;
import React from "react";
import SearchInput from "@/components/common/SearchInput";
import { Select } from "@/lib/flowbite-compat";

interface Props {
  state: any;
}

export default function InventoryToolbar({ state }: Props) {
  const {
    t,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
    setCurrentPage,
  } = state;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="w-full sm:w-80">
        <SearchInput
          placeholder={t("searchPlaceholder") || "Search inventory items or SKU..."}
          value={search}
          onChange={(val: any) => {
            setSearch(typeof val === "string" ? val : val?.target?.value || "");
            setCurrentPage(1);
          }}
          containerClassName="w-full"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-44 text-xs font-bold"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => {
            const catName = typeof cat === "string" ? cat : cat.name;
            return (
              <option key={catName} value={catName}>
                {catName}
              </option>
            );
          })}
        </Select>

        <Select
          value={`${sortField},${sortDir}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split(",");
            setSortField(field);
            setSortDir(dir);
          }}
          className="w-full sm:w-44 text-xs font-bold"
        >
          <option value="name,asc">Name (A-Z)</option>
          <option value="name,desc">Name (Z-A)</option>
          <option value="stockQuantity,asc">Stock (Low-High)</option>
          <option value="stockQuantity,desc">Stock (High-Low)</option>
          <option value="price,asc">Price (Low-High)</option>
          <option value="price,desc">Price (High-Low)</option>
        </Select>
      </div>
    </div>
  );
}

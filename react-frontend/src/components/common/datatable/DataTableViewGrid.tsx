import React from "react";
import { Box } from "lucide-react";

interface DataTableViewGridProps<T> {
  data: T[];
  renderGridCard?: (item: T) => React.ReactNode;
  gridCols?: string;
  emptyMessage?: string;
}

export function DataTableViewGrid<T>({
  data,
  renderGridCard,
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  emptyMessage = "No matching items found.",
}: DataTableViewGridProps<T>) {
  if (data.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-xl border flex flex-col items-center justify-center">
        <Box size={36} className="mb-2 opacity-30" />
        <p className="font-bold text-xs uppercase tracking-wider">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {data.map((item, idx) => (
        <React.Fragment key={idx}>
          {renderGridCard ? renderGridCard(item) : (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-sm text-xs">
              <pre className="overflow-x-auto text-[10px]">{JSON.stringify(item, null, 2)}</pre>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

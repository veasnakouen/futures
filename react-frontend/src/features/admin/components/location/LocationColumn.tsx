import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { type LocationItem } from "@/features/admin/hooks/useLocationManagementState";

interface LocationColumnProps {
  title: string;
  items: LocationItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAdd: (data: { nameEn: string; postcode?: string }) => void;
  onEdit: (id: number, data: { nameEn: string; postcode?: string }) => void;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

export default function LocationColumn({
  title,
  items,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  disabled = false,
}: LocationColumnProps) {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [postcodeValue, setPostcodeValue] = useState("");

  const handleSaveAdd = () => {
    if (inputValue.trim()) {
      onAdd({ nameEn: inputValue.trim(), postcode: postcodeValue.trim() });
      setInputValue("");
      setPostcodeValue("");
      setIsAdding(false);
    }
  };

  const handleSaveEdit = (id: number) => {
    if (inputValue.trim()) {
      onEdit(id, { nameEn: inputValue.trim(), postcode: postcodeValue.trim() });
      setEditingId(null);
      setInputValue("");
      setPostcodeValue("");
    }
  };

  if (disabled) {
    return (
      <div className="flex flex-col h-[600px] rounded-lg bg-gray-50 dark:bg-gray-800/50 opacity-50 p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
        <p className="text-sm text-gray-500 italic">{t("selectParentLocationFirst")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700/60">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <button
          onClick={() => {
            setIsAdding(true);
            setInputValue("");
            setPostcodeValue("");
            setEditingId(null);
          }}
          className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isAdding && (
          <div className="flex flex-col gap-2 mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-blue-100 dark:border-blue-800">
            <input
              autoFocus
              className="w-full px-2 py-1.5 text-sm rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("nameEnPlaceholder")}
            />
            <input
              className="w-full px-2 py-1.5 text-sm rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={postcodeValue}
              onChange={(e) => setPostcodeValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveAdd()}
              placeholder={t("postcodeOptionalPlaceholder")}
            />
            <div className="flex justify-end gap-2 mt-1">
              <button onClick={() => setIsAdding(false)} className="text-sm text-gray-500 hover:text-gray-700">
                {t("cancel")}
              </button>
              <button onClick={handleSaveAdd} className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                {t("save")}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                selectedId === item.id
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => onSelect(item.id)}
            >
              {editingId === item.id ? (
                <div className="flex flex-col gap-2 flex-1 p-2 bg-gray-50 dark:bg-gray-800/80 rounded" onClick={(e) => e.stopPropagation()}>
                  <input
                    autoFocus
                    className="w-full px-2 py-1.5 text-sm rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t("nameEnPlaceholder")}
                  />
                  <input
                    className="w-full px-2 py-1.5 text-sm rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={postcodeValue}
                    onChange={(e) => setPostcodeValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(item.id)}
                    placeholder={t("postcodeOptionalPlaceholder")}
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button onClick={() => setEditingId(null)} className="text-sm text-gray-500 hover:text-gray-700">
                      {t("cancel")}
                    </button>
                    <button onClick={() => handleSaveEdit(item.id)} className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                      {t("save")}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-sm truncate">{item.nameEn}</span>
                    {item.postcode && <span className="text-xs text-gray-500 dark:text-gray-400">{item.postcode}</span>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(item.id);
                        setInputValue(item.nameEn);
                        setPostcodeValue(item.postcode || "");
                        setIsAdding(false);
                      }}
                      className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(t("confirmDeleteName", { name: item.nameEn }))) onDelete(item.id);
                      }}
                      className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {items.length === 0 && !isAdding && (
            <div className="text-center p-4 text-sm text-gray-500">{t("noItemsFound")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

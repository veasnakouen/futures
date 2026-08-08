import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Badge, Spinner } from "@/lib/flowbite-compat";
import { History, ArrowUpRight, ArrowDownLeft, RefreshCw, Layers, ShieldCheck, Tag, Search } from "lucide-react";
import axios from "axios";

interface StockLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId?: number | null;
  itemName?: string | null;
}

export default function StockLedgerModal({ isOpen, onClose, itemId, itemName }: StockLedgerModalProps) {
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchLedger();
    }
  }, [isOpen, itemId, selectedType]);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const params: any = { page: 0, size: 20 };
      if (itemId) params.itemId = itemId;
      if (selectedType) params.type = selectedType;
      if (search) params.search = search;

      const res = await axios.get("/api/v1/stock/ledger", { params });
      setLedgerEntries(res.data?.content || []);
    } catch {
      setLedgerEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "STOCK_IN":
      case "RESERVATION_RELEASE":
        return "success";
      case "STOCK_OUT":
      case "RESERVATION_LOCK":
        return "failure";
      case "TRANSFER":
        return "purple";
      default:
        return "blue";
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <ModalHeader className="bg-slate-900 text-white rounded-t-2xl border-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400">
            <History size={18} />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-white">
              Double-Entry Stock Audit Ledger
            </h3>
            <p className="text-[11px] text-slate-400">
              {itemName ? `Audit history for: ${itemName}` : "Complete immutable stock transaction ledger"}
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="bg-slate-50 dark:bg-slate-900/90 p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchLedger()}
              placeholder="Filter by SKU or Reference #..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 font-semibold border-none shadow-xs"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border-none shadow-xs"
          >
            <option value="">All Transactions</option>
            <option value="STOCK_IN">Stock In (+)</option>
            <option value="STOCK_OUT">Stock Out (-)</option>
            <option value="RESERVATION_LOCK">Reservation Lock</option>
            <option value="RESERVATION_RELEASE">Reservation Release</option>
            <option value="TRANSFER">Transfer</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </select>

          <button
            onClick={fetchLedger}
            className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-blue-700"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Ledger Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <Spinner size="lg" />
              <p className="text-xs font-bold mt-2">Fetching immutable stock ledger...</p>
            </div>
          ) : ledgerEntries.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Layers size={32} className="mx-auto opacity-30 mb-2" />
              <p className="text-xs font-bold">No ledger transactions found</p>
            </div>
          ) : (
            <div className="overflow-auto max-h-[500px] relative">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 uppercase text-[10px] font-black tracking-wider sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0] dark:shadow-[0_1px_0_0_#0f172a]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Item</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Quantity</th>
                    <th className="p-3 text-center">Before → After</th>
                    <th className="p-3">Reference #</th>
                    <th className="p-3">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-semibold text-slate-700 dark:text-slate-200">
                  {ledgerEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="p-3 whitespace-nowrap text-[11px] text-slate-400">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "Just now"}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {entry.item?.name || "Inventory Item"}
                      </td>
                      <td className="p-3">
                        <Badge color={getBadgeColor(entry.transactionType)} className="rounded-lg px-2 py-0.5 text-[9px] font-black">
                          {entry.transactionType}
                        </Badge>
                      </td>
                      <td className={`p-3 text-right font-black ${entry.quantity > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                      </td>
                      <td className="p-3 text-center font-mono text-[11px]">
                        <span className="text-slate-400">{entry.balanceBefore ?? 0}</span>
                        <span className="text-blue-600 font-bold mx-1.5">→</span>
                        <span className="font-bold text-slate-900 dark:text-white">{entry.balanceAfter ?? 0}</span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {entry.reservationKey || entry.referenceNumber || "-"}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">
                        {entry.createdBy || "system"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter className="bg-slate-100 dark:bg-slate-900 rounded-b-2xl border-none justify-between">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
          <ShieldCheck size={16} className="text-emerald-500" /> Double-entry audit ledger active
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300"
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
}

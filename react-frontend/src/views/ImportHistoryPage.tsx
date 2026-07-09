import React, { useState, useEffect } from "react";
import {Table, TableHead, TableBody, TableHeadCell, TableRow, TableCell, Badge, Button, Spinner} from '@/lib/flowbite-compat';
import { History, Database, ArrowRight, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../services/api";

import { format } from "date-fns";

const ImportHistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/stock/assets/import/history");
      setSessions(response.data);
    } catch (err) {
      toast.error("Failed to load import history");
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async (sheetName: string) => {
    try {
      setLoading(true);
      const response = await api.post(
        `/stock/assets/import/commit/${encodeURIComponent(sheetName)}`,
      );
      toast.success(response.data.message);
      fetchHistory();
    } catch (err) {
      toast.error("Failed to commit data");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to wipe ALL staging data?"))
      return;
    try {
      setLoading(true);
      await api.delete("/stock/assets/import/clear/staging");
      toast.success("Staging area cleared");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to clear data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <> {}} title="Import Control Center">
      <div className="p-8 space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
              <History size={32} className="text-blue-600" />
              Data Import Ledger
            </h2>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">
              Review and manage data pushed from Python or Excel
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              color="blue"
              onClick={() => handleCommit("all")}
              disabled={loading || sessions.length === 0}
              className="rounded-md font-black uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-blue-500/20"
            >
              Commit All Data
            </Button>
            <Button
              color="failure"
              onClick={handleClear}
              disabled={loading}
              className="rounded-md font-black uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-red-500/20"
            >
              <Trash2 size={16} className="mr-2" /> Wipe Staging
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Spinner size="xl" />
            <p className="mt-4 font-black text-gray-400 uppercase text-[10px] tracking-widest animate-pulse">
              Syncing Staging Logs...
            </p>
          </div>
        ) : (
          <div className="border-none shadow-sm dark:bg-gray-800 rounded-md overflow-hidden bg-white/50 backdrop-blur-xl p-0">
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
              <Table hoverable className="relative w-full min-w-[800px]">
                <TableHead className="bg-gray-50/90 dark:bg-gray-700/90 text-[10px] font-black uppercase tracking-widest text-gray-400 sticky top-0 z-20 backdrop-blur-md border-b">
                  <TableHeadCell className="px-8 py-6">
                    Source / Sheet
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-6">
                    Item Count
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-6">
                    Target Module
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-6">
                    Last Synced
                  </TableHeadCell>
                  <TableHeadCell className="px-8 py-6 text-right">
                    Actions
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y dark:divide-gray-700">
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20">
                        <Database
                          size={48}
                          className="mx-auto text-gray-200 mb-4"
                        />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Staging table is empty
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map((s, idx) => (
                      <TableRow
                        key={idx}
                        className="bg-white dark:bg-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                      >
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md">
                              <Database size={16} />
                            </div>
                            <span className="font-black dark:text-white uppercase text-sm tracking-tight">
                              {s.sheetName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-8 py-6">
                          <span className="text-lg font-black text-blue-600">
                            {s.count}
                          </span>
                          <span className="ml-2 text-[10px] font-bold text-gray-400 uppercase">
                            Records
                          </span>
                        </TableCell>
                        <TableCell className="px-8 py-6">
                          <Badge
                            color={
                              s.targetType === "ASSET" ? "blue" : "success"
                            }
                            className="rounded-md px-3 py-1 text-[9px] font-black uppercase tracking-widest w-fit"
                          >
                            {s.targetType}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-8 py-6 font-bold text-xs text-gray-500 uppercase">
                          {format(new Date(s.importDate), "MMM dd, HH:mm")}
                        </TableCell>
                        <TableCell className="px-8 py-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              color="light"
                              className="text-[9px] font-black uppercase tracking-widest border-none shadow-sm rounded-md px-4"
                            >
                              Inspect
                            </Button>
                            <Button
                              color="blue"
                              onClick={() => handleCommit(s.sheetName)}
                              className="text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 rounded-md px-4"
                            >
                              Commit <ArrowRight size={14} className="ml-2" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImportHistoryPage;

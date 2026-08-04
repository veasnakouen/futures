"use client";
import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService, BookingDto } from "../../../services/hotelService";
import { Plus, Edit2, Trash2, Search, Filter, LogIn, LogOut, CheckCircle2, Calendar as CalendarIcon, LayoutList } from "lucide-react";
import ModernPagination from "../../../components/common/ModernPagination";
import ConfirmModal from "../../../components/common/ConfirmModal";
import BookingFormModal from './BookingFormModal';
import { toast } from "react-hot-toast";
import SearchInput from "@/components/common/SearchInput";
import HotelAnalyticsCards from "./HotelAnalyticsCards";
import RoomOccupancyCalendar from "./RoomOccupancyCalendar";

export default function BookingList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BookingDto | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", page, size],
    queryFn: () => hotelService.getBookings(page, size).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => hotelService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking deleted successfully");
      setIsConfirmOpen(false);
    },
    onError: () => toast.error("Failed to delete booking")
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, item }: { id: string; status: string; item: BookingDto }) =>
      hotelService.updateBooking(id, { ...item, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["housekeeping"] });
      toast.success(`Booking status updated to ${variables.status}`);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to update booking status";
      toast.error(msg);
    },
  });

  const filteredData = data?.content?.filter((p: BookingDto) => {
    const matchesSearch = p.guestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.roomId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <HotelAnalyticsCards />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bookings & Stay Timeline</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage reservations, stays, check-ins, and room timeline</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* View Switcher Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
              }`}
            >
              <LayoutList size={15} /> Table
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "calendar"
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
              }`}
            >
              <CalendarIcon size={15} /> Timeline
            </button>
          </div>

          <SearchInput
            placeholder="Search Guest or Room ID..."
            value={searchTerm}
            onChange={setSearchTerm}
            containerClassName="flex-1 sm:w-64"
          />
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CHECKED_IN">CHECKED_IN</option>
              <option value="CHECKED_OUT">CHECKED_OUT</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <button
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-blue-500/20 whitespace-nowrap"
          >
            <Plus size={18} /> New Booking
          </button>
        </div>
      </div>

      {/* Render View Mode Condition */}
      {viewMode === "calendar" ? (
        <RoomOccupancyCalendar />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-bold">Guest ID</th>
                  <th className="px-6 py-4 font-bold">Room ID</th>
                  <th className="px-6 py-4 font-bold">Check-In</th>
                  <th className="px-6 py-4 font-bold">Check-Out</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500"><div className="flex justify-center"><Spinner size="lg" /></div></td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center">No bookings found.</td></tr>
                ) : (
                  filteredData.map((item: BookingDto) => (
                    <tr key={item.id} className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/25 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        Guest #{item.guestId}
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                        Room #{item.roomId}
                      </td>
                      <td className="px-6 py-4">{item.checkInDate}</td>
                      <td className="px-6 py-4">{item.checkOutDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                          item.status === 'CHECKED_IN'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : item.status === 'CHECKED_OUT'
                            ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                            : item.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {item.status || "CONFIRMED"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {item.status === 'PENDING' || item.status === 'CONFIRMED' || !item.status ? (
                            <button
                              onClick={() => statusMutation.mutate({ id: item.id, status: 'CHECKED_IN', item })}
                              disabled={statusMutation.isPending}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm shadow-emerald-500/20"
                              title="Check In Guest & Set Room Status to OCCUPIED"
                            >
                              <LogIn size={14} /> Check In
                            </button>
                          ) : item.status === 'CHECKED_IN' ? (
                            <button
                              onClick={() => statusMutation.mutate({ id: item.id, status: 'CHECKED_OUT', item })}
                              disabled={statusMutation.isPending}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-sm shadow-purple-500/20"
                              title="Check Out Guest & Trigger Housekeeping Cleaning"
                            >
                              <LogOut size={14} /> Check Out
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 px-2 py-1">
                              <CheckCircle2 size={13} /> Stay Completed
                            </span>
                          )}
                          <button onClick={() => { setSelectedItem(item); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => { setSelectedItem(item); setIsConfirmOpen(true); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {data?.totalPages > 1 && (
            <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-800/50">
              <ModernPagination currentPage={page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      <BookingFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} itemToEdit={selectedItem} />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => deleteMutation.mutate(selectedItem!.id)}
        title="Delete Booking"
        message={`Are you sure you want to delete this booking?`}
        confirmText="Delete"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

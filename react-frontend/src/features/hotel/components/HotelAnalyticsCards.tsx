"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { hotelService, BookingDto, RoomDto } from "../../../services/hotelService";
import { BedDouble, DollarSign, TrendingUp, Sparkles, Percent } from "lucide-react";

export default function HotelAnalyticsCards() {
  const { data: roomsData } = useQuery({
    queryKey: ["rooms", 0, 1000],
    queryFn: () => hotelService.getRooms(0, 1000).then((res) => res.data),
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["bookings", 0, 1000],
    queryFn: () => hotelService.getBookings(0, 1000).then((res) => res.data),
  });

  const rooms: RoomDto[] = roomsData?.content || [];
  const bookings: BookingDto[] = bookingsData?.content || [];

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === "OCCUPIED").length;
  const dirtyRooms = rooms.filter((r) => r.status === "DIRTY").length;

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const completedBookings = bookings.filter(
    (b) => b.status === "CHECKED_IN" || b.status === "CHECKED_OUT"
  );
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const soldRoomsCount = completedBookings.length;

  const adr = soldRoomsCount > 0 ? (totalRevenue / soldRoomsCount).toFixed(2) : "0.00";
  const revpar = totalRooms > 0 ? (totalRevenue / totalRooms).toFixed(2) : "0.00";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Occupancy Rate */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Occupancy Rate
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{occupancyRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {occupiedRooms}/{totalRooms} Rooms
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(occupancyRate, 100)}%` }}
            />
          </div>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Percent size={22} />
        </div>
      </div>

      {/* 2. Average Daily Rate (ADR) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Average Daily Rate (ADR)
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${adr}</span>
            <span className="text-xs text-gray-400">/ night</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Across {soldRoomsCount} sold stays
          </p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
          <DollarSign size={22} />
        </div>
      </div>

      {/* 3. RevPAR (Revenue Per Available Room) */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            RevPAR Yield
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${revpar}</span>
            <span className="text-xs text-gray-400">/ room</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ${totalRevenue.toLocaleString()} Total Revenue
          </p>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
          <TrendingUp size={22} />
        </div>
      </div>

      {/* 4. Housekeeping Pending Cleanings */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Pending Housekeeping
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{dirtyRooms}</span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Dirty Rooms
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Requires cleaning staff
          </p>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
          <Sparkles size={22} />
        </div>
      </div>
    </div>
  );
}

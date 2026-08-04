"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { hotelService, RoomDto, BookingDto } from "../../../services/hotelService";
import { addDays, format, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BedDouble, User } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function RoomOccupancyCalendar() {
  const [startDate, setStartDate] = useState<Date>(startOfDay(new Date()));
  const daysCount = 14;

  const datesList = Array.from({ length: daysCount }, (_, i) => addDays(startDate, i));

  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms", 0, 1000],
    queryFn: () => hotelService.getRooms(0, 1000).then((res) => res.data),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings", 0, 1000],
    queryFn: () => hotelService.getBookings(0, 1000).then((res) => res.data),
  });

  const rooms: RoomDto[] = roomsData?.content || [];
  const bookings: BookingDto[] = bookingsData?.content || [];

  const handlePrevDays = () => setStartDate((prev) => addDays(prev, -7));
  const handleNextDays = () => setStartDate((prev) => addDays(prev, 7));
  const handleToday = () => setStartDate(startOfDay(new Date()));

  if (roomsLoading || bookingsLoading) {
    return (
      <div className="flex justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden animate-in fade-in duration-300">
      {/* Calendar Timeline Header Controls */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Room Occupancy Timeline ({format(startDate, "MMM d")} - {format(addDays(startDate, daysCount - 1), "MMM d, yyyy")})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors"
          >
            Today
          </button>
          <button
            onClick={handlePrevDays}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            title="Previous 7 Days"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextDays}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
            title="Next 7 Days"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* 14-Day Timeline Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="p-3 font-bold w-48 sticky left-0 bg-gray-100 dark:bg-gray-900 z-10 shadow-sm">
                Room
              </th>
              {datesList.map((dayDate, i) => {
                const isToday = format(dayDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                return (
                  <th
                    key={i}
                    className={`p-2 text-center font-semibold min-w-[70px] border-l border-gray-200 dark:border-gray-700/60 ${
                      isToday ? "bg-blue-100/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : ""
                    }`}
                  >
                    <div>{format(dayDate, "EEE")}</div>
                    <div className="text-sm font-bold mt-0.5">{format(dayDate, "d MMM")}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={daysCount + 1} className="p-8 text-center text-gray-500">
                  No rooms configured yet.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                >
                  {/* Sticky Left Room Column */}
                  <td className="p-3 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold">Room #{room.roomNumber}</div>
                      <div className="text-[11px] text-gray-400">{room.roomType} (${room.pricePerNight}/n)</div>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        room.status === "OCCUPIED"
                          ? "bg-emerald-500"
                          : room.status === "DIRTY"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                      title={`Status: ${room.status || "AVAILABLE"}`}
                    />
                  </td>

                  {/* 14 Date Cell Columns */}
                  {datesList.map((dayDate, dayIdx) => {
                    const formattedCellDate = format(dayDate, "yyyy-MM-dd");

                    // Find if any booking overlaps this specific day
                    const activeBooking = bookings.find((b) => {
                      if (String(b.roomId) !== String(room.id)) return false;
                      if (b.status === "CANCELLED") return false;
                      if (!b.checkInDate || !b.checkOutDate) return false;
                      return (
                        formattedCellDate >= b.checkInDate &&
                        formattedCellDate <= b.checkOutDate
                      );
                    });

                    const isCheckInDay = activeBooking?.checkInDate === formattedCellDate;

                    return (
                      <td
                        key={dayIdx}
                        className="p-1 border-l border-gray-100 dark:border-gray-700/40 relative h-14 align-middle"
                      >
                        {activeBooking ? (
                          <div
                            className={`w-full h-10 px-2 rounded-lg text-[11px] font-semibold flex flex-col justify-center shadow-xs overflow-hidden transition-all ${
                              activeBooking.status === "CHECKED_IN"
                                ? "bg-emerald-600 text-white"
                                : activeBooking.status === "CHECKED_OUT"
                                ? "bg-purple-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                            title={`Guest ID #${activeBooking.guestId} (${activeBooking.checkInDate} to ${activeBooking.checkOutDate})`}
                          >
                            <div className="truncate font-bold">
                              {isCheckInDay ? `Check In (Guest #${activeBooking.guestId})` : `Guest #${activeBooking.guestId}`}
                            </div>
                            <div className="text-[9px] opacity-90 truncate">
                              {activeBooking.status}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend Footer */}
      <div className="p-4 bg-gray-50/70 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center gap-6 text-xs text-gray-600 dark:text-gray-300">
        <span className="font-semibold uppercase text-[10px] tracking-wider text-gray-400">Legend:</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-blue-600" />
          <span>CONFIRMED Reservation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-emerald-600" />
          <span>CHECKED_IN Active Stay</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-purple-600" />
          <span>CHECKED_OUT Stay Completed</span>
        </div>
      </div>
    </div>
  );
}

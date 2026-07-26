import React from "react";
import { Building, Radio } from "lucide-react";
import { LocationState } from "./scannerTypes";

interface ScannerGeofenceBarProps {
  location: LocationState | null;
  nearestBranch: { name: string; distanceKm: number };
  isGeofenceValid: boolean;
}

export default function ScannerGeofenceBar({
  location,
  nearestBranch,
  isGeofenceValid,
}: ScannerGeofenceBarProps) {
  return (
    <div className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/60 mb-6">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isGeofenceValid
              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600"
              : "bg-amber-100 dark:bg-amber-950/60 text-amber-600"
          }`}
        >
          <Building size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
              {nearestBranch.name}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                isGeofenceValid ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
              }`}
            >
              {isGeofenceValid ? "In Geofence" : "Field / Remote"}
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 block mt-0.5">
            Proximity:{" "}
            {nearestBranch.distanceKm < 1
              ? `${Math.round(nearestBranch.distanceKm * 1000)} meters`
              : `${nearestBranch.distanceKm.toFixed(1)} km`}{" "}
            from office coordinates
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
        <Radio size={12} className="text-emerald-500 animate-pulse" /> GPS Lock ±{location?.accuracy || 10}m
      </div>
    </div>
  );
}

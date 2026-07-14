"use client";
import React from "react";
import AnalyticsModule from "@/features/hr/components/AnalyticsModule";
import { useAnalyticsDemographics, useAnalyticsDeptDist, useAnalyticsStats } from "@/hooks/useHR";

export default function DashboardPage() {
  const { data: demographicsData = [] } = useAnalyticsDemographics();
  const { data: deptDistData = [] } = useAnalyticsDeptDist();
  const { data: analyticsStats = null } = useAnalyticsStats();

  return (
    <div className="animate-fade-in max-w-[1600px] mx-auto text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ / System Overview</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          AMS ENTERPRISE MANAGEMENT REALTIME METRICS
        </p>
      </div>

      <div className="bg-[#1e293b] border border-gray-700/50 rounded-xl p-6 shadow-sm overflow-hidden">
        <AnalyticsModule
          data={{
            stats: analyticsStats,
            demographics: demographicsData,
            deptDist: deptDistData
          }}
        />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { GraduationCap, Users, BookOpen, Clock, Activity, Building, Briefcase } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { schoolService } from "../../../services/schoolService";

const StatCard = ({ title, value, icon: Icon, href, colorClass }: any) => (
  <Link href={href} className="block group">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
          {value !== undefined ? value : "..."}
        </h3>
      </div>
    </div>
  </Link>
);

export default function SchoolDashboard() {
  const { t } = useTranslation();

  const { data: studentsData } = useQuery({
    queryKey: ["students_count"],
    queryFn: () => schoolService.getStudents(0, 1).then(res => res.data),
  });

  const { data: teachersData } = useQuery({
    queryKey: ["teachers_count"],
    queryFn: () => schoolService.getTeachers(0, 1).then(res => res.data),
  });

  const { data: coursesData } = useQuery({
    queryKey: ["courses_count"],
    queryFn: () => schoolService.getCourses(0, 1).then(res => res.data),
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="text-blue-600" />
            {t("schoolDashboard", "School Dashboard")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("schoolDashboardDesc", "Overview of your institution's core metrics and activities.")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("totalStudents", "Total Students")}
          value={studentsData?.totalElements}
          icon={Users}
          href="/school/students"
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title={t("activeTeachers", "Active Teachers")}
          value={teachersData?.totalElements}
          icon={Briefcase}
          href="/school/teachers"
          colorClass="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title={t("runningCourses", "Running Courses")}
          value={coursesData?.totalElements}
          icon={BookOpen}
          href="/school/courses"
          colorClass="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatCard
          title={t("departments", "Departments")}
          value={"-"}
          icon={Building}
          href="/school/departments"
          colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t("quickActions", "Quick Actions")}</h2>
           <div className="grid grid-cols-2 gap-4">
              <Link href="/school/students?action=new" className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-800 group">
                 <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Users size={20} />
                 </div>
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{t("enrollStudent", "Enroll Student")}</span>
              </Link>
              <Link href="/school/courses" className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border border-transparent hover:border-green-100 dark:hover:border-green-800 group">
                 <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <BookOpen size={20} />
                 </div>
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">{t("manageCourses", "Manage Courses")}</span>
              </Link>
              <Link href="/school/case-management" className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors border border-transparent hover:border-orange-100 dark:hover:border-orange-800 group">
                 <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Activity size={20} />
                 </div>
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">{t("caseManagement", "Case Management")}</span>
              </Link>
           </div>
        </div>

        {/* Recent Activity Panel */}
         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <Clock size={20} className="text-gray-400" />
             {t("recentActivity", "Recent Activity")}
           </h2>
           <div className="space-y-4">
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users size={14} className="text-blue-600 dark:text-blue-400" />
                 </div>
                 <div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      New student <span className="font-medium">John Doe</span> was enrolled.
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen size={14} className="text-green-600 dark:text-green-400" />
                 </div>
                 <div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      Course <span className="font-medium">CS101</span> schedule updated.
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">5 hours ago</p>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Building size={14} className="text-purple-600 dark:text-purple-400" />
                 </div>
                 <div>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      New branch <span className="font-medium">North Campus</span> created.
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">1 day ago</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

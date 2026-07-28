import React, { useState } from "react";
import { Button, TextInput } from '@/lib/flowbite-compat';
import { GraduationCap, Award, Search, Plus, BookOpen } from "lucide-react";

import TrainingCoursesTab from "./training/TrainingCoursesTab";
import TrainingCertificatesTab from "./training/TrainingCertificatesTab";

interface TrainingModuleProps {
  courses?: any[];
  certificates?: any[];
  employees?: any;
  onAddCourse?: () => void;
  [key: string]: any;
}

const TrainingModule: React.FC<TrainingModuleProps> = ({
  courses = [],
  certificates = [],
  onAddCourse,
}) => {
  const [tab, setTab] = useState<"COURSES" | "CERTIFICATES">("COURSES");
  const [search, setSearch] = useState("");

  const defaultCourses = courses.length > 0 ? courses : [
    { id: 1, title: "Enterprise Leadership & Management", category: "Executive", duration: "6 Weeks", level: "Advanced", description: "Strategic workforce management and leadership principles." },
    { id: 2, title: "Fullstack Java & React Architecture", category: "Engineering", duration: "8 Weeks", level: "Advanced", description: "Building scalable Spring Boot microservices and React frontends." },
    { id: 3, title: "POS & Inventory Operational Standard", category: "Retail", duration: "2 Weeks", level: "Intermediate", description: "Stock ledger control and retail point-of-sale workflows." },
  ];

  const defaultCertificates = certificates.length > 0 ? certificates : [
    { id: 101, employeeName: "Sokha Chan", courseTitle: "Enterprise Leadership & Management", issueDate: "2026-05-15", code: "CERT-LD-991" },
    { id: 102, employeeName: "Vandy Meas", courseTitle: "POS & Inventory Operational Standard", issueDate: "2026-06-10", code: "CERT-POS-882" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Navigation Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 shrink-0">
          {[
            { id: "COURSES", label: "Course Curriculum", icon: <BookOpen size={13} /> },
            { id: "CERTIFICATES", label: "Certifications", icon: <Award size={13} /> },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 border ${
                tab === item.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {item.icon} <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 justify-end shrink-0">
          <div className="relative w-56">
            <TextInput
              sizing="sm"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
              className="text-xs"
            />
          </div>
          {onAddCourse && (
            <Button color="blue" size="xs" onClick={onAddCourse} className="font-black uppercase text-[10px] rounded-lg">
              <Plus size={14} className="mr-1" /> Add Course
            </Button>
          )}
        </div>
      </div>

      {tab === "COURSES" && (
        <TrainingCoursesTab
          courses={defaultCourses}
          searchQuery={search}
          onOpenCourseModal={onAddCourse || (() => {})}
        />
      )}

      {tab === "CERTIFICATES" && (
        <TrainingCertificatesTab certificates={defaultCertificates} />
      )}
    </div>
  );
};

export default TrainingModule;

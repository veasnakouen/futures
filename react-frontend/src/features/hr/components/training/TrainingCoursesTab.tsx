import React from "react";
import { Badge, Button, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell } from '@/lib/flowbite-compat';
import { GraduationCap, Clock, Award, Plus } from "lucide-react";

interface TrainingCoursesTabProps {
  courses: any[];
  searchQuery: string;
  onOpenCourseModal: () => void;
}

const TrainingCoursesTab: React.FC<TrainingCoursesTabProps> = ({
  courses,
  searchQuery,
  onOpenCourseModal,
}) => {
  const filteredCourses = courses.filter((c) =>
    (c.title || c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div>
          <h4 className="font-black text-sm uppercase dark:text-white">Training Course Directory</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase">Manage skill development programs and curricula</p>
        </div>
        <Button color="blue" size="xs" onClick={onOpenCourseModal} className="font-black uppercase text-[9px] rounded-lg">
          <Plus size={14} className="mr-1" /> New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-3 text-center py-12 bg-white dark:bg-gray-800 rounded-xl border text-xs font-bold text-gray-400 uppercase">
            No training courses registered
          </div>
        ) : (
          filteredCourses.map((course, idx) => (
            <div key={course.id || idx} className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20">
                    <GraduationCap size={20} />
                  </div>
                  <Badge color="info" className="text-[8px] uppercase">{course.category || "General"}</Badge>
                </div>
                <h4 className="font-black text-base dark:text-white uppercase mb-1">{course.title || course.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{course.description || "Comprehensive skill development program."}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 border-t pt-3">
                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration || "4 Weeks"}</span>
                <span className="flex items-center gap-1"><Award size={12} className="text-emerald-500" /> {course.level || "Intermediate"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainingCoursesTab;

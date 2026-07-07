import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {Button, Badge, Progress, Label} from '@/lib/flowbite-compat';
import {
  Award,
  Play,
  CheckCircle,
  Clock,
  Search,
  BookOpen,
  Plus,
  Calendar,
  Trash2,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import ModernTabs from "@/components/common/ModernTabs";
import DatePicker from '@/components/common/DatePicker';
import { format } from "date-fns";

interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  chapters: string[];
  quiz: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

interface Enrollment {
  id: string;
  employeeId: number;
  employeeName: string;
  employeePhoto?: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  status: "Completed" | "In Progress" | "Not Started";
  enrolledAt: string;
  completedAt: string | null;
  deadline: string;
}

interface TrainingModuleProps {
  employees?: any[];
}

const TrainingModule: React.FC<TrainingModuleProps> = ({ employees = [] }) => {
  const { user } = useAuthStore();
  // Core Tab State
  const [activeTab, setActiveTab] = useState<"catalog" | "admin">("catalog");
  const [activeEmployees, setActiveEmployees] = useState<any[]>(
    employees || [],
  );

  // LMS Storage States
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // Modals
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeChaptersProgress, setActiveChaptersProgress] =
    useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [learningModalTab, setLearningModalTab] = useState<"study" | "quiz">(
    "study",
  );

  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isAssignCourseOpen, setIsAssignCourseOpen] = useState(false);

  // Forms
  const [newCourse, setNewCourse] = useState({
    title: "",
    provider: "",
    duration: "",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    description: "",
    chaptersText:
      "Chapter 1: Introduction\nChapter 2: Best Practices\nChapter 3: Conclusion",
  });

  const [newEnrollment, setNewEnrollment] = useState({
    employeeId: "",
    courseId: "",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  // Fetch data from backend database
  const fetchLmsData = async () => {
    try {
      setLoading(true);

      // 1. Fetch courses
      const coursesRes = await api.get("/employee-trainings/courses");
      const parsedCourses = coursesRes.data.map((c: any) => ({
        id: String(c.id),
        title: c.title,
        provider: c.provider,
        duration: c.duration,
        difficulty: c.difficulty,
        description: c.description,
        chapters:
          typeof c.chapters === "string" ? JSON.parse(c.chapters) : c.chapters,
        quiz: typeof c.quiz === "string" ? JSON.parse(c.quiz) : c.quiz,
      }));
      setCourses(parsedCourses);

      // 2. Fetch enrollments
      const enrollRes = await api.get("/employee-trainings/enrollments");
      const mappedEnrollments = enrollRes.data.map((e: any) => ({
        id: String(e.id),
        employeeId: e.employee.id,
        employeeName: `${e.employee.firstNameEnglish} ${e.employee.lastNameEnglish}`,
        employeePhoto: e.employee.photo,
        courseId: String(e.course.id),
        courseTitle: e.course.title,
        progress: e.progress,
        status: e.status,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
        deadline: e.deadline,
      }));
      setEnrollments(mappedEnrollments);

      // 3. Fetch all active staff to ensure dropdown is fully dynamic and mapped to primary keys
      try {
        const empRes = await api.get("/employees", { params: { size: 1000 } });
        if (empRes.data && empRes.data.content) {
          setActiveEmployees(empRes.data.content);
        }
      } catch (empErr) {
        console.warn(
          "Failed to fetch full employee list for LMS dropdown, using props:",
          empErr,
        );
      }
    } catch (err: any) {
      console.error("Failed to sync LMS data with database:", err);
      toast.error("LMS Database sync failed. Using local failover.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLmsData();
  }, []);

  useEffect(() => {
    if (employees && employees.length > 0) {
      setActiveEmployees(employees);
    }
  }, [employees]);

  // Learning Interaction Handlers
  const handleLaunchLearning = (course: Course) => {
    const userEnrollment = enrollments.find((e) => e.courseId === course.id);
    setSelectedCourse(course);
    setLearningModalTab("study");
    setQuizAnswers({});
    if (userEnrollment) {
      setActiveChaptersProgress(userEnrollment.progress);
    } else {
      setActiveChaptersProgress(0);
    }
  };

  const handleQuizAnswerSelect = (qIdx: number, oIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleCompleteStudy = async () => {
    setActiveChaptersProgress(100);
    try {
      const userEnroll = enrollments.find(
        (e) => e.courseId === selectedCourse?.id,
      );
      if (userEnroll) {
        await api.put(
          `/employee-trainings/enrollments/${userEnroll.id}/progress`,
          null,
          {
            params: { progress: 100, status: "In Progress" },
          },
        );
        fetchLmsData();
      }
      toast.success("Study materials completed! Proceed to Assessment Quiz.");
      setLearningModalTab("quiz");
    } catch (err: any) {
      toast.error("Failed to record learning progress.");
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedCourse) return;

    const unanswered = selectedCourse.quiz.some(
      (_, idx) => quizAnswers[idx] === undefined,
    );
    if (unanswered) {
      toast.error("Please answer all assessment questions before submitting.");
      return;
    }

    const allCorrect = selectedCourse.quiz.every(
      (q, idx) => quizAnswers[idx] === q.answer,
    );
    if (!allCorrect) {
      toast.error(
        "Some answers are incorrect. Please review the material and try again!",
      );
      return;
    }

    try {
      const userEnroll = enrollments.find(
        (e) => e.courseId === selectedCourse.id,
      );
      if (userEnroll) {
        await api.put(
          `/employee-trainings/enrollments/${userEnroll.id}/progress`,
          null,
          {
            params: { progress: 100, status: "Completed" },
          },
        );
      } else {
        // Enroll and complete dynamically for currently logged in student
        const loggedInEmployee = activeEmployees.find(
          (emp) => emp.email === user?.email,
        );
        const activeEmpId = loggedInEmployee?.id || activeEmployees[0]?.id || 1;
        const params = new URLSearchParams();
        params.append("employeeId", String(activeEmpId));
        params.append("courseId", selectedCourse.id);
        params.append(
          "deadline",
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        );

        const enrollRes = await api.post(
          `/employee-trainings/enrollments?${params.toString()}`,
        );
        await api.put(
          `/employee-trainings/enrollments/${enrollRes.data.id}/progress`,
          null,
          {
            params: { progress: 100, status: "Completed" },
          },
        );
      }

      await fetchLmsData();
      toast.success(`Congratulations! You passed ${selectedCourse.title}!`);
      setSelectedCourse(null);
    } catch (err: any) {
      toast.error("Failed to save assessment results to database.");
    }
  };

  // Admin Course Creation Handler
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newCourse.title ||
      !newCourse.provider ||
      !newCourse.duration ||
      !newCourse.description
    ) {
      toast.error("Please fill in all core course fields.");
      return;
    }

    try {
      const chapters = newCourse.chaptersText
        .split("\n")
        .filter((line) => line.trim());
      const payload = {
        title: newCourse.title,
        provider: newCourse.provider,
        duration: newCourse.duration,
        difficulty: newCourse.difficulty,
        description: newCourse.description,
        chapters: JSON.stringify(chapters),
        quiz: JSON.stringify([
          {
            question: "What is the compliance standard for this policy?",
            options: [
              "None",
              "Ad-hoc updates",
              "Strict adherence & mandatory documentation",
              "Optional review",
            ],
            answer: 2,
          },
        ]),
      };

      await api.post("/employee-trainings/courses", payload);
      toast.success("New course added to database catalog!");
      fetchLmsData();
      setIsCreateCourseOpen(false);
      setNewCourse({
        title: "",
        provider: "",
        duration: "",
        difficulty: "Beginner",
        description: "",
        chaptersText:
          "Chapter 1: Introduction\nChapter 2: Best Practices\nChapter 3: Conclusion",
      });
    } catch (err: any) {
      toast.error("Failed to create course in backend database.");
    }
  };

  // Admin Course Assignment Handler
  const handleAssignCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnrollment.employeeId || !newEnrollment.courseId) {
      toast.error("Please select both a staff member and a course.");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("employeeId", newEnrollment.employeeId);
      params.append("courseId", newEnrollment.courseId);
      params.append("deadline", newEnrollment.deadline);

      await api.post(`/employee-trainings/enrollments?${params.toString()}`);
      toast.success("Staff enrolled dynamically in database!");
      fetchLmsData();
      setIsAssignCourseOpen(false);
      setNewEnrollment({
        employeeId: "",
        courseId: "",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to enroll staff member in database.",
      );
    }
  };

  const handleDeleteEnrollment = async (enrollId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this staff course enrollment?",
      )
    )
      return;
    try {
      await api.delete(`/employee-trainings/enrollments/${enrollId}`);
      toast.success("Enrollment deleted from database.");
      fetchLmsData();
    } catch (err: any) {
      toast.error("Failed to delete enrollment.");
    }
  };

  const handleManualComplete = async (enrollId: string) => {
    try {
      await api.put(
        `/employee-trainings/enrollments/${enrollId}/progress`,
        null,
        {
          params: { progress: 100, status: "Completed" },
        },
      );
      toast.success("Enrollment marked as Completed in database!");
      fetchLmsData();
    } catch (err: any) {
      toast.error("Failed to update enrollment progress.");
    }
  };

  // Filtering Calculations
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter
      ? c.difficulty === difficultyFilter
      : true;
    return matchesSearch && matchesDifficulty;
  });

  const filteredEnrollments = enrollments.filter((e) => {
    return (
      e.employeeName.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(adminSearchQuery.toLowerCase())
    );
  });

  // Metrics Calculations
  const totalEnrolled = enrollments.length;
  const completedEnrolled = enrollments.filter(
    (e) => e.status === "Completed",
  ).length;
  const inProgressEnrolled = enrollments.filter(
    (e) => e.status === "In Progress",
  ).length;
  const completionRate =
    totalEnrolled > 0
      ? Math.round((completedEnrolled / totalEnrolled) * 100)
      : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm">
        <div>
          <h3 className="text-2xl font-black dark:text-white tracking-tight">
            LMS & Development Hub
          </h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Enterprise Staff Learning & compliance portal
          </p>
        </div>
        <div className="mt-2 sm:mt-0">
          <ModernTabs
            tabs={[
              { id: "catalog", label: "My Catalog" },
              { id: "admin", label: "Admin Dashboard" },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as any)}
          />
        </div>
      </div>

      {/* -------------------- MY CATALOG TAB -------------------- */}
      {activeTab === "catalog" && (
        <div className="space-y-8">
          {/* Search Filters Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search by course name or provider..."
                className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-sm font-bold h-14 pl-12 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-400/50 dark:hover:ring-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="block w-full md:w-64 border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold h-14 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-400/50 dark:hover:ring-blue-500/50 px-4"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="" className="dark:bg-gray-800">
                All Difficulty Levels
              </option>
              <option value="Beginner" className="dark:bg-gray-800">
                Beginner
              </option>
              <option value="Intermediate" className="dark:bg-gray-800">
                Intermediate
              </option>
              <option value="Advanced" className="dark:bg-gray-800">
                Advanced
              </option>
            </select>
          </div>

          {/* Course Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const userEnroll = enrollments.find(
                (e) => e.courseId === course.id,
              );
              const progressVal = userEnroll ? userEnroll.progress : 0;
              const statusText = userEnroll ? userEnroll.status : "Not Started";

              return (
                <div
                  key={course.id}
                  className="group relative overflow-hidden border-none shadow-lg hover:shadow-md hover:scale-[1.01] transition-all duration-300 dark:bg-gray-800 rounded-md p-0 flex flex-col h-full"
                >
                  <div className="h-44 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 flex flex-col justify-between relative">
                    <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/20 transition-all">
                      <Award size={48} strokeWidth={1.5} />
                    </div>
                    <Badge
                      color={
                        statusText === "Completed"
                          ? "success"
                          : statusText === "In Progress"
                            ? "warning"
                            : "gray"
                      }
                      className="w-fit rounded-md px-3 text-[9px] font-black uppercase tracking-wider"
                    >
                      {statusText}
                    </Badge>
                    <div>
                      <span className="text-[9px] font-black text-white/50 uppercase tracking-widest block">
                        {course.difficulty} Level
                      </span>
                      <h4 className="text-white font-black text-lg leading-tight mt-1">
                        {course.title}
                      </h4>
                    </div>
                  </div>
                  <div className="p-6 space-y-6 flex-1 flex flex-col justify-between bg-white dark:bg-gray-800">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex justify-between items-center text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider border-b pb-4">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} /> {course.duration}
                      </span>
                      <span>{course.provider}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                        <span className="text-gray-400 dark:text-gray-500">
                          Learning Progress
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                          {progressVal}%
                        </span>
                      </div>
                      <Progress
                        progress={progressVal}
                        color="blue"
                        size="sm"
                        className="rounded-md"
                      />
                    </div>

                    <Button
                      color={statusText === "Completed" ? "light" : "blue"}
                      onClick={() => handleLaunchLearning(course)}
                      className="w-full rounded-md font-black uppercase tracking-wider text-[10px] h-12 shadow-sm"
                    >
                      {statusText === "Completed" ? (
                        <>
                          <CheckCircle
                            size={16}
                            className="mr-2 text-emerald-500"
                          />{" "}
                          Review Content
                        </>
                      ) : (
                        <>
                          <Play size={16} className="mr-2" />{" "}
                          {statusText === "In Progress"
                            ? "Resume Learning"
                            : "Start Course"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expiring Certification alert */}
          <div className="p-8 bg-amber-50 dark:bg-amber-950/20 rounded-md border-amber-200 dark:border-amber-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="font-black dark:text-white text-base">
                  Safeguarding Certifications EXPIRING
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">
                  You have 3 staff certifications expiring within the next 90
                  days. Mandatory refresher cycles are open.
                </p>
              </div>
            </div>
            <Button
              color="warning"
              onClick={() => setActiveTab("admin")}
              className="rounded-md px-6 font-black uppercase text-[10px] tracking-wider h-11 border-none shadow-md shadow-amber-500/10 text-white bg-amber-500 hover:bg-amber-600"
            >
              Review Staff matrix
            </Button>
          </div>
        </div>
      )}

      {/* -------------------- ADMIN DASHBOARD TAB -------------------- */}
      {activeTab === "admin" && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <BookOpen size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Enrolled Staff
                </p>
                <h4 className="text-2xl font-black dark:text-white mt-1">
                  {totalEnrolled} Nodes
                </h4>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <UserCheck size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Completion Rate
                </p>
                <h4 className="text-2xl font-black dark:text-white mt-1">
                  {completionRate}%
                </h4>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Award size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Total Courses
                </p>
                <h4 className="text-2xl font-black dark:text-white mt-1">
                  {courses.length} Courses
                </h4>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Active learning
                </p>
                <h4 className="text-2xl font-black dark:text-white mt-1">
                  {inProgressEnrolled} Active
                </h4>
              </div>
            </div>
          </div>

          {/* Admin Tool Actions Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm">
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors z-10">
                <Search size={16} strokeWidth={2.5} />
              </div>
              <input
                type="text"
                placeholder="Search by staff name or course..."
                className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold h-12 pl-10 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-400/50 dark:hover:ring-blue-500/50"
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex w-full md:w-auto gap-3">
              <Button
                color="light"
                onClick={() => setIsCreateCourseOpen(true)}
                className="rounded-md px-4 h-12 font-black uppercase tracking-wider text-[10px] flex-1 md:flex-none hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus size={16} className="mr-2 text-indigo-600" /> Create
                Course
              </Button>
              <Button
                color="blue"
                onClick={() => setIsAssignCourseOpen(true)}
                className="rounded-md px-6 h-12 font-black uppercase tracking-wider text-[10px] shadow-lg shadow-blue-500/10 flex-1 md:flex-none"
              >
                <UserCheck size={16} className="mr-2" /> Assign Course
              </Button>
            </div>
          </div>

          {/* Staff Training Matrix Table */}
          <div className="border-none shadow-sm dark:bg-gray-800 overflow-hidden rounded-md p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 dark:bg-gray-700/80 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b">
                    <th className="px-6 py-4.5">Staff Member</th>
                    <th className="px-6 py-4.5">Course Assigned</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-6 py-4.5">Progress</th>
                    <th className="px-6 py-4.5">Enrolled Date</th>
                    <th className="px-6 py-4.5">Deadline</th>
                    <th className="px-6 py-4.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredEnrollments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-xs font-bold text-gray-400"
                      >
                        No staff training records found matching the search.
                      </td>
                    </tr>
                  ) : (
                    filteredEnrollments.map((enroll) => (
                      <tr
                        key={enroll.id}
                        className="hover:bg-gray-50/30 dark:hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-gray-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                              {enroll.employeePhoto ? (
                                <img
                                  src={enroll.employeePhoto}
                                  className="w-full h-full object-cover"
                                  alt="Staff"
                                />
                              ) : (
                                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">
                                  {enroll.employeeName.substring(0, 2)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-black dark:text-white leading-none">
                                {enroll.employeeName}
                              </p>
                              <p className="text-[8px] font-mono text-gray-400 mt-1">
                                ID: #{enroll.employeeId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold dark:text-gray-300 leading-tight">
                            {enroll.courseTitle}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            color={
                              enroll.status === "Completed"
                                ? "success"
                                : enroll.status === "In Progress"
                                  ? "warning"
                                  : "gray"
                            }
                            className="rounded-md w-fit px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider"
                          >
                            {enroll.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 min-w-[120px]">
                            <Progress
                              progress={enroll.progress}
                              color="blue"
                              size="xs"
                              className="w-full rounded-md"
                            />
                            <span className="text-[10px] font-black dark:text-gray-400">
                              {enroll.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
                            {enroll.enrolledAt}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500">
                            <Calendar size={12} />
                            <span>{enroll.deadline}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {enroll.status !== "Completed" && (
                              <button
                                onClick={() => handleManualComplete(enroll.id)}
                                title="Mark as Completed"
                                className="p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteEnrollment(enroll.id)}
                              title="Remove Enrollment"
                              className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 1. LEARNING MODAL -------------------- */}
      {selectedCourse &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-md w-full max-w-3xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                    Study Portal
                  </span>
                  <h4 className="text-xl font-black leading-tight mt-1">
                    {selectedCourse.title}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-white/60 hover:text-white text-2xl font-bold leading-none p-2 rounded-md hover:bg-white/10"
                >
                  &times;
                </button>
              </div>

              {/* Modal Sub-Tabs */}
              <div className="flex border-b px-8 py-2 bg-gray-50/50 dark:bg-gray-800/50">
                <button
                  onClick={() => setLearningModalTab("study")}
                  className={`px-6 py-3 font-black text-[10px] uppercase tracking-wider border-b-2 transition-all ${learningModalTab ==="study"?"border-blue-600 text-blue-600 dark:text-blue-400":"border-transparent text-gray-400 hover:text-gray-600"}`}
                >
                  1. Course Study
                </button>
                <button
                  onClick={() => {
                    if (activeChaptersProgress < 100) {
                      toast.error("Please complete study sections first.");
                      return;
                    }
                    setLearningModalTab("quiz");
                  }}
                  disabled={activeChaptersProgress < 100}
                  className={`px-6 py-3 font-black text-[10px] uppercase tracking-wider border-b-2 transition-all disabled:opacity-40 ${learningModalTab ==="quiz"?"border-blue-600 text-blue-600 dark:text-blue-400":"border-transparent text-gray-400 hover:text-gray-600"}`}
                >
                  2. Assessment Quiz
                </button>
              </div>

              {/* Modal Content Scroll Area */}
              <div className="p-8 overflow-y-auto flex-1 space-y-6 max-h-[500px]">
                {/* TAB A: STUDY CHAPTERS */}
                {learningModalTab === "study" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h5 className="font-black text-sm dark:text-white uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Course Syllabus
                      </h5>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                        {selectedCourse.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      {selectedCourse.chapters.map((chapter, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-md flex items-start gap-4"
                        >
                          <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xs flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <h6 className="text-xs font-black dark:text-white uppercase tracking-wider">
                              {chapter}
                            </h6>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
                              Includes mandatory slideshow lecture, security
                              case studies, and compliance checklists.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Learning Progress Slider */}
                    <div className="p-6 bg-blue-50/50 dark:bg-blue-950/10 rounded-md border-blue-100 dark:border-blue-900/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <h6 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Info size={14} /> Slide Simulator
                        </h6>
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">
                          {activeChaptersProgress}% Read
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 leading-normal">
                        Slide the progress bar to simulate reading and complete
                        all modules. Completing the slides unlocks the
                        Assessment Quiz!
                      </p>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={activeChaptersProgress}
                        onChange={(e) =>
                          setActiveChaptersProgress(Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-md appearance-none cursor-pointer accent-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* TAB B: ASSESSMENT QUIZ */}
                {learningModalTab === "quiz" && (
                  <div className="space-y-8">
                    <div className="bg-emerald-50 dark:bg-emerald-950/15 p-4 rounded-md border-emerald-100 dark:border-emerald-900/30 flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        className="text-emerald-500 mt-0.5"
                      />
                      <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 leading-normal">
                        Study requirements met! Please select the correct
                        options for the quiz below. You need 100% correct
                        answers to pass the certification assessment.
                      </p>
                    </div>

                    {selectedCourse.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-4">
                        <h5 className="font-black text-xs dark:text-white uppercase tracking-wider leading-relaxed">
                          Question {qIdx + 1}: {q.question}
                        </h5>
                        <div className="grid grid-cols-1 gap-3">
                          {q.options.map((option, oIdx) => {
                            const isSelected = quizAnswers[qIdx] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() =>
                                  handleQuizAnswerSelect(qIdx, oIdx)
                                }
                                className={`w-full text-left p-4.5 rounded-md text-xs font-bold transition-all duration-200 ${isSelected ?"bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10":"bg-white dark:bg-gray-700/20 dark:text-gray-300  hover:bg-gray-50 dark:hover:bg-gray-700/50"}`}
                              >
                                <span className="inline-block w-6 font-mono text-[10px] font-black uppercase text-gray-400 group-hover:text-blue-500 mr-2">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="px-8 py-5 border-t bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
                <Button
                  color="light"
                  onClick={() => setSelectedCourse(null)}
                  className="rounded-md px-6 font-black uppercase text-[10px] tracking-wider h-11"
                >
                  Close
                </Button>
                {learningModalTab === "study" ? (
                  <Button
                    color="blue"
                    onClick={handleCompleteStudy}
                    className="rounded-md px-8 font-black uppercase text-[10px] tracking-wider h-11 shadow-lg shadow-blue-500/15 h-12"
                  >
                    Go to Assessment <ArrowRight size={14} className="ml-2" />
                  </Button>
                ) : (
                  <Button
                    color="success"
                    onClick={handleSubmitQuiz}
                    className="rounded-md px-8 font-black uppercase text-[10px] tracking-wider h-11 shadow-lg shadow-emerald-500/15"
                  >
                    Submit Assessment
                  </Button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* -------------------- 2. CREATE COURSE MODAL -------------------- */}
      {isCreateCourseOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-md w-full max-w-xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">
                    Create Training Course
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Publish a brand-new course to the catalog
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateCourseOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none p-2 rounded-md"
                >
                  &times;
                </button>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleCreateCourse}
                className="p-8 overflow-y-auto flex-1 space-y-5"
              >
                <div className="space-y-1.5">
                  <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                    Course Title
                  </Label>
                  <input
                    type="text"
                    placeholder="e.g. Workplace Safety & Health"
                    required
                    className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold h-12 ring-1 ring-gray-200 dark:ring-gray-700 px-4"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                      Provider Name
                    </Label>
                    <input
                      type="text"
                      placeholder="e.g. MTP Safety"
                      required
                      className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold h-12 ring-1 ring-gray-200 dark:ring-gray-700 px-4"
                      value={newCourse.provider}
                      onChange={(e) =>
                        setNewCourse((prev) => ({
                          ...prev,
                          provider: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                      Duration / Hours
                    </Label>
                    <input
                      type="text"
                      placeholder="e.g. 3h 30m"
                      required
                      className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold h-12 ring-1 ring-gray-200 dark:ring-gray-700 px-4"
                      value={newCourse.duration}
                      onChange={(e) =>
                        setNewCourse((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                    Difficulty Level
                  </Label>
                  <select
                    className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold h-12 ring-1 ring-gray-200 dark:ring-gray-700 px-4"
                    value={newCourse.difficulty}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        difficulty: e.target.value as any,
                      }))
                    }
                  >
                    <option value="Beginner" className="dark:bg-gray-800">
                      Beginner Level
                    </option>
                    <option value="Intermediate" className="dark:bg-gray-800">
                      Intermediate Level
                    </option>
                    <option value="Advanced" className="dark:bg-gray-800">
                      Advanced Level
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                    Description
                  </Label>
                  <textarea
                    placeholder="Short summary detailing learning scope..."
                    required
                    rows={3}
                    className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold p-4 ring-1 ring-gray-200 dark:ring-gray-700"
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                    Course Syllabus (Chapters, One Per Line)
                  </Label>
                  <textarea
                    required
                    rows={3}
                    className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold p-4 ring-1 ring-gray-200 dark:ring-gray-700"
                    value={newCourse.chaptersText}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        chaptersText: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t flex justify-end gap-3">
                  <Button
                    color="light"
                    onClick={() => setIsCreateCourseOpen(false)}
                    className="rounded-md px-6 font-black uppercase text-[10px] tracking-wider h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="blue"
                    type="submit"
                    className="rounded-md px-8 font-black uppercase text-[10px] tracking-wider h-11 shadow-lg shadow-blue-500/10 h-12"
                  >
                    Publish Course
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* -------------------- 3. ASSIGN COURSE MODAL -------------------- */}
      {isAssignCourseOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-md w-full max-w-md overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">
                    Assign Course Enrollment
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Enroll workforce members in courses
                  </p>
                </div>
                <button
                  onClick={() => setIsAssignCourseOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none p-2 rounded-md"
                >
                  &times;
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAssignCourse} className="p-8 space-y-5">
                <div className="space-y-1.5">
                  <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                    1. Select Staff Member
                  </Label>
                  <select
                    required
                    className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold h-12 ring-1 ring-gray-200 dark:ring-gray-700 px-4"
                    value={newEnrollment.employeeId}
                    onChange={(e) =>
                      setNewEnrollment((prev) => ({
                        ...prev,
                        employeeId: e.target.value,
                      }))
                    }
                  >
                    <option value="" className="dark:bg-gray-800">
                      -- Choose Personnel --
                    </option>
                    {activeEmployees.length > 0 ? (
                      activeEmployees.map((emp) => (
                        <option
                          key={emp.id}
                          value={emp.id}
                          className="dark:bg-gray-800"
                        >
                          {emp.firstNameEnglish} {emp.lastNameEnglish} (ID: #
                          {emp.idNo || emp.id})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="101" className="dark:bg-gray-800">
                          Sopheap Keo (ID: #101)
                        </option>
                        <option value="102" className="dark:bg-gray-800">
                          Chantha Vorn (ID: #102)
                        </option>
                        <option value="103" className="dark:bg-gray-800">
                          Vannak Meas (ID: #103)
                        </option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                    2. Select Target Course
                  </Label>
                  <select
                    required
                    className="block w-full border-0 bg-gray-50/50 hover:bg-gray-100/30 dark:bg-gray-700/30 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white rounded-md focus:ring-1 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-xs font-bold h-12 ring-1 ring-gray-200 dark:ring-gray-700 px-4"
                    value={newEnrollment.courseId}
                    onChange={(e) =>
                      setNewEnrollment((prev) => ({
                        ...prev,
                        courseId: e.target.value,
                      }))
                    }
                  >
                    <option value="" className="dark:bg-gray-800">
                      -- Select Compliance Course --
                    </option>
                    {courses.map((course) => (
                      <option
                        key={course.id}
                        value={course.id}
                        className="dark:bg-gray-800"
                      >
                        {course.title} ({course.provider})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">
                    3. Completion Deadline
                  </Label>
                  <DatePicker
                    value={
                      newEnrollment.deadline
                        ? new Date(newEnrollment.deadline + "T00:00:00")
                        : null
                    }
                    onChange={(date) =>
                      setNewEnrollment((prev) => ({
                        ...prev,
                        deadline: format(date, "yyyy-MM-dd"),
                      }))
                    }
                  />
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t flex justify-end gap-3">
                  <Button
                    color="light"
                    onClick={() => setIsAssignCourseOpen(false)}
                    className="rounded-md px-6 font-black uppercase text-[10px] tracking-wider h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="blue"
                    type="submit"
                    className="rounded-md px-8 font-black uppercase text-[10px] tracking-wider h-11 shadow-lg shadow-blue-500/10 h-12"
                  >
                    Enroll Staff
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default TrainingModule;

import React from "react";
import { Badge } from "@/lib/flowbite-compat";
import { Award, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface Props {
  state: any;
}

export default function SupportEvaluationTab({ state }: Props) {
  const { staffEvaluationData, handleOpenAssessmentModal, canPerformAssessment } = state;

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700/50">
        <div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="text-indigo-600" size={22} /> Technician Performance & Ticket Evaluation Matrix
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Automated quality audit tracking reopen rates, resolution speed, and technical grades.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4 rounded-l-xl">Technician / Staff Member</th>
              <th className="p-4">Department Scope</th>
              <th className="p-4 text-center">Total Assigned</th>
              <th className="p-4 text-center">Completion Rate</th>
              <th className="p-4 text-center">Reopen Rate</th>
              <th className="p-4 text-center">Performance Grade</th>
              <th className="p-4 text-right rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {staffEvaluationData.map((rec: any) => (
              <tr key={rec.staffId} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all">
                <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 font-black text-xs flex items-center justify-center">
                    {rec.staffName.charAt(0)}
                  </div>
                  {rec.staffName}
                </td>
                <td className="p-4 text-xs font-semibold text-gray-500">{rec.department}</td>
                <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-200">{rec.totalAssigned}</td>
                <td className="p-4 text-center">
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{rec.completionRate}%</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`font-bold ${rec.reopenRate > 15 ? "text-rose-600" : "text-gray-600"}`}>
                    {rec.reopenRate}%
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${
                      rec.gradeColor === "emerald"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200"
                        : rec.gradeColor === "blue"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200"
                        : rec.gradeColor === "amber"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200"
                    }`}
                  >
                    Grade {rec.grade}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {canPerformAssessment && (
                    <button
                      onClick={() => handleOpenAssessmentModal(Number(rec.staffId) || 101)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-all"
                    >
                      Audit Assessment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

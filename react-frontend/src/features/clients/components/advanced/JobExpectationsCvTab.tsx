import React from "react";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge } from "@/lib/flowbite-compat";
import { Plus, Edit, Trash2, Briefcase, Award, GraduationCap } from "lucide-react";

interface JobExpectationsCvTabProps {
  jobExpectations: any[];
  languages: any[];
  computerSkills: any[];
  jobExperiences: any[];
  personalities: any[];
  onOpenJobExpModal: () => void;
  onOpenLangModal: () => void;
  onOpenSkillModal: () => void;
  onOpenExpModal: () => void;
  onOpenPersonalityModal: () => void;
  onDeleteItem: (type: string, id: number) => void;
}

export const JobExpectationsCvTab: React.FC<JobExpectationsCvTabProps> = ({
  jobExpectations = [],
  languages = [],
  computerSkills = [],
  jobExperiences = [],
  personalities = [],
  onOpenJobExpModal,
  onOpenLangModal,
  onOpenSkillModal,
  onOpenExpModal,
  onOpenPersonalityModal,
  onDeleteItem,
}) => {
  return (
    <div className="pt-3 space-y-8 animate-fade-in">
      {/* 1. Job Expectations Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-black dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Briefcase size={20} className="text-blue-600" /> Job Expectations & Work Preferences
          </h3>
          <Button color="blue" onClick={onOpenJobExpModal} className="font-bold text-xs">
            <Plus size={16} className="mr-1" /> Add Expectation
          </Button>
        </div>

        <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Table hoverable>
            <TableHead className="bg-gray-50 dark:bg-gray-900 border-b">
              <TableHeadCell className="font-bold">Employment Type</TableHeadCell>
              <TableHeadCell className="font-bold">Salary Expectation</TableHeadCell>
              <TableHeadCell className="font-bold">Available Time</TableHeadCell>
              <TableHeadCell className="font-bold">Note</TableHeadCell>
              <TableHeadCell className="font-bold text-right">Action</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {jobExpectations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-6 text-xs font-bold">
                    No job expectation records found.
                  </TableCell>
                </TableRow>
              ) : (
                jobExpectations.map((item) => (
                  <TableRow key={item.id} className="bg-white dark:bg-gray-900 border-b">
                    <TableCell className="font-bold dark:text-white">{item.employmentType}</TableCell>
                    <TableCell className="font-mono text-xs text-emerald-600 font-bold">
                      ${item.salaryExpectation || "N/A"}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{item.availableTime || "Immediate"}</TableCell>
                    <TableCell className="text-xs text-gray-500">{item.note || "-"}</TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => onDeleteItem("jobExpectation", item.id)}
                        className="text-red-600 hover:underline text-xs font-bold"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 2. Languages & Technical Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Languages */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-black dark:text-white uppercase tracking-tight">
              Languages Spoken
            </h4>
            <Button color="light" size="xs" onClick={onOpenLangModal} className="font-bold">
              <Plus size={14} className="mr-1" /> Add Language
            </Button>
          </div>
          <div className="space-y-2 border border-gray-100 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-gray-800">
            {languages.length === 0 ? (
              <p className="text-xs text-gray-400 font-bold text-center py-4">No language records</p>
            ) : (
              languages.map((l) => (
                <div key={l.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-xs font-bold dark:text-white">{l.name}</span>
                  <Badge color="info" size="xs">{l.level}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-base font-black dark:text-white uppercase tracking-tight">
              Technical & Computer Skills
            </h4>
            <Button color="light" size="xs" onClick={onOpenSkillModal} className="font-bold">
              <Plus size={14} className="mr-1" /> Add Skill
            </Button>
          </div>
          <div className="space-y-2 border border-gray-100 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-gray-800">
            {computerSkills.length === 0 ? (
              <p className="text-xs text-gray-400 font-bold text-center py-4">No skill records</p>
            ) : (
              computerSkills.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-xs font-bold dark:text-white">{s.skill}</span>
                  <Badge color="success" size="xs">{s.level}</Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobExpectationsCvTab;

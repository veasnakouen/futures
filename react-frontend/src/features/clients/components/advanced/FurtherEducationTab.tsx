import React from "react";
import { Button, Checkbox, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from "@/lib/flowbite-compat";
import { Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface FurtherEducationTabProps {
  furtherEducationForm: any;
  setFurtherEducationForm: (val: any) => void;
  handleSaveFurtherEducation: () => void;
  furtherEducationReferrals: any[];
  onOpenReferralModal: () => void;
  onDeleteReferral: (id: number) => void;
  onOpenReferralSourceModal: () => void;
}

export const FurtherEducationTab: React.FC<FurtherEducationTabProps> = ({
  furtherEducationForm,
  setFurtherEducationForm,
  handleSaveFurtherEducation,
  furtherEducationReferrals,
  onOpenReferralModal,
  onDeleteReferral,
  onOpenReferralSourceModal,
}) => {
  return (
    <div className="pt-3 space-y-8 animate-fade-in">
      {/* Education Type Options */}
      <div className="rounded-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 font-semibold text-gray-700 dark:text-gray-200 border-b">
          Education Type
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="font-semibold text-gray-800 dark:text-white mb-4">
              Choose the education type:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="uni"
                  checked={furtherEducationForm.university || false}
                  onChange={(e) =>
                    setFurtherEducationForm({
                      ...furtherEducationForm,
                      university: e.target.checked,
                    })
                  }
                />
                <label htmlFor="uni" className="text-sm font-medium dark:text-gray-200">
                  University / College
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="voc"
                  checked={furtherEducationForm.vocational || false}
                  onChange={(e) =>
                    setFurtherEducationForm({
                      ...furtherEducationForm,
                      vocational: e.target.checked,
                    })
                  }
                />
                <label htmlFor="voc" className="text-sm font-medium dark:text-gray-200">
                  Vocational Training Center
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              color="blue"
              onClick={handleSaveFurtherEducation}
              className="font-bold text-xs"
            >
              Save Education Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Referrals Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">
            Further Education Referrals
          </h3>
          <div className="flex items-center gap-2">
            <Button
              color="light"
              onClick={onOpenReferralSourceModal}
              className="font-bold text-xs"
            >
              Manage Sources
            </Button>
            <Button
              color="blue"
              onClick={onOpenReferralModal}
              className="font-bold text-xs"
            >
              <Plus size={16} className="mr-1" /> Add Referral
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Table hoverable>
            <TableHead className="bg-gray-50 dark:bg-gray-900 border-b">
              <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">ID</TableHeadCell>
              <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">Subject</TableHeadCell>
              <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300">Source</TableHeadCell>
              <TableHeadCell className="font-bold text-gray-600 dark:text-gray-300 text-right">Action</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {furtherEducationReferrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8 font-bold text-xs">
                    No education referrals recorded.
                  </TableCell>
                </TableRow>
              ) : (
                furtherEducationReferrals.map((r: any) => (
                  <TableRow key={r.id} className="bg-white dark:bg-gray-900 border-b">
                    <TableCell className="font-mono text-xs font-bold">{r.id}</TableCell>
                    <TableCell className="font-bold dark:text-white">
                      {r.furtherEducationReferralSubject?.subject || "N/A"}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-gray-500">
                      {r.educationReferralSource?.referralSource || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => onDeleteReferral(r.id)}
                        className="text-red-600 hover:underline text-xs font-bold flex items-center gap-1 ml-auto"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default FurtherEducationTab;

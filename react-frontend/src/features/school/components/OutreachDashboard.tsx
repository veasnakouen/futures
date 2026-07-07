import React, { useState } from "react";
import { useOutreachVisits, useCreateOutreachVisit } from "../../../hooks/useOutreach";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge, Spinner } from "@/lib/flowbite-compat";
import { Calendar, User, Search, MapPin, ClipboardList, Package, ExternalLink, Plus } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import OutreachVisitModal from "./OutreachVisitModal";

const OutreachDashboard = () => {
  const { data: visits = [], isLoading } = useOutreachVisits();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVisits = visits.filter((v: any) => 
    v.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.communityEntryNotes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="flex justify-center p-8"><Spinner size="xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="text-emerald-500" /> Community Outreach
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track community entries, needs assessments, and direct service deliveries.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search visits..."
              className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Log Visit
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <Table hoverable>
          <TableHead className="bg-gray-50 dark:bg-gray-700/50">
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Student/Beneficiary</TableHeadCell>
            <TableHeadCell>Pipeline Status</TableHeadCell>
            <TableHeadCell>Community Entry</TableHeadCell>
            <TableHeadCell>Score</TableHeadCell>
            <TableHeadCell>Needs Referral?</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y dark:divide-gray-700">
            {filteredVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">No outreach visits recorded yet.</TableCell>
              </TableRow>
            ) : filteredVisits.map((visit: any) => (
              <TableRow key={visit.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {visit.visitDate ? format(new Date(visit.visitDate), "MMM dd, yyyy") : "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{visit.studentId}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color={visit.status === 'APPROVED' ? 'success' : visit.status === 'REJECTED' ? 'failure' : 'info'}>
                    {visit.status || "NEW LEAD"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={visit.communityEntryNotes}>
                    {visit.communityEntryNotes || "N/A"}
                  </p>
                </TableCell>
                <TableCell>
                  {visit.assessmentScore !== undefined && visit.assessmentScore !== null ? (
                    <span className="font-semibold">{visit.assessmentScore}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {visit.referralNeeded ? (
                    <Badge color="failure" icon={ExternalLink}>Escalated</Badge>
                  ) : (
                    <Badge color="success" icon={ClipboardList}>Monitoring</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {isModalOpen && (
        <OutreachVisitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default OutreachDashboard;

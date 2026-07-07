import React, { useState } from "react";
import { useReferralCases, useUpdateReferralCase, useAddReferral, useUpdateReferral, useDepartments } from "../../../hooks/useOutreach";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Badge, Spinner, Select } from "@/lib/flowbite-compat";
import { Briefcase, User, Users, FileText, Heart, ShieldAlert, GraduationCap, Building, Search, ArrowRight, Activity } from "lucide-react";
import toast from "react-hot-toast";

const CaseManagementDashboard = () => {
  const { data: cases = [], isLoading: casesLoading } = useReferralCases();
  const { data: departments = [], isLoading: deptsLoading } = useDepartments();
  const [searchTerm, setSearchTerm] = useState("");
  const updateCase = useUpdateReferralCase();
  const addReferral = useAddReferral();
  const updateReferral = useUpdateReferral();

  const filteredCases = cases.filter((c: any) => 
    c.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.leadCoordinator?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (id: string, newStatus: string, originalCase: any) => {
    await updateCase.mutateAsync({ id, data: { ...originalCase, status: newStatus } });
  };


  const handleUpdateReferralStatus = async (referralId: string, newStatus: string, originalReferral: any) => {
    await updateReferral.mutateAsync({
      referralId,
      data: { ...originalReferral, status: newStatus }
    });
  };

  if (casesLoading || deptsLoading) return <div className="flex justify-center p-8"><Spinner size="xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="text-blue-500" /> Case Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Lead coordinator dashboard tracking all departmental referrals.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search cases..."
            className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-500">
            No referral cases found.
          </div>
        ) : filteredCases.map((c: any) => (
          <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Beneficiary</p>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                    <User className="w-4 h-4 text-emerald-500" /> {c.studentId}
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Lead Coordinator</p>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <FileText className="w-4 h-4 text-blue-500" /> {c.leadCoordinator || "Unassigned"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select sizing="sm" value={c.status} onChange={(e) => handleStatusChange(c.id, e.target.value, c)}>
                  <option value="CASE_PLANNING">1. Case Planning</option>
                  <option value="SERVICE_COORDINATION">2. Service Coordination</option>
                  <option value="MONITORING">3. Monitoring & Follow-up</option>
                  <option value="EXIT_PLANNING">4. Exit Planning</option>
                  <option value="CLOSED">5. Closed</option>
                </Select>
              </div>
            </div>
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Initial Case Plan</h4>
                  <Button size="xs" color="light" onClick={() => {
                    const planEl = document.getElementById(`plan-${c.id}`) as HTMLTextAreaElement;
                    if (planEl) {
                      updateCase.mutateAsync({
                        id: c.id,
                        data: { ...c, initialCasePlan: planEl.value }
                      });
                    }
                  }}>Save Plan</Button>
                </div>
                <textarea 
                  id={`plan-${c.id}`}
                  className="w-full text-sm border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700" 
                  rows={2} 
                  defaultValue={c.initialCasePlan || ""}
                  placeholder="Write the initial strategy and objectives before routing to departments..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Monitoring & Follow-up</h4>
                  <Button size="xs" color="light" onClick={() => {
                    const monEl = document.getElementById(`mon-${c.id}`) as HTMLTextAreaElement;
                    if (monEl) {
                      updateCase.mutateAsync({
                        id: c.id,
                        data: { ...c, monitoringNotes: monEl.value }
                      });
                    }
                  }}>Save Notes</Button>
                </div>
                <textarea 
                  id={`mon-${c.id}`}
                  className="w-full text-sm border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700" 
                  rows={2} 
                  defaultValue={c.monitoringNotes || ""}
                  placeholder="Log ongoing check-ins and monitoring updates..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Exit Plan</h4>
                  <Button size="xs" color="light" onClick={() => {
                    const exitEl = document.getElementById(`exit-${c.id}`) as HTMLTextAreaElement;
                    if (exitEl) {
                      updateCase.mutateAsync({
                        id: c.id,
                        data: { ...c, exitPlan: exitEl.value }
                      });
                    }
                  }}>Save Plan</Button>
                </div>
                <textarea 
                  id={`exit-${c.id}`}
                  className="w-full text-sm border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700" 
                  rows={2} 
                  defaultValue={c.exitPlan || ""}
                  placeholder="Final transition strategy or graduation plan..."
                />
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">Department Referrals</h4>
                <div className="flex items-center gap-2">
                  <Select sizing="sm" id={`add-ref-${c.id}`} defaultValue="">
                    <option value="" disabled>Add Referral Branch...</option>
                    {departments.map((dept: any) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </Select>
                  <Button size="sm" onClick={() => {
                    const sel = document.getElementById(`add-ref-${c.id}`) as HTMLSelectElement;
                    const deptId = parseInt(sel.value, 10);
                    if (!isNaN(deptId)) {
                      addReferral.mutateAsync({
                        caseId: c.id,
                        data: { department: { id: deptId, name: "" }, status: "Pending", assignedTo: "Unassigned", notes: "" }
                      });
                    }
                    sel.value = "";
                  }}>Add</Button>
                </div>
              </div>

              {c.referrals && c.referrals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {c.referrals.map((ref: any) => {
                    const deptMeta = departments.find((d: any) => d.id === ref.department?.id);
                    const Icon = FileText;
                    return (
                      <div key={ref.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 text-blue-500`} />
                            <span className="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[150px]" title={deptMeta?.name || ref.department?.name}>
                              {deptMeta?.name || ref.department?.name || "Unknown Department"}
                            </span>
                          </div>
                          <Select sizing="sm" className="w-28 text-xs" value={ref.status} onChange={(e) => handleUpdateReferralStatus(ref.id, e.target.value, ref)}>
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Resolved">Resolved</option>
                          </Select>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <p><strong>Assigned:</strong> {ref.assignedTo || "Unassigned"}</p>
                          <p className="truncate" title={ref.notes}><strong>Notes:</strong> {ref.notes || "No notes"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No departmental referrals attached to this case yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseManagementDashboard;

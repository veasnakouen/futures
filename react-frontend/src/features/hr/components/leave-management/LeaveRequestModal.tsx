import React from "react";
import { Modal, ModalBody, Label, Select, Textarea } from "@/lib/flowbite-compat";
import CustomModalHeader from "@/components/common/CustomModalHeader";
import CustomModalFooter from "@/components/common/CustomModalFooter";
import DatePicker from "@/components/common/DatePicker";
import { Calendar } from "lucide-react";

interface Props {
  state: any;
}

export default function LeaveRequestModal({ state }: Props) {
  const {
    showRequestModal,
    setShowRequestModal,
    isSuperAdmin,
    employeesList,
    requestEmployeeId,
    setRequestEmployeeId,
    leaveType,
    setLeaveType,
    duration,
    setDuration,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reason,
    setReason,
    handleSubmitRequest,
  } = state;

  if (!showRequestModal) return null;

  return (
    <Modal show={showRequestModal} onClose={() => setShowRequestModal(false)} size="lg">
      <CustomModalHeader
        title="Submit Time Off Request"
        subtitle="File a new staff leave application."
        icon={<Calendar className="w-5 h-5 text-blue-600" />}
        onClose={() => setShowRequestModal(false)}
      />
      <ModalBody className="p-6 space-y-4">
        <form id="leaveRequestForm" onSubmit={handleSubmitRequest} className="space-y-4">
          {isSuperAdmin && (
            <div>
              <Label value="Request on Behalf of Employee" className="text-xs font-bold uppercase tracking-wider mb-1 block" />
              <Select
                value={requestEmployeeId || ""}
                onChange={(e) => setRequestEmployeeId(Number(e.target.value))}
              >
                {employeesList.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.idNo || `ID #${emp.id}`})
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label value="Leave Type" className="text-xs font-bold uppercase tracking-wider mb-1 block" />
              <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="Annual">Annual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Special">Special Leave</option>
                <option value="Unpaid">Unpaid Leave</option>
              </Select>
            </div>

            <div>
              <Label value="Duration" className="text-xs font-bold uppercase tracking-wider mb-1 block" />
              <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="FULL_DAY">Full Day</option>
                <option value="HALF_DAY_MORNING">Half Day (Morning)</option>
                <option value="HALF_DAY_AFTERNOON">Half Day (Afternoon)</option>
              </Select>
            </div>

            <div>
              <Label value="Start Date" className="text-xs font-bold uppercase tracking-wider mb-1 block" />
              <DatePicker value={startDate} onChange={setStartDate} />
            </div>

            <div>
              <Label value="End Date" className="text-xs font-bold uppercase tracking-wider mb-1 block" />
              <DatePicker value={endDate} onChange={setEndDate} />
            </div>
          </div>

          <div>
            <Label value="Reason / Notes" className="text-xs font-bold uppercase tracking-wider mb-1 block" />
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the purpose for this leave request..."
              rows={3}
            />
          </div>
        </form>
      </ModalBody>
      <CustomModalFooter
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleSubmitRequest as any}
        submitText="Submit Leave Request"
      />
    </Modal>
  );
}

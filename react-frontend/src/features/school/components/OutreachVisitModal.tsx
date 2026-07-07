import React from "react";
import { Modal, Button, TextInput, Textarea, Label, ToggleSwitch } from "@/lib/flowbite-compat";
import { useForm } from "react-hook-form";
import { useCreateOutreachVisit } from "../../../hooks/useOutreach";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";

interface OutreachVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OutreachVisitModal: React.FC<OutreachVisitModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      studentId: "",
      visitDate: new Date().toISOString().substring(0, 10),
      communityEntryNotes: "",
      needsAssessmentSurvey: "",
      serviceDelivery: "",
      referralNeeded: false,
      nextVisitDate: "",
      status: "LEAD",
      assessmentScore: "",
      committeeNotes: "",
    }
  });

  const createVisit = useCreateOutreachVisit();
  const referralNeeded = watch("referralNeeded");
  const visitDate = watch("visitDate");
  const nextVisitDate = watch("nextVisitDate");

  const onSubmit = async (data: any) => {
    await createVisit.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <Modal.Header>Log Outreach Visit</Modal.Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block"><Label htmlFor="studentId" value="Student ID / Beneficiary ID" /></div>
              <TextInput id="studentId" {...register("studentId")} required />
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="visitDate" value="Date of Visit" /></div>
              <DatePicker 
                value={visitDate ? new Date(visitDate) : null}
                onChange={(date: Date) => setValue("visitDate", format(date, "yyyy-MM-dd"))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-2 block"><Label htmlFor="status" value="Pipeline Status" /></div>
              <select id="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("status")}>
                <option value="LEAD">1. Student/Family Lead</option>
                <option value="REGISTERED">2. Registration Application</option>
                <option value="SCREENING">3. Initial Screening</option>
                <option value="HOME_VISIT">4. Home Visit & Assessment</option>
                <option value="COMMITTEE_REVIEW">5. Approval Committee Review</option>
                <option value="APPROVED">6. Approved (Ready for Case)</option>
                <option value="REJECTED">7. Rejected</option>
              </select>
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="assessmentScore" value="Assessment Score" /></div>
              <TextInput id="assessmentScore" type="number" {...register("assessmentScore", { valueAsNumber: true })} placeholder="e.g. 85" />
            </div>
          </div>

          <div>
            <div className="mb-2 block"><Label htmlFor="communityEntryNotes" value="Community Entry / Home Visit Notes" /></div>
            <Textarea id="communityEntryNotes" rows={3} {...register("communityEntryNotes")} placeholder="Notes from community leader check-in or home visit..." />
          </div>

          <div>
            <div className="mb-2 block"><Label htmlFor="needsAssessmentSurvey" value="2. Needs Assessment (Household vulnerability survey)" /></div>
            <Textarea id="needsAssessmentSurvey" rows={3} {...register("needsAssessmentSurvey")} placeholder="Key findings from household survey..." />
          </div>

          <div>
            <div className="mb-2 block"><Label htmlFor="serviceDelivery" value="3. Service Delivery" /></div>
            <Textarea id="serviceDelivery" rows={2} {...register("serviceDelivery")} placeholder="Health info, supplies distributed, immediate support provided..." />
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-base font-semibold">4. Does this case require referral escalation?</Label>
                <p className="text-sm text-gray-500">If yes, this will automatically flag for a Case Coordinator to open a formal case.</p>
              </div>
              <ToggleSwitch checked={referralNeeded} onChange={(v) => setValue("referralNeeded", v)} label="" />
            </div>

            {!referralNeeded && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-2 block"><Label htmlFor="nextVisitDate" value="Continue Monitoring: Schedule Next Visit" /></div>
                <DatePicker 
                  value={nextVisitDate ? new Date(nextVisitDate) : null}
                  onChange={(date: Date) => setValue("nextVisitDate", format(date, "yyyy-MM-dd"))}
                />
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 block"><Label htmlFor="committeeNotes" value="Approval Committee Notes & Recommendations" /></div>
            <Textarea id="committeeNotes" rows={2} {...register("committeeNotes")} placeholder="Official notes from the committee review..." />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" isProcessing={createVisit.isPending} color="success">Save Visit</Button>
          <Button color="gray" onClick={onClose}>Cancel</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default OutreachVisitModal;

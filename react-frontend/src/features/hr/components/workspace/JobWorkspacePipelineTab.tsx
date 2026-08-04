import React from "react";
import { Badge, Button, Avatar } from "@/lib/flowbite-compat";
import { FileText, CheckCircle, XCircle } from "lucide-react";

interface Props {
  state: any;
}

export default function JobWorkspacePipelineTab({ state }: Props) {
  const { applications, updateApplicationStatus, openDocumentGenerator } = state;

  const stages = [
    "SHORTLISTED",
    "APPLIED",
    "INTERVIEWING",
    "HIRED",
    "REJECTED",
  ];

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 min-h-[500px]">
      {stages.map((stage) => {
        const stageApps = applications.filter((a: any) => a.status === stage);
        return (
          <div
            key={stage}
            className="flex-1 min-w-[280px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">
                {stage}
              </h4>
              <Badge color="gray" className="rounded-full">
                {stageApps.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {stageApps.map((app: any) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar size="sm" rounded />
                    <div>
                      <p className="text-sm font-bold dark:text-white uppercase tracking-tight">
                        {app.client?.firstName} {app.client?.lastName}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        {app.client?.clientCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {stage === "SHORTLISTED" && (
                      <>
                        <Button
                          size="xs"
                          color="blue"
                          onClick={() => openDocumentGenerator(app)}
                          className="flex-1 text-[9px] font-black uppercase cursor-pointer"
                          title="Generate CV & Cover Letter"
                        >
                          <FileText size={12} className="mr-1" /> Generate Docs
                        </Button>
                        <Button
                          size="xs"
                          color="gray"
                          onClick={() => updateApplicationStatus(app.id, "APPLIED")}
                          className="text-[9px] font-black uppercase cursor-pointer"
                          title="Mark as Applied"
                        >
                          <CheckCircle size={12} />
                        </Button>
                      </>
                    )}
                    {stage === "APPLIED" && (
                      <>
                        <Button
                          size="xs"
                          color="purple"
                          onClick={() => updateApplicationStatus(app.id, "INTERVIEWING")}
                          className="flex-1 text-[9px] font-black uppercase cursor-pointer"
                        >
                          Interview
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => updateApplicationStatus(app.id, "REJECTED")}
                          className="text-[9px] font-black uppercase cursor-pointer"
                        >
                          <XCircle size={12} />
                        </Button>
                      </>
                    )}
                    {stage === "INTERVIEWING" && (
                      <>
                        <Button
                          size="xs"
                          color="success"
                          onClick={() => updateApplicationStatus(app.id, "HIRED")}
                          className="flex-1 text-[9px] font-black uppercase cursor-pointer"
                        >
                          Hire
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => updateApplicationStatus(app.id, "REJECTED")}
                          className="text-[9px] font-black uppercase cursor-pointer"
                        >
                          <XCircle size={12} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {stageApps.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest border-2 rounded-md">
                  No candidates
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

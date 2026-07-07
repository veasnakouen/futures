import React from "react";
import {Button, Badge} from '@/lib/flowbite-compat';
import { Zap, Activity, ShieldCheck, ChevronRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const AutomationModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Workflow & AI Orchestration
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Configurable Approval Chains & AI Triggers
          </p>
        </div>
        <Button
          color="blue"
          className="rounded-md h-12 px-8 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20"
        >
          <Zap size={18} className="mr-2" /> New Flow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md border-t-8 border-t-indigo-600">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-md">
              <Activity size={32} />
            </div>
            <Badge color="purple">Active</Badge>
          </div>
          <h4 className="font-black dark:text-white text-xl">
            Approval: Leave Request
          </h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
            Trigger: Submission → Manager → HR
          </p>
          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-500 text-white flex items-center justify-center font-black text-[8px]">
                1
              </div>
              <p className="text-xs font-black dark:text-gray-300">
                Manager Approval
              </p>
            </div>
            <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 ml-4"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-black text-[8px]">
                2
              </div>
              <p className="text-xs font-black dark:text-gray-300">
                HR Validation
              </p>
            </div>
          </div>
          <Button
            color="light"
            className="w-full mt-8 rounded-md h-12 font-black uppercase text-[10px]"
          >
            Edit Workflow
          </Button>
        </div>

        <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md border-t-8 border-t-blue-600">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md">
              <Zap size={32} />
            </div>
            <Badge color="info">AI Enabled</Badge>
          </div>
          <h4 className="font-black dark:text-white text-xl">
            Auto-Task: Onboarding
          </h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
            Trigger: Employee Onboarded
          </p>
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center text-[10px] font-black uppercase">
              <span className="text-gray-400">Create Email Node</span>
              <ShieldCheck size={14} className="text-emerald-500" />
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase">
              <span className="text-gray-400">Assign Gear Bundle</span>
              <ShieldCheck size={14} className="text-emerald-500" />
            </div>
          </div>
          <Button
            color="light"
            className="w-full mt-8 rounded-md h-12 font-black uppercase text-[10px]"
          >
            Manage Triggers
          </Button>
        </div>

        <div className="p-10 rounded-md dark:bg-gray-800 border-none shadow-md border-t-8 border-t-emerald-500 relative overflow-hidden group cursor-pointer hover:shadow-emerald-500/20 transition-all">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-md w-fit mb-6">
            <Activity size={32} />
          </div>
          <h4 className="font-black dark:text-white text-xl">
            Predictive Pipeline
          </h4>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
            Retention & Attrition Analysis
          </p>
          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-emerald-600 uppercase">
                System Status
              </p>
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex flex-col justify-center items-center rounded-xl z-50 backdrop-blur-sm">
                <Spinner size="xl" className="text-emerald-500" />
                <p className="mt-4 font-black text-gray-500 tracking-widest text-sm">RUNNING AUTOMATION...</p>
              </div>
            </div>
          </div>
          <div className="absolute top-10 right-10 group-hover:translate-x-2 transition-transform">
            <ChevronRight size={32} className="text-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationModule;

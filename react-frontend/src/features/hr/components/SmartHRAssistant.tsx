import React from "react";
import {TextInput} from '@/lib/flowbite-compat';
import { Activity, Zap } from "lucide-react";
import { toast } from "react-hot-toast";

const SmartHRAssistant: React.FC = () => {
  return (
    <div className="fixed bottom-10 right-10 z-[100] animate-bounce-slow">
      <button
        onClick={() =>
          toast.success(
            "Smart HR Assistant Initialized (GPT-4o Pipeline Active)",
          )
        }
        className="w-20 h-20 bg-indigo-600 text-white rounded-md shadow-md shadow-indigo-500/50 flex items-center justify-center hover:scale-110 transition-all group border-4 border-white"
      >
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-md border-4 border-white animate-pulse"></div>
        <Activity
          size={32}
          className="group-hover:rotate-12 transition-transform"
        />
      </button>
      <div className="absolute bottom-24 right-0 w-80 bg-white dark:bg-gray-800 rounded-md shadow-md p-8 hidden group-hover:block animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-md">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-xs font-black dark:text-white">Smart HR AI</p>
            <p className="text-[8px] font-black text-emerald-500 uppercase">
              Always Online
            </p>
          </div>
        </div>
        <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2 no-scrollbar">
          <p className="text-[10px] font-bold p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md dark:text-gray-300 italic">
            "Hello! I can help you with leave balances, scheduling, or policy
            queries. What's on your mind?"
          </p>
        </div>
        <TextInput
          placeholder="Type your query..."
          className="rounded-md h-12"
        />
      </div>
    </div>
  );
};

export default SmartHRAssistant;

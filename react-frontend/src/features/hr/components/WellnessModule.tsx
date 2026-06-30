import React from "react";
import {
  Card,
  Button,
  Badge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Progress,
} from '@/lib/flowbite-compat';
import { Heart, Activity, Award, ShieldCheck, Flame, Plus } from "lucide-react";
import toast from "react-hot-toast";

const WellnessModule: React.FC = () => {
  const mockChallenges = [
    {
      id: 1,
      name: "MTP 10,000 Step Challenge",
      participants: 45,
      duration: "Ends May 31",
      completion: 65,
    },
    {
      id: 2,
      name: "Mindfulness Meditation Streak",
      participants: 18,
      duration: "Ends Jun 15",
      completion: 42,
    },
    {
      id: 3,
      name: "Hydration Compliance Week",
      participants: 32,
      duration: "Ends May 22",
      completion: 90,
    },
  ];

  const mockSubsidies = [
    {
      name: "Sarah Jenkins",
      type: "Gym Membership",
      amount: "$45.00",
      date: "2026-05-12",
      status: "Approved",
    },
    {
      name: "Michael Jordan",
      type: "Mental Health App",
      amount: "$15.00",
      date: "2026-05-14",
      status: "Approved",
    },
    {
      name: "Emily Rose",
      type: "Yoga Studio",
      amount: "$30.00",
      date: "2026-05-16",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Section */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Wellness & Health Command
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Nurturing Team Well-being, Fitness Challenges & Wellness Subsidies
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            color="blue"
            size="sm"
            className="rounded-md shadow-lg shadow-blue-500/20 text-xs font-black uppercase"
            onClick={() => toast.success("New wellness claim form opened")}
          >
            <Plus size={14} className="mr-2" /> File Wellness Claim
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Active Challengers
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-md">
              <Flame size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">95 Personnel</h4>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">
            Active steps taken: 1.2M steps
          </p>
        </Card>

        <Card className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Mental Health Days Taken
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-md">
              <Heart size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">12 Days</h4>
          <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">
            Low rate indicates healthy node state
          </p>
        </Card>

        <Card className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Gym Subsidy Coverage
            </span>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-md">
              <ShieldCheck size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">88% core</h4>
          <p className="text-[9px] font-bold text-indigo-500 uppercase mt-2">
            Active corporate memberships
          </p>
        </Card>

        <Card className="p-6 rounded-md border-none shadow-sm dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Wellness Index Score
            </span>
            <div className="p-2 bg-pink-50 dark:bg-pink-950/30 text-pink-500 rounded-md">
              <Activity size={16} />
            </div>
          </div>
          <h4 className="text-3xl font-black dark:text-white">9.2 / 10</h4>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">
            Excellent health rating
          </p>
        </Card>
      </div>

      {/* Challenges & Subsidy Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Challenges */}
        <Card className="lg:col-span-2 p-8 rounded-md border-none shadow-sm dark:bg-gray-800">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2">
            <Flame size={20} className="text-orange-500" /> Active Wellness
            Challenges
          </h4>
          <div className="space-y-6">
            {mockChallenges.map((chal) => (
              <div
                key={chal.id}
                className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-md space-y-4 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-black text-sm dark:text-white">
                      {chal.name}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                      {chal.duration} • {chal.participants} active participants
                    </p>
                  </div>
                  <Badge color="warning" className="rounded-md">
                    In Progress
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-gray-400">
                      Team Challenge Progress
                    </span>
                    <span className="text-orange-600">
                      {chal.completion}% Done
                    </span>
                  </div>
                  <Progress
                    progress={chal.completion}
                    color="yellow"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Gym Subsidies Tracker */}
        <Card className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800">
          <h4 className="font-black text-lg dark:text-white mb-6 flex items-center gap-2">
            <Award size={20} className="text-indigo-600" /> Subsidy Claims Log
          </h4>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
            {mockSubsidies.map((sub, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-md flex justify-between items-center border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
              >
                <div>
                  <p className="font-black text-xs dark:text-white leading-none">
                    {sub.name}
                  </p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">
                    {sub.type} • {sub.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-black text-blue-600">
                    {sub.amount}
                  </p>
                  <Badge
                    color={sub.status === "Approved" ? "success" : "warning"}
                    className="rounded-md mt-1 text-[8px]"
                  >
                    {sub.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WellnessModule;

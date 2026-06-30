import React, { useState, useEffect } from "react";
import { Award, Activity, Zap, TrendingUp, MessageCircle } from "lucide-react";
import { Button, Card, Avatar, Badge, Spinner } from '@/lib/flowbite-compat';
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import api from '@/services/api';

const EngagementModule: React.FC = () => {
  const [recognitions, setRecognitions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    sentimentScore: 0,
    sentimentMax: 5.0,
    moralePersistence: "Loading",
    moralePercentage: 0,
    chartData: [],
    wellnessTrack: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCultureData();
  }, []);

  const fetchCultureData = async () => {
    try {
      setLoading(true);
      const [recRes, metRes] = await Promise.all([
        api.get("/hr/culture/recognitions"),
        api.get("/hr/culture/metrics"),
      ]);

      setRecognitions(recRes.data || []);
      setMetrics(metRes.data || {});
    } catch (err) {
      console.error("Failed to fetch culture data", err);
      toast.error("Failed to connect to Engagement API");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Syncing Culture Indices...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Engagement & Culture Hub
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
            Nurturing Human Capital & Organizational Spirit
          </p>
        </div>
        <Button
          color="blue"
          onClick={() =>
            toast.success("Recognition form opened", { icon: "🏆" })
          }
          className="rounded-md h-12 px-8 font-black uppercase text-[10px] shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Award size={18} className="mr-2" /> Post Recognition
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-10 rounded-md dark:bg-gray-800 bg-white/50 backdrop-blur-md border-none shadow-sm">
          <h4 className="font-black text-xl dark:text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
            <Award className="text-blue-600" /> Wall of Recognition
          </h4>
          <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
            {recognitions.map((rec, i) => (
              <div
                key={rec.id || i}
                className="p-8 bg-gray-50 dark:bg-gray-700/50 rounded-md flex gap-6 items-start border border-transparent hover:border-blue-600/30 transition-all shadow-sm cursor-pointer"
              >
                <Avatar rounded size="md" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-black dark:text-white uppercase tracking-tight leading-none">
                        {rec.receiverName}
                      </p>
                      <Badge
                        color="purple"
                        className="w-fit rounded-md mt-2 text-[9px] font-black tracking-widest uppercase"
                      >
                        {rec.badgeType}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-400 uppercase">
                        From: {rec.senderName}
                      </p>
                      <p className="text-[9px] font-bold text-blue-500 uppercase mt-0.5 font-mono">
                        {rec.createdAt
                          ? formatDistanceToNow(new Date(rec.createdAt), {
                              addSuffix: true,
                            })
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic mt-4">
                    "{rec.message}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-10 rounded-md border-none shadow-lg bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden h-[400px]">
            <Activity
              size={100}
              className="absolute -right-6 -bottom-6 opacity-10 rotate-12"
            />
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 opacity-80">
              Engagement Sentiment Score
            </h4>
            <div className="flex items-end gap-2 mb-8">
              <h3 className="text-6xl font-black tracking-tighter">
                {metrics.sentimentScore}
              </h3>
              <p className="text-[10px] font-black uppercase opacity-60 mb-2">
                / {metrics.sentimentMax} Global Pulse
              </p>
            </div>

            <div className="flex-1 h-32 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.chartData}>
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#fff"
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: "#4f46e5" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "10px",
                      color: "#4f46e5",
                      fontWeight: 900,
                    }}
                    cursor={{ stroke: "rgba(255,255,255,0.2)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase">
                <span className="opacity-80">Team Morale Persistence</span>
                <span>{metrics.moralePersistence}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-md overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-1000 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                  style={{ width: `${metrics.moralePercentage}%` }}
                ></div>
              </div>
            </div>
          </Card>

          <Card className="p-8 rounded-md border-none shadow-sm dark:bg-gray-800 bg-white/50 backdrop-blur-md">
            <h4 className="font-black text-lg dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
              <Zap className="text-amber-500" /> Wellness Track
            </h4>
            <div className="space-y-4">
              {metrics.wellnessTrack.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-transparent hover:border-amber-500/30 transition-colors"
                >
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md">
                    {item.active} Participants
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EngagementModule;

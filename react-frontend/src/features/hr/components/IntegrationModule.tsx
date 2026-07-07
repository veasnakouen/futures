import React, { useState, useEffect } from "react";
import {Button, Badge, TextInput, Label, Spinner} from '@/lib/flowbite-compat';
import {
  Settings,
  Zap,
  ShieldCheck,
  Database,
  Layout,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from '@/services/api';

const IntegrationModule: React.FC = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [ssoProviders, setSsoProviders] = useState<any[]>([]);
  const [newWebhook, setNewWebhook] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIntegrationData();
  }, []);

  const fetchIntegrationData = async () => {
    try {
      setLoading(true);
      const [webRes, ssoRes] = await Promise.all([
        api.get("/hr/integrations/webhooks"),
        api.get("/hr/integrations/sso"),
      ]);

      setWebhooks(webRes.data || []);
      setSsoProviders(ssoRes.data || []);
    } catch (err) {
      console.error("Failed to fetch integration data", err);
      toast.error("Failed to connect to Integration Hub");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWebhook = async () => {
    if (!newWebhook) return;
    try {
      const res = await api.post("/hr/integrations/webhooks", {
        url: newWebhook,
        eventName: "Custom_Event",
        httpMethod: "POST",
      });
      setWebhooks([...webhooks, res.data]);
      setNewWebhook("");
      toast.success("Webhook endpoint registered");
    } catch (err) {
      toast.error("Failed to register webhook");
    }
  };

  const handleDeleteWebhook = async (id: number) => {
    try {
      await api.delete(`/hr/integrations/webhooks/${id}`);
      setWebhooks(webhooks.filter((w) => w.id !== id));
      toast.success("Webhook deleted");
    } catch (err) {
      toast.error("Failed to delete webhook");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Spinner size="xl" className="fill-blue-600" />
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Syncing Integration Nodes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* SSO & Identity */}
        <div className="p-10 rounded-md dark:bg-gray-800 bg-white/50 backdrop-blur-md border-none shadow-sm border-t-8 border-t-blue-600">
          <h4 className="font-black text-xl dark:text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
            <ShieldCheck className="text-blue-600" /> Identity & SSO
          </h4>
          <div className="space-y-4">
            {ssoProviders.map((idp, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border-transparent hover:border-blue-600/30 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center font-black text-xs shadow-sm text-blue-600">
                    {idp.icon}
                  </div>
                  <p className="text-xs font-black dark:text-white uppercase tracking-tight">
                    {idp.name}
                  </p>
                </div>
                <Badge
                  color={idp.status === "Connected" ? "success" : "info"}
                  className="rounded-md text-[8px] font-black tracking-widest uppercase px-3"
                >
                  {idp.status}
                </Badge>
              </div>
            ))}
          </div>
          <Button
            color="light"
            onClick={() => toast.success("SAML config opened")}
            className="w-full mt-6 rounded-md h-12 font-black uppercase tracking-widest text-[10px] shadow-sm border-none hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Configure SAML 2.0
          </Button>
        </div>

        {/* Third Party Ops */}
        <div className="p-10 rounded-md dark:bg-gray-800 bg-white/50 backdrop-blur-md border-none shadow-sm border-t-8 border-t-indigo-600">
          <h4 className="font-black text-xl dark:text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
            <Zap className="text-indigo-600" /> Strategic API Links
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Slack Enterprise", type: "Messaging" },
              { name: "MS Teams", type: "Collaboration" },
              { name: "QuickBooks", type: "Accounting" },
              { name: "Checkr", type: "Background" },
            ].map((app, i) => (
              <div
                key={i}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border-transparent hover:border-indigo-600/30 transition-all group cursor-pointer text-center"
              >
                <p className="text-[10px] font-black dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                  {app.name}
                </p>
                <p className="text-[8px] font-bold text-gray-400 uppercase mt-1.5">
                  {app.type}
                </p>
              </div>
            ))}
          </div>
          <Button
            color="blue"
            onClick={() => toast.success("Loading App Directory")}
            className="w-full mt-8 rounded-md h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 transition-transform hover:scale-105"
          >
            Explore App Directory
          </Button>
        </div>

        {/* Webhook Manager */}
        <div className="p-10 rounded-md dark:bg-gray-800 bg-white/50 backdrop-blur-md border-none shadow-sm border-t-8 border-t-emerald-500 flex flex-col">
          <h4 className="font-black text-xl dark:text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
            <Database className="text-emerald-500" /> Webhook Manager
          </h4>
          <div className="space-y-4 mb-6 flex-1 max-h-[200px] overflow-y-auto pr-2 no-scrollbar">
            {webhooks.length === 0 ? (
              <div className="text-center py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                No active hooks
              </div>
            ) : (
              webhooks.map((hook) => (
                <div
                  key={hook.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center border-l-4 border-l-emerald-500 group"
                >
                  <div className="flex-1 overflow-hidden pr-2">
                    <p className="text-[10px] font-black dark:text-white truncate font-mono">
                      {hook.url}
                    </p>
                    <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1.5">
                      Event: {hook.eventName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      color="success"
                      className="text-[8px] font-black px-2"
                    >
                      {hook.httpMethod}
                    </Badge>
                    <button
                      onClick={() => handleDeleteWebhook(hook.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="space-y-3 pt-6 border-t mt-auto">
            <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Register New Endpoint
            </Label>
            <TextInput
              placeholder="https://your-service.com/webhook"
              className="rounded-md h-10 text-xs font-mono"
              value={newWebhook}
              onChange={(e) => setNewWebhook(e.target.value)}
            />
            <Button
              color="light"
              size="sm"
              onClick={handleAddWebhook}
              className="w-full rounded-md font-black uppercase text-[10px] tracking-widest shadow-sm border-none hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Add Hook
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Schema Builder */}
      <div className="p-10 rounded-md dark:bg-gray-800 bg-white/50 backdrop-blur-md border-none shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h4 className="font-black text-xl dark:text-white flex items-center gap-3 uppercase tracking-tight">
              <Layout className="text-blue-600" /> Dynamic Schema & Field
              Mapping
            </h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Extend System Data Model without code
            </p>
          </div>
          <Button
            color="blue"
            size="sm"
            onClick={() =>
              toast.success("Schema builder opened", { icon: "🏗️" })
            }
            className="rounded-md px-8 font-black uppercase tracking-widest text-[10px] shadow-sm hover:scale-105 transition-transform"
          >
            Add Custom Field
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 dark:bg-gray-700/30 rounded-md group hover:border-blue-600/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-white dark:bg-gray-800 text-blue-600 rounded-md shadow-sm">
                <Settings size={24} />
              </div>
              <Badge
                color="info"
                className="text-[9px] font-black uppercase tracking-widest"
              >
                Persistent
              </Badge>
            </div>
            <h5 className="font-black dark:text-white mb-2 text-sm uppercase tracking-tight">
              Employee_TShirt_Size
            </h5>
            <p className="text-[10px] text-gray-400 font-bold mb-6 tracking-wide">
              Data Type: Dropdown (S, M, L, XL, XXL)
            </p>
            <div className="flex gap-2">
              <Button
                color="light"
                size="xs"
                className="rounded-md flex-1 font-black uppercase tracking-widest text-[9px]"
              >
                Mapping
              </Button>
              <Button
                color="light"
                size="xs"
                className="rounded-md text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationModule;

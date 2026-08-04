import React from "react";
import { Label, TextInput, Select, ToggleSwitch, Button, Spinner } from "@/lib/flowbite-compat";
import { Server, Camera, Activity, ShieldAlert, Save } from "lucide-react";

export default function SettingsSystemTab({ state }: { state: any }) {
  const {
    appLogo,
    handleImageUpload,
    maxImageUploadSize,
    setMaxImageUploadSize,
    enableDdosProtection,
    setEnableDdosProtection,
    maxRequestsPerMinute,
    setMaxRequestsPerMinute,
    cloudflareZoneId,
    setCloudflareZoneId,
    cloudflareApiToken,
    setCloudflareApiToken,
    redisHost,
    setRedisHost,
    redisPort,
    setRedisPort,
    enableLoadBalancing,
    setEnableLoadBalancing,
    loadBalancerType,
    setLoadBalancerType,
    enableReverseProxy,
    setEnableReverseProxy,
    reverseProxyUrl,
    setReverseProxyUrl,
    handleSaveSystemSettings,
    loading,
  } = state;

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 animate-fade-in">
      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
        <Server size={24} className="text-blue-600" /> System Configuration
      </h2>
      <form onSubmit={handleSaveSystemSettings} className="space-y-6">
        <div className="mb-6 border-b pb-6">
          <Label>Application Logo</Label>
          <div className="mt-3 flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl border-2 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700/50 shadow-inner">
              {appLogo ? (
                <img
                  src={appLogo}
                  alt="App Logo"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Activity className="text-gray-400" size={28} />
              )}
            </div>
            <div>
              <Button
                size="sm"
                color="light"
                onClick={() => document.getElementById("logoInput")?.click()}
                className="mb-2"
              >
                <Camera size={16} className="mr-2" /> Upload New Logo
              </Button>
              <input
                id="logoInput"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logo")}
              />
              <p className="text-[10px] text-gray-500 max-w-[200px]">
                Recommended: Square aspect ratio (e.g. 256x256). PNG format.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-md">
          <Label htmlFor="maxImageUploadSize">Max Image Upload Size (MB)</Label>
          <TextInput
            id="maxImageUploadSize"
            type="number"
            step="0.1"
            min="0.1"
            className="mt-1"
            value={maxImageUploadSize}
            onChange={(e) => setMaxImageUploadSize(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2">
            Defines the maximum file size (in Megabytes) for images being compressed and uploaded by users. E.g. <strong className="text-blue-500">1</strong> for 1MB.
          </p>
        </div>

        <div className="max-w-md pt-4 border-t mt-6">
          <h3 className="text-md font-semibold dark:text-white mb-4 flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-500" />
            Security & DDoS Protection
          </h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label>Enable Rate Limiting</Label>
              <p className="text-xs text-gray-500">Automatically block IPs that spam requests.</p>
            </div>
            <ToggleSwitch
              checked={enableDdosProtection}
              onChange={(checked) => setEnableDdosProtection(checked)}
            />
          </div>
          {enableDdosProtection && (
            <div className="animate-fade-in mt-4">
              <Label htmlFor="maxRequestsPerMinute">Max Requests Per Minute</Label>
              <TextInput
                id="maxRequestsPerMinute"
                type="number"
                className="mt-1"
                value={maxRequestsPerMinute}
                onChange={(e) => setMaxRequestsPerMinute(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2 mb-4">
                Maximum number of requests an IP can make in 60 seconds before being blocked.
              </p>

              <h4 className="text-sm font-semibold dark:text-white mt-4 mb-2">Cloudflare Configuration</h4>
              <div className="space-y-3 mb-4">
                <div>
                  <Label htmlFor="cloudflareZoneId">Zone ID</Label>
                  <TextInput
                    id="cloudflareZoneId"
                    type="text"
                    placeholder="e.g. 023e105f4ecef8ad9ca31a8372d0c353"
                    value={cloudflareZoneId}
                    onChange={(e) => setCloudflareZoneId(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cloudflareApiToken">API Token</Label>
                  <TextInput
                    id="cloudflareApiToken"
                    type="password"
                    placeholder="Cloudflare Global API Key or Token"
                    value={cloudflareApiToken}
                    onChange={(e) => setCloudflareApiToken(e.target.value)}
                  />
                </div>
              </div>

              <h4 className="text-sm font-semibold dark:text-white mt-4 mb-2">Spring Cloud Gateway (Redis)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="redisHost">Redis Host</Label>
                  <TextInput
                    id="redisHost"
                    type="text"
                    placeholder="e.g. localhost or redis-server"
                    value={redisHost}
                    onChange={(e) => setRedisHost(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="redisPort">Redis Port</Label>
                  <TextInput
                    id="redisPort"
                    type="text"
                    placeholder="e.g. 6379"
                    value={redisPort}
                    onChange={(e) => setRedisPort(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-md pt-4 border-t mt-6">
          <h3 className="text-md font-semibold dark:text-white mb-4 flex items-center gap-2">
            <Server size={18} className="text-indigo-500" />
            Infrastructure & Scaling
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Configure integrations for when the application scales to multiple nodes. Note: Enabling these requires the corresponding infrastructure (Nginx, HAProxy, etc.) to be provisioned.
          </p>

          <div className="flex items-center justify-between mb-4">
            <div>
              <Label>Enable Load Balancing Integration</Label>
              <p className="text-xs text-gray-500">
                Prepare application to handle forwarded headers from a Load Balancer.
              </p>
            </div>
            <ToggleSwitch
              checked={enableLoadBalancing}
              onChange={(checked) => setEnableLoadBalancing(checked)}
            />
          </div>
          {enableLoadBalancing && (
            <div className="animate-fade-in mt-4 mb-6">
              <Label>Load Balancer Type</Label>
              <Select
                className="mt-1"
                value={loadBalancerType}
                onChange={(e: any) => setLoadBalancerType(e.target.value)}
              >
                <option value="NGINX">NGINX</option>
                <option value="HAPROXY">HAProxy</option>
                <option value="AWS_ELB">AWS Elastic Load Balancer</option>
                <option value="OTHER">Other</option>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 mt-6 border-t pt-4">
            <div>
              <Label>Enable Reverse Proxy Mode</Label>
              <p className="text-xs text-gray-500">
                Trust proxy headers (X-Forwarded-For, X-Forwarded-Proto).
              </p>
            </div>
            <ToggleSwitch
              checked={enableReverseProxy}
              onChange={(checked) => setEnableReverseProxy(checked)}
            />
          </div>
          {enableReverseProxy && (
            <div className="animate-fade-in mt-4">
              <Label htmlFor="reverseProxyUrl">Reverse Proxy Base URL</Label>
              <TextInput
                id="reverseProxyUrl"
                type="text"
                className="mt-1"
                placeholder="e.g. https://api.yourdomain.com"
                value={reverseProxyUrl}
                onChange={(e) => setReverseProxyUrl(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                The public URL of the proxy pointing to your API Gateway.
              </p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold px-8 py-3.5 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl shadow-blue-500/25 active:scale-[0.98]"
          >
            {loading ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Button, Label, TextInput, Select, ToggleSwitch, Alert, Avatar, Spinner, Badge, Dropdown, DropdownItem, DropdownDivider } from '@/lib/flowbite-compat';
import {
  User,
  Lock,
  Palette,
  Shield,
  Save,
  Camera,
  Mail,
  Building2,
  Trash2,
  ShieldAlert,
  Monitor,
  Smartphone,
  Tablet,
  Activity,
  Globe,
  Wifi,
  Server,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Calendar,
  Briefcase,
  X,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

import ChatbotSettingsTab from '@/features/admin/components/ChatbotSettingsTab';
import api from "../services/api";
import { useTranslation } from "react-i18next";
import ModernPagination from "@/components/common/ModernPagination";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";
import ImageCropperModal from "@/components/common/ImageCropperModal";
import { useTheme } from "../contexts/ThemeContext";
import { useAuthStore } from "../store/authStore";
import { getFaceFocusedUrl } from "../utils/cloudinary";

import { useQuery } from "@tanstack/react-query";
import TenantsTab from '@/features/admin/components/TenantsTab';

const SettingsPage = ({ isDark, setIsDark }: any) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const { updateUser, user } = useAuthStore();
  const {
    sidebarPosition,
    setSidebarPosition,
    sidebarTheme,
    setSidebarTheme,
    topbarTheme,
    setTopbarTheme,
  } = useTheme();

  const [hrStaffIdFormat, setHrStaffIdFormat] = useState("EMP-{YYYY}-{SEQ}");
  const [maxImageUploadSize, setMaxImageUploadSize] = useState("1");
  const [enableDdosProtection, setEnableDdosProtection] = useState(false);
  const [maxRequestsPerMinute, setMaxRequestsPerMinute] = useState("60");
  const [cloudflareZoneId, setCloudflareZoneId] = useState("");
  const [cloudflareApiToken, setCloudflareApiToken] = useState("");
  const [redisHost, setRedisHost] = useState("");
  const [redisPort, setRedisPort] = useState("6379");

  // Infrastructure Scaling Settings
  const [enableLoadBalancing, setEnableLoadBalancing] = useState(false);
  const [loadBalancerType, setLoadBalancerType] = useState("NGINX");
  const [enableReverseProxy, setEnableReverseProxy] = useState(false);
  const [reverseProxyUrl, setReverseProxyUrl] = useState("");

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<"avatar" | "logo">("avatar");
  const [appLogo, setAppLogo] = useState<string | null>(null);

  const [mapCoords, setMapCoords] = useState({
    lat: (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).getItem("officeLat") || "51.505",
    lng: (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).getItem("officeLng") || "-0.09",
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    branch: "",
    photo: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securitySubTab, setSecuritySubTab] = useState<"session" | "activity">("session");
  const [logsSearch, setLogsSearch] = useState("");
  const [logsStartDate, setLogsStartDate] = useState("");
  const [logsEndDate, setLogsEndDate] = useState("");
  const [logsCurrentPage, setLogsCurrentPage] = useState(1);
  const [logsPageSize, setLogsPageSize] = useState(10);

  const { data: profileQueryData } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data;
    }
  });

  useEffect(() => {
    if (profileQueryData) {
      const photoUrl = profileQueryData.photo || profileQueryData.avatarUrl || "";
      setProfileData({
        firstName: profileQueryData.firstName || "",
        lastName: profileQueryData.lastName || "",
        email: profileQueryData.email || "",
        branch: profileQueryData.branch || "Main Office",
        photo: photoUrl,
      });
      updateUser({ photo: photoUrl });
    }
  }, [profileQueryData, updateUser]);

  const { data: accessLogs = [], isLoading: isLoadingAccessLogs, refetch: refetchAccessLogs } = useQuery({
    queryKey: ['accessLogs'],
    queryFn: async () => {
      const res = await api.get("/access-logs");
      return res.data;
    },
    enabled: activeTab === "security_logs" && securitySubTab === "session"
  });

  const { data: auditLogs = [], isLoading: isLoadingAuditLogs, refetch: refetchAuditLogs } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await api.get("/compliance/logs");
      return res.data;
    },
    enabled: activeTab === "security_logs" && securitySubTab === "activity"
  });

  const loadingLogs = isLoadingAccessLogs || isLoadingAuditLogs;

  useEffect(() => {
    setLogsCurrentPage(1);
  }, [logsSearch, logsStartDate, logsEndDate, logsPageSize, securitySubTab]);

  const handleClearLogs = async (type: string) => {
    try {
      await api.delete(`/access-logs/clear?type=${type}`);
      setSuccess("Logs cleared successfully.");
      setTimeout(() => setSuccess(null), 3000);
      refetchAccessLogs(); // Refresh the list
    } catch (err: any) {
      setError("Failed to clear logs.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/users/me/profile", profileData);
      setSuccess("Profile updated successfully!");
      updateUser({ photo: profileData.photo });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "avatar" | "logo" = "avatar",
  ) => {
    setCropTarget(target);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImageSrc(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoResult = reader.result as string;
      if (cropTarget === "avatar") {
        setProfileData((prev) => ({ ...prev, photo: photoResult }));
        updateUser({ photo: photoResult });
      } else {
        setAppLogo(photoResult);
      }
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match. Please verify and try again.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setLoading(true);
    try {
      await api.put("/users/me/password", {
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update password. Ensure your session is valid.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "hr") {
      api
        .get("/settings/HR_STAFF_ID_FORMAT")
        .then((res) => setHrStaffIdFormat(res.data.value))
        .catch((err) => console.log("Setting not found, using default"));
    }
    if (activeTab === "system") {
      api
        .get("/settings/MAX_IMAGE_UPLOAD_SIZE_MB")
        .then((res) => setMaxImageUploadSize(res.data.value))
        .catch((err) => console.log("Setting not found, using default"));

      api
        .get("/settings/APP_LOGO")
        .then((res) => setAppLogo(res.data.value))
        .catch((err) => console.log("Logo not found"));

      api.get("/settings/ENABLE_DDOS_PROTECTION")
        .then((res) => setEnableDdosProtection(res.data.value === "true"))
        .catch(() => setEnableDdosProtection(false));

      api.get("/settings/MAX_REQUESTS_PER_MINUTE")
        .then((res) => setMaxRequestsPerMinute(res.data.value))
        .catch(() => setMaxRequestsPerMinute("60"));

      api.get("/settings/CLOUDFLARE_ZONE_ID")
        .then((res) => setCloudflareZoneId(res.data.value))
        .catch(() => setCloudflareZoneId(""));

      api.get("/settings/CLOUDFLARE_API_TOKEN")
        .then((res) => setCloudflareApiToken(res.data.value))
        .catch(() => setCloudflareApiToken(""));

      api.get("/settings/GATEWAY_REDIS_HOST")
        .then((res) => setRedisHost(res.data.value))
        .catch(() => setRedisHost(""));

      api.get("/settings/GATEWAY_REDIS_PORT")
        .then((res) => setRedisPort(res.data.value))
        .catch(() => setRedisPort("6379"));

      api.get("/settings/ENABLE_LOAD_BALANCING")
        .then((res) => setEnableLoadBalancing(res.data.value === "true"))
        .catch(() => setEnableLoadBalancing(false));

      api.get("/settings/LOAD_BALANCER_TYPE")
        .then((res) => setLoadBalancerType(res.data.value))
        .catch(() => setLoadBalancerType("NGINX"));

      api.get("/settings/ENABLE_REVERSE_PROXY")
        .then((res) => setEnableReverseProxy(res.data.value === "true"))
        .catch(() => setEnableReverseProxy(false));

      api.get("/settings/REVERSE_PROXY_URL")
        .then((res) => setReverseProxyUrl(res.data.value))
        .catch(() => setReverseProxyUrl(""));
    }
  }, [activeTab]);

  const handleSaveHrSettings = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/settings", {
        key: "HR_STAFF_ID_FORMAT",
        value: hrStaffIdFormat,
      });
      setSuccess("HR settings updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update HR settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystemSettings = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/settings", {
        key: "MAX_IMAGE_UPLOAD_SIZE_MB",
        value: maxImageUploadSize,
      });
      await api.post("/settings", {
        key: "ENABLE_DDOS_PROTECTION",
        value: enableDdosProtection.toString(),
      });
      await api.post("/settings", {
        key: "MAX_REQUESTS_PER_MINUTE",
        value: maxRequestsPerMinute,
      });
      await api.post("/settings", {
        key: "CLOUDFLARE_ZONE_ID",
        value: cloudflareZoneId,
      });
      await api.post("/settings", {
        key: "CLOUDFLARE_API_TOKEN",
        value: cloudflareApiToken,
      });
      await api.post("/settings", {
        key: "GATEWAY_REDIS_HOST",
        value: redisHost,
      });
      await api.post("/settings", {
        key: "GATEWAY_REDIS_PORT",
        value: redisPort,
      });
      await api.post("/settings", {
        key: "ENABLE_LOAD_BALANCING",
        value: enableLoadBalancing.toString(),
      });
      await api.post("/settings", {
        key: "LOAD_BALANCER_TYPE",
        value: loadBalancerType,
      });
      await api.post("/settings", {
        key: "ENABLE_REVERSE_PROXY",
        value: enableReverseProxy.toString(),
      });
      await api.post("/settings", {
        key: "REVERSE_PROXY_URL",
        value: reverseProxyUrl,
      });
      if (appLogo) {
        await api.post("/settings", { key: "APP_LOGO", value: appLogo });
        window.dispatchEvent(new Event("appLogoChanged"));
      }
      setSuccess("System settings updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update System settings.");
    } finally {
      setLoading(false);
    }
  };

  const sourceLogs = securitySubTab === "session" ? accessLogs : auditLogs;
  const filteredLogs = sourceLogs.filter((log) => {
    const searchLower = logsSearch.toLowerCase();

    let matchesSearch = true;
    if (securitySubTab === "session") {
      matchesSearch =
        !logsSearch ||
        log.loggedBy?.toLowerCase().includes(searchLower) ||
        log.ipAddress?.toLowerCase().includes(searchLower) ||
        log.location?.toLowerCase().includes(searchLower) ||
        log.os?.toLowerCase().includes(searchLower) ||
        log.browser?.toLowerCase().includes(searchLower) ||
        log.status?.toLowerCase().includes(searchLower) ||
        log.dataUsageType?.toLowerCase().includes(searchLower);
    } else {
      matchesSearch =
        !logsSearch ||
        log.loggedUser?.toLowerCase().includes(searchLower) ||
        log.action?.toLowerCase().includes(searchLower) ||
        log.target?.toLowerCase().includes(searchLower) ||
        log.type?.toLowerCase().includes(searchLower);
    }

    const logDateStr =
      securitySubTab === "session" ? log.loggedDate : log.timestamp;
    const matchesStartDate =
      !logsStartDate ||
      new Date(logDateStr) >= new Date(logsStartDate + "T00:00:00");
    const matchesEndDate =
      !logsEndDate ||
      new Date(logDateStr) <= new Date(logsEndDate + "T23:59:59");

    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / logsPageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
    (logsCurrentPage - 1) * logsPageSize,
    logsCurrentPage * logsPageSize,
  );

  return (
    <>
      <div className="max-w-[1600px] mx-auto space-y-6 animate-fade-in">
        {success && (
          <Alert
            color="success"
            icon={Shield}
            className="rounded-md border-none shadow-lg shadow-green-500/10"
          >
            {success}
          </Alert>
        )}

        {error && (
          <Alert
            color="failure"
            icon={ShieldAlert}
            className="rounded-md border-none shadow-lg shadow-red-500/10"
          >
            {error}
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation (Tabs) */}
          <div className="w-full md:w-72 space-y-2 shrink-0">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 p-4">
              <div className="p-4 flex flex-col items-center text-center gap-4">
                <div
                  className="relative group cursor-pointer rounded-full overflow-hidden transition-all duration-300 hover:scale-105 border-4 shadow-sm w-24 h-24 flex items-center justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, "avatar")}
                    accept="image/*"
                    className="hidden"
                  />
                  {profileData.photo ? (
                    <img
                      alt="Profile"
                      src={getFaceFocusedUrl(profileData.photo, 200)}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-3xl rounded-full uppercase tracking-wider">
                      {(profileData.firstName?.[0] || "S") +
                        (profileData.lastName?.[0] || "A")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{profileData.email}</p>
                </div>
              </div>
              <hr className="my-4 border-slate-200/50 dark:border-slate-700/50" />
              <div className="space-y-1.5 px-2">
                {[
                  {
                    id: "profile",
                    icon: <User size={18} />,
                    label: t("profileInfo"),
                  },
                  {
                    id: "security",
                    icon: <Lock size={18} />,
                    label: t("security"),
                  },
                  {
                    id: "appearance",
                    icon: <Palette size={18} />,
                    label: t("interface"),
                  },
                  {
                    id: "location",
                    icon: <Building2 size={18} />,
                    label: t("officeLocation"),
                  },
                  {
                    id: "hr",
                    icon: <Briefcase size={18} />,
                    label: t("hrConfiguration"),
                  },
                  {
                    id: "system",
                    icon: <Server size={18} />,
                    label: t("systemConfig"),
                  },
                  {
                    id: "security_logs",
                    icon: <ShieldAlert size={18} />,
                    label: t("securityLogs"),
                  },
                  {
                    id: "chatbot",
                    icon: <MessageSquare size={18} />,
                    label: t("chatbotDocuments"),
                  },
                  ...((Array.isArray(user?.roles) && user.roles.some((r: any) => {
                    const roleName = (typeof r === "string" ? r : r?.name || "").toUpperCase();
                    return roleName.includes("ADMIN");
                  })) ? [{
                    id: "organizations",
                    icon: <Globe size={18} />,
                    label: t("organizations"),
                  }] : [])
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm transition-all duration-300 ${activeTab === item.id ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 font-bold translate-x-1" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 hover:translate-x-1 font-medium"}`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6 min-w-0">
            {activeTab === "organizations" && <TenantsTab />}
            {activeTab === "chatbot" && <ChatbotSettingsTab />}
            {activeTab === "profile" && (
              <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 animate-fade-in">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                  <User size={24} className="text-blue-600" /> Personal Information
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <TextInput
                        id="firstName"
                        className="mt-1"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <TextInput
                        id="lastName"
                        className="mt-1"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <TextInput
                      id="email"
                      icon={Mail}
                      className="mt-1"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Assigned Branch</Label>
                    <Select
                      className="mt-1"
                      icon={Building2}
                      value={profileData.branch}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setProfileData({
                          ...profileData,
                          branch: e.target.value,
                        })
                      }
                    >
                      <option>Main Office</option>
                      <option>West Branch</option>
                      <option>South Center</option>
                    </Select>
                  </div>
                  <div className="pt-4 flex justify-between items-center border-t mt-6 pt-6">
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
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold px-6 py-3.5 rounded-xl flex items-center transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                    >
                      <Trash2 size={18} className="mr-2" /> Deactivate Account
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "hr" && (
              <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 animate-fade-in">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                  <Briefcase size={24} className="text-indigo-600" /> HR Configuration
                </h2>
                <form onSubmit={handleSaveHrSettings} className="space-y-6">
                  <div className="max-w-md">
                    <Label htmlFor="staffIdFormat">
                      Official Staff ID Format Pattern
                    </Label>
                    <TextInput
                      id="staffIdFormat"
                      className="mt-1"
                      value={hrStaffIdFormat}
                      onChange={(e) => setHrStaffIdFormat(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Use <strong className="text-blue-500">{"{SEQ}"}</strong>{" "}
                      for sequential numbers and{" "}
                      <strong className="text-blue-500">{"{YYYY}"}</strong> for
                      the current year. <br />
                      Example:{" "}
                      <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-gray-800 dark:text-gray-200">
                        EMP-{"{YYYY}"}-{"{SEQ}"}
                      </code>
                    </p>
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
                      Save HR Settings
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "system" && (
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
                          onClick={() =>
                            document.getElementById("logoInput")?.click()
                          }
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
                          Recommended: Square aspect ratio (e.g. 256x256). PNG
                          format.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-md">
                    <Label htmlFor="maxImageUploadSize">
                      Max Image Upload Size (MB)
                    </Label>
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
                      Defines the maximum file size (in Megabytes) for images
                      being compressed and uploaded by users. E.g.{" "}
                      <strong className="text-blue-500">1</strong> for 1MB.
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
                        <p className="text-xs text-gray-500">
                          Automatically block IPs that spam requests.
                        </p>
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
            )}

            {activeTab === "security" && (
              <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
                    <ShieldAlert size={24} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Security & Password
                  </h2>
                </div>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <Label>New Password</Label>
                    <TextInput
                      type="password"
                      className="mt-1"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <TextInput
                      type="password"
                      className="mt-1"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      color="failure"
                      disabled={loading}
                      className="rounded-md shadow-lg shadow-red-500/20"
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 animate-fade-in">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                  <Palette size={24} className="text-blue-600" /> Application Preferences
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold dark:text-gray-200">Dark Mode</p>
                      <p className="text-xs text-gray-500">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <ToggleSwitch checked={isDark} onChange={setIsDark} />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold dark:text-gray-200">
                        System Notifications
                      </p>
                      <p className="text-xs text-gray-500">
                        Receive alerts for urgent client cases
                      </p>
                    </div>
                    <ToggleSwitch checked={true} onChange={() => { }} />
                  </div>

                  <hr className="" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold dark:text-gray-200">
                        Sidebar Position
                      </p>
                      <p className="text-xs text-gray-500">
                        Position of the main navigation menu
                      </p>
                    </div>
                    <Select
                      value={sidebarPosition}
                      onChange={(e: any) => setSidebarPosition(e.target.value)}
                      className="w-40"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </Select>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold dark:text-gray-200">
                        Sidebar Theme
                      </p>
                      <p className="text-xs text-gray-500">
                        Color scheme for the sidebar
                      </p>
                    </div>
                    <Select
                      value={sidebarTheme}
                      onChange={(e: any) => setSidebarTheme(e.target.value)}
                      className="w-40"
                    >
                      <option value="default">Default</option>
                      <option value="dark">Dark</option>
                      <option value="brand">Brand Color</option>
                    </Select>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold dark:text-gray-200">
                        Topbar Theme
                      </p>
                      <p className="text-xs text-gray-500">
                        Color scheme for the top header
                      </p>
                    </div>
                    <Select
                      value={topbarTheme}
                      onChange={(e: any) => setTopbarTheme(e.target.value)}
                      className="w-40"
                    >
                      <option value="default">Default</option>
                      <option value="dark">Dark</option>
                      <option value="brand">Brand Color</option>
                    </Select>
                  </div>

                  <hr className="" />

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold dark:text-gray-200">Language</p>
                      <p className="text-xs text-gray-500">
                        Choose your preferred interface language
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        color={i18n.language === "en" ? "blue" : "gray"}
                        onClick={() => i18n.changeLanguage("en")}
                      >
                        EN
                      </Button>
                      <Button
                        size="xs"
                        color={i18n.language === "fr" ? "blue" : "gray"}
                        onClick={() => i18n.changeLanguage("fr")}
                      >
                        FR
                      </Button>
                      <Button
                        size="xs"
                        color={i18n.language === "km" ? "blue" : "gray"}
                        onClick={() => i18n.changeLanguage("km")}
                      >
                        KM
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "location" && (
              <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/50 p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                    <Building2 size={24} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Office Location Settings
                  </h2>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Configure the primary office coordinates used for the
                  Dashboard MiniMap.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("officeLat", mapCoords.lat);
                    (typeof window !== "undefined" ? window.localStorage : { getItem: () => null, setItem: () => { }, removeItem: () => { } }).setItem("officeLng", mapCoords.lng);
                    setSuccess("Map coordinates updated successfully!");
                    setTimeout(() => setSuccess(null), 3000);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Latitude</Label>
                      <TextInput
                        type="number"
                        step="any"
                        className="mt-1"
                        value={mapCoords.lat}
                        onChange={(e) =>
                          setMapCoords({ ...mapCoords, lat: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <TextInput
                        type="number"
                        step="any"
                        className="mt-1"
                        value={mapCoords.lng}
                        onChange={(e) =>
                          setMapCoords({ ...mapCoords, lng: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                    <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl shadow-blue-500/25 active:scale-[0.98]">
                      <Save size={18} className="mr-2" /> Save Coordinates
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security_logs" && (
              <div className="animate-fade-in space-y-4">
                {/* Stats Summary Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Total Events",
                      value: accessLogs.length,
                      icon: <Activity size={16} />,
                      color: "from-blue-500 to-indigo-600",
                      bg: "bg-blue-50 dark:bg-blue-900/20",
                      text: "text-blue-600 dark:text-blue-400",
                    },
                    {
                      label: "Successful",
                      value: accessLogs.filter(
                        (l: any) => l.status === "Success",
                      ).length,
                      icon: <CheckCircle size={16} />,
                      color: "from-emerald-500 to-green-600",
                      bg: "bg-emerald-50 dark:bg-emerald-900/20",
                      text: "text-emerald-600 dark:text-emerald-400",
                    },
                    {
                      label: "Suspicious",
                      value: accessLogs.filter(
                        (l: any) => l.status === "Suspicious",
                      ).length,
                      icon: <AlertCircle size={16} />,
                      color: "from-amber-400 to-orange-500",
                      bg: "bg-amber-50 dark:bg-amber-900/20",
                      text: "text-amber-600 dark:text-amber-400",
                    },
                    {
                      label: "Failed",
                      value: accessLogs.filter(
                        (l: any) => l.status === "Failed",
                      ).length,
                      icon: <XCircle size={16} />,
                      color: "from-rose-500 to-red-600",
                      bg: "bg-rose-50 dark:bg-rose-900/20",
                      text: "text-rose-600 dark:text-rose-400",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`${stat.bg} rounded-xl p-4 flex items-center gap-3 border-white/60  shadow-sm`}
                    >
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-sm`}
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <div className={`text-xl font-black ${stat.text}`}>
                          {loadingLogs ? "—" : stat.value}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  {/* Panel Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b bg-gray-50/80 dark:bg-gray-900/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-lg">
                        <ShieldAlert size={18} />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-gray-900 dark:text-white tracking-tight">
                          Security & Access Audit Logs
                        </h2>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">
                          Monitor sessions, device footprint, and data access
                          patterns.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 rounded-lg transition-all duration-200 group">
                            <Trash2 size={12} /> Clear Logs{" "}
                            <ChevronDown
                              size={12}
                              className="opacity-50 group-hover:opacity-100"
                            />
                          </div>
                        }
                      >
                        <DropdownItem
                          onClick={() => handleClearLogs("7days")}
                          className="text-xs font-semibold hover:text-blue-600"
                        >
                          Older than 7 days
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleClearLogs("30days")}
                          className="text-xs font-semibold hover:text-blue-600"
                        >
                          Older than 30 days
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleClearLogs("success")}
                          className="text-xs font-semibold hover:text-blue-600"
                        >
                          Successful logs only
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem
                          onClick={() => handleClearLogs("all")}
                          className="text-xs font-black text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          Clear all logs
                        </DropdownItem>
                      </Dropdown>

                      <button
                        onClick={() =>
                          securitySubTab === "session"
                            ? refetchAccessLogs()
                            : refetchAuditLogs()
                        }
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700/50 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-all duration-200"
                      >
                        <Activity size={12} /> Refresh
                      </button>
                    </div>
                  </div>

                  {/* Sub-Tabs */}
                  <div className="flex px-5 border-b bg-white dark:bg-gray-800">
                    <button
                      onClick={() => setSecuritySubTab("session")}
                      className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors ${securitySubTab === "session" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
                    >
                      Session Logs
                    </button>
                    <button
                      onClick={() => setSecuritySubTab("activity")}
                      className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-colors ${securitySubTab === "activity" ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
                    >
                      Activity Logs
                    </button>
                  </div>

                  {/* Filters Bar */}
                  <div className="px-5 py-3 border-b bg-white dark:bg-gray-800 space-y-3">
                    <div className="flex flex-col md:flex-row gap-3">
                      {/* Search */}
                      <div className="flex-1 relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          id="logsSearch"
                          placeholder="Search by user, IP, location, browser, status…"
                          value={logsSearch}
                          onChange={(e) => setLogsSearch(e.target.value)}
                          className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 dark:bg-gray-700/40 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none dark:text-white dark:placeholder-gray-500 transition-all"
                        />
                        {logsSearch && (
                          <button
                            onClick={() => setLogsSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      {/* Date Range */}
                      <div className="flex items-center gap-2 shrink-0">
                        <DatePicker
                          className="w-40"
                          value={
                            logsStartDate
                              ? new Date(logsStartDate + "T00:00:00")
                              : null
                          }
                          onChange={(date) =>
                            setLogsStartDate(format(date, "yyyy-MM-dd"))
                          }
                          placeholder="Start Date"
                        />
                        <span className="text-xs text-gray-400 font-medium">
                          to
                        </span>
                        <DatePicker
                          className="w-40"
                          value={
                            logsEndDate
                              ? new Date(logsEndDate + "T00:00:00")
                              : null
                          }
                          onChange={(date) =>
                            setLogsEndDate(format(date, "yyyy-MM-dd"))
                          }
                          placeholder="End Date"
                        />
                      </div>
                    </div>

                    {/* Active Filter Chips */}
                    {(logsSearch || logsStartDate || logsEndDate) && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Active filters:
                        </span>
                        {logsSearch && (
                          <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-full border-blue-200 dark:border-blue-700/50">
                            <Search size={10} /> "{logsSearch}"
                            <button
                              onClick={() => setLogsSearch("")}
                              className="hover:bg-blue-200 dark:hover:bg-blue-700/50 rounded-full p-0.5 transition-colors"
                            >
                              <XCircle size={11} />
                            </button>
                          </span>
                        )}
                        {logsStartDate && (
                          <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[11px] font-bold rounded-full border-violet-200 dark:border-violet-700/50">
                            <Calendar size={10} /> From {logsStartDate}
                            <button
                              onClick={() => setLogsStartDate("")}
                              className="hover:bg-violet-200 dark:hover:bg-violet-700/50 rounded-full p-0.5 transition-colors"
                            >
                              <XCircle size={11} />
                            </button>
                          </span>
                        )}
                        {logsEndDate && (
                          <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[11px] font-bold rounded-full border-violet-200 dark:border-violet-700/50">
                            <Calendar size={10} /> To {logsEndDate}
                            <button
                              onClick={() => setLogsEndDate("")}
                              className="hover:bg-violet-200 dark:hover:bg-violet-700/50 rounded-full p-0.5 transition-colors"
                            >
                              <XCircle size={11} />
                            </button>
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setLogsSearch("");
                            setLogsStartDate("");
                            setLogsEndDate("");
                          }}
                          className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors ml-1"
                        >
                          Clear all
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Log Entries */}
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "52vh" }}
                  >
                    {loadingLogs ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Spinner size="xl" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Loading audit logs…
                        </p>
                      </div>
                    ) : filteredLogs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-2xl text-gray-400">
                          <ShieldAlert size={32} />
                        </div>
                        <div className="text-center">
                          <p className="font-black text-gray-500 dark:text-gray-400 text-sm">
                            {accessLogs.length === 0
                              ? "No audit logs available"
                              : "No results found"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {accessLogs.length === 0
                              ? "Logs will appear here as users access the system."
                              : "Try adjusting your search or date range filters."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {paginatedLogs.map((log: any) => {
                          if (securitySubTab === "activity") {
                            const isCritical = log.type === "critical";
                            const isWarning = log.type === "warning";
                            const isSuccess = log.type === "success";
                            const borderColor = isCritical
                              ? "border-l-rose-500"
                              : isWarning
                                ? "border-l-amber-400"
                                : isSuccess
                                  ? "border-l-emerald-500"
                                  : "border-l-blue-500";
                            return (
                              <div
                                key={`audit-${log.id}`}
                                className={`flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-l-4 ${borderColor} hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors duration-150`}
                              >
                                <div className="flex items-center gap-3 min-w-[140px]">
                                  <Avatar
                                    rounded
                                    size="sm"
                                    placeholderInitials={
                                      log.loggedUser
                                        ?.substring(0, 2)
                                        .toUpperCase() || "U"
                                    }
                                  />
                                  <div>
                                    <div className="text-xs font-black text-gray-900 dark:text-white leading-tight">
                                      {log.loggedUser || "System"}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                      {format(
                                        new Date(log.timestamp),
                                        "M/d/yyyy, h:mm:ss a",
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                                    {log.action}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    <span className="font-semibold">
                                      Target:
                                    </span>{" "}
                                    {log.target}
                                  </div>
                                </div>
                                <div className="shrink-0">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${isCritical ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-700/50" : isWarning ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/50" : isSuccess ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/50" : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/50"}`}
                                  >
                                    {log.type}
                                  </span>
                                </div>
                              </div>
                            );
                          }

                          const isSuccess = log.status === "Success";
                          const isSuspicious = log.status === "Suspicious";
                          const borderColor = isSuccess
                            ? "border-l-emerald-500"
                            : isSuspicious
                              ? "border-l-amber-400"
                              : "border-l-rose-500";
                          const DeviceIcon =
                            log.deviceType === "Mobile"
                              ? Smartphone
                              : log.deviceType === "Tablet"
                                ? Tablet
                                : log.deviceType === "Server"
                                  ? Server
                                  : Monitor;
                          return (
                            <div
                              key={`access-${log.id}`}
                              className={`flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 border-l-4 ${borderColor} hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors duration-150`}
                            >
                              {/* User */}
                              <div className="flex items-center gap-3 min-w-[140px]">
                                <Avatar
                                  rounded
                                  size="sm"
                                  placeholderInitials={
                                    log.loggedBy
                                      ?.substring(0, 2)
                                      .toUpperCase() || "U"
                                  }
                                />
                                <div>
                                  <div className="text-xs font-black text-gray-900 dark:text-white leading-tight">
                                    {log.loggedBy || "Unknown"}
                                  </div>
                                  <div className="text-[10px] text-gray-400 mt-0.5">
                                    {isSuccess ? (
                                      <span className="text-emerald-500 font-bold">
                                        ✓ Success
                                      </span>
                                    ) : isSuspicious ? (
                                      <span className="text-amber-500 font-bold">
                                        ⚠ Suspicious
                                      </span>
                                    ) : (
                                      <span className="text-rose-500 font-bold">
                                        ✕ Failed
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Location & IP */}
                              <div className="flex items-center gap-2 min-w-[150px]">
                                <Globe
                                  size={13}
                                  className="text-blue-400 shrink-0"
                                />
                                <div>
                                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">
                                    {log.location || "Unknown"}
                                  </div>
                                  <div className="text-[10px] text-gray-400 font-mono">
                                    {log.ipAddress}
                                  </div>
                                </div>
                              </div>

                              {/* Device */}
                              <div className="flex items-center gap-2 min-w-[140px]">
                                <div className="p-1.5 bg-gray-100 dark:bg-gray-700/70 rounded-lg text-gray-500 dark:text-gray-400 shrink-0">
                                  <DeviceIcon size={13} />
                                </div>
                                <div>
                                  <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 leading-tight">
                                    {log.os || "—"}
                                  </div>
                                  <div className="text-[10px] text-gray-400">
                                    {log.browser || "—"}
                                  </div>
                                </div>
                              </div>

                              {/* Data Usage Badge */}
                              <div className="shrink-0">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${log.dataUsageType?.includes("Heavy") ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-700/50" : log.dataUsageType?.includes("API") ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-700/50" : "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-700/50"}`}
                                >
                                  {log.dataUsageType || "Standard"}
                                </span>
                              </div>

                              {/* Timestamp — push to right */}
                              <div className="sm:ml-auto text-right shrink-0">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  Logged
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-300 font-mono mt-0.5">
                                  {log.loggedDate
                                    ? new Date(log.loggedDate).toLocaleString()
                                    : "N/A"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {filteredLogs.length > 0 && (
                    <div className="border-t bg-gray-50/50 dark:bg-gray-900/20 rounded-b-xl">
                      <ModernPagination
                        currentPage={logsCurrentPage}
                        totalPages={totalPages}
                        onPageChange={setLogsCurrentPage}
                        totalItems={totalItems}
                        pageSize={logsPageSize}
                        onPageSizeChange={setLogsPageSize}
                        className="!border-none !bg-transparent !shadow-none !backdrop-blur-none hover:!shadow-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {cropImageSrc && (
        <ImageCropperModal
          isOpen={isCropModalOpen}
          onClose={() => {
            setIsCropModalOpen(false);
            setCropImageSrc(null);
          }}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
          cropShape={cropTarget === "avatar" ? "round" : "rect"}
        />
      )}
    </>
  );
};

export default SettingsPage;

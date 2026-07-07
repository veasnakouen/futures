import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {Button, Label, TextInput, Select, Alert, Spinner} from '@/lib/flowbite-compat';
import {
  Database,
  Server,
  RefreshCw,
  AlertOctagon,
  Activity,
  CheckCircle,
  HelpCircle,
  Save,
} from "lucide-react";
import api from '@/services/api';
import toast from "react-hot-toast";

const SwitchDatabase: React.FC = () => {
  const { t } = useTranslation();
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [selectedDb, setSelectedDb] = useState("");
  const [customDb, setCustomDb] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [backupType, setBackupType] = useState("full");
  const [backingUp, setBackingUp] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [backupSettings, setBackupSettings] = useState({
    backupPathLocal: "C:\\Backups",
    backupCloudEnabled: "false",
    backupCloudBucket: "",
    backupCloudRegion: "us-east-1",
    backupCloudAccessKey: "",
    backupCloudSecretKey: "",
    backupScheduleEnabled: "false",
    backupScheduleCron: "0 0 0 * * ?",
    backupScheduleType: "full",
  });

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/database/current");
      setDbInfo(res.data);
      setSelectedDb(res.data.currentDb || "");

      const settingsRes = await api.get("/admin/database/backup-settings");
      setBackupSettings(settingsRes.data);
    } catch (err: any) {
      console.error("Failed to fetch database info", err);
      toast.error(t("failedToLoadDbInfo"));
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    const dbToSwitch = isCustom ? customDb.trim() : selectedDb;

    if (!dbToSwitch) {
      toast.error(t("enterOrSelectDbName"));
      return;
    }

    try {
      setSwitching(true);
      const res = await api.post("/admin/database/switch", {
        databaseName: dbToSwitch,
      });
      toast.success(res.data.message || t("switchedDbTo", { name: dbToSwitch }));
      await fetchDatabaseInfo();
      setCustomDb("");
      setIsCustom(false);
    } catch (err: any) {
      console.error("Failed to switch database", err);
      const msg = err.response?.data || err.message || "Switch failed";
      toast.error(t("dbSwitchFailed", { msg }));
    } finally {
      setSwitching(false);
    }
  };

  const handleBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBackingUp(true);
      const res = await api.post("/admin/database/backup", {
        type: backupType,
      });
      toast.success(res.data.message || t("dbBackupSuccess"));
      if (res.data.file) {
        toast.success(t("savedTo", { file: res.data.file }), { duration: 6000 });
      }
    } catch (err: any) {
      console.error("Failed to backup database", err);
      const msg = err.response?.data || err.message || "Backup failed";
      toast.error(t("backupFailed", { msg }));
    } finally {
      setBackingUp(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await api.post("/admin/database/backup-settings", backupSettings);
      toast.success(t("backupSettingsSavedSuccess"));
    } catch (err: any) {
      console.error("Failed to save settings", err);
      toast.error(t("failedToSaveBackupSettings"));
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Current Database Info Card */}
        <div className="lg:col-span-2 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-100/50 dark:shadow-black/40 border border-white/20 dark:border-gray-700/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-md blur-2xl pointer-events-none"></div>

          <div className="flex justify-between items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 group-hover:scale-110 transition-transform duration-300">
              <Database size={24} />
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>{" "}
              {t("active")}
            </span>
          </div>

          <h3 className="text-lg font-black dark:text-white tracking-tight">
            {t("activeConnectionNode")}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
            {t("currentWorkspaceTargetDb")}
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-md /50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {t("databaseName")}
                </p>
                <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5 select-all">
                  {dbInfo?.currentDb || "unknown"}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-md /50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {t("hikariPool")}
                </p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1 select-all">
                  {dbInfo?.poolName || "MtpHikariPool"}
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-md /50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {t("jdbcString")}
                </p>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1 font-mono break-all line-clamp-2 select-all hover:line-clamp-none transition-all duration-300 cursor-pointer">
                  {dbInfo?.jdbcUrl || "unknown"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Database Switcher Panel */}
        <div className="lg:col-span-3 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-blue-100/50 dark:shadow-black/40 border border-white/20 dark:border-gray-700/50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-gray-800 to-gray-600 dark:from-gray-700 dark:to-gray-500 text-white rounded-xl shadow-md">
                <Server size={20} />
              </div>
              <h3 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t("dbRouterConfig")}
              </h3>
            </div>
            <Button
              color="light"
              size="xs"
              onClick={fetchDatabaseInfo}
              disabled={loading}
              className="rounded-md font-black uppercase text-[10px] h-12"
            >
              <RefreshCw
                size={12}
                className={`mr-1.5 ${loading ?"animate-spin":""}`}
              />{" "}
              {t("refresh")}
            </Button>
          </div>

          <form onSubmit={handleSwitch} className="space-y-6">
            <Alert
              color="warning"
              icon={AlertOctagon}
              className="rounded-xl border border-amber-200/50 dark:border-amber-900/30 shadow-md dark:bg-amber-950/20 dark:text-amber-300 backdrop-blur-sm"
            >
              <div className="text-xs leading-relaxed font-semibold">
                <span className="font-black uppercase tracking-wider block mb-1">
                  {t("criticalNotice")}
                </span>
                {t("dbSwitchWarning")}
              </div>
            </Alert>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsCustom(false)}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-black uppercase tracking-wider transition-all ${!isCustom ?"bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40":"bg-transparent  text-gray-500 hover:bg-gray-50"}`}
                >
                  {t("selectDatabase")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-black uppercase tracking-wider transition-all ${isCustom ?"bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40":"bg-transparent  text-gray-500 hover:bg-gray-50"}`}
                >
                  {t("customTargetName")}
                </button>
              </div>

              {!isCustom ? (
                <div>
                  <Label
                    htmlFor="db-select"
                    className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500"
                  >
                    {t("availableDatabases")}
                  </Label>
                  <Select
                    id="db-select"
                    className="mt-1.5"
                    value={selectedDb}
                    onChange={(e) => setSelectedDb(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {t("selectTargetDatabasePlaceholder")}
                    </option>
                    <option value="MtpAppDB2018_full">
                      MtpAppDB2018_full (Production Primary)
                    </option>
                    <option value="MtpAppDB2018_test">
                      MtpAppDB2018_test (Testing Sandbox)
                    </option>
                    <option value="MtpAppDB2018_archive">
                      MtpAppDB2018_archive (Historical Archives)
                    </option>
                    <option value="futures">
                      futures (Alternative Database)
                    </option>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label
                    htmlFor="custom-db"
                    className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500"
                  >
                    {t("customSqlDbTargetName")}
                  </Label>
                  <TextInput
                    id="custom-db"
                    type="text"
                    className="mt-1.5 font-bold"
                    placeholder={t("customDbPlaceholder")}
                    value={customDb}
                    onChange={(e) => setCustomDb(e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                    {t("dbMustExistSameInstance")}
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              color={switching ? "light" : "blue"}
              disabled={switching || loading}
              className="w-full rounded-md h-12 font-black uppercase text-xs tracking-wider shadow-lg shadow-blue-500/20"
            >
              {switching ? (
                <>
                  <Spinner size="sm" className="mr-2" /> {t("connectingEstablishingPool")}
                </>
              ) : (
                <>
                  <RefreshCw size={14} className="mr-2 animate-pulse" />{" "}
                  {t("reRouteActiveDatasource")}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Database Backup Panel */}
      <div className="w-full p-6 rounded-md dark:bg-gray-800/40 dark:backdrop-blur-md shadow-lg mt-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-md blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md shadow-sm">
              <Save size={20} />
            </div>
            <h3 className="text-lg font-black dark:text-white tracking-tight">
              {t("dbBackupAndRecovery")}
            </h3>
          </div>
        </div>

        <form onSubmit={handleBackup} className="space-y-6 max-w-2xl">
          <Alert
            color="info"
            className="rounded-md border-none shadow-sm dark:bg-blue-950/20 dark:text-blue-300"
          >
            <div className="text-xs leading-relaxed font-semibold">
              <span className="font-black uppercase tracking-wider block mb-1">
                {t("backupOperations")}
              </span>
              {t("backupOperationsDesc")}
            </div>
          </Alert>

          <div>
            <Label
              htmlFor="backup-type"
              className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500"
            >
              {t("selectBackupType")}
            </Label>
            <Select
              id="backup-type"
              className="mt-1.5"
              value={backupType}
              onChange={(e) => setBackupType(e.target.value)}
              required
            >
              <option value="full">
                {t("fullBackup")}
              </option>
              <option value="differential">
                {t("differentialBackup")}
              </option>
            </Select>
          </div>

          <Button
            type="submit"
            color={backingUp ? "light" : "success"}
            disabled={backingUp}
            className="w-full md:w-auto rounded-md h-12 px-8 font-black uppercase text-xs tracking-wider shadow-lg shadow-emerald-500/20"
          >
            {backingUp ? (
              <>
                <Spinner size="sm" className="mr-2" /> {t("generatingBackupFile")}
              </>
            ) : (
              <>
                <Save size={14} className="mr-2" /> {t("triggerDatabaseBackup")}
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Backup Settings Panel */}
      <div className="w-full p-6 rounded-md dark:bg-gray-800/40 dark:backdrop-blur-md shadow-lg mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-400/5 rounded-md blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-md shadow-sm">
              <Server size={20} />
            </div>
            <h3 className="text-lg font-black dark:text-white tracking-tight">
              {t("advancedBackupConfig")}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Local/Network Path */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 border-b pb-2">
                {t("localNetworkStorage")}
              </h4>
              <div>
                <Label className="text-xs font-black uppercase text-gray-400">
                  {t("targetPathUncOrLocal")}
                </Label>
                <TextInput
                  className="mt-1"
                  value={backupSettings.backupPathLocal}
                  onChange={(e) =>
                    setBackupSettings({
                      ...backupSettings,
                      backupPathLocal: e.target.value,
                    })
                  }
                  placeholder="C:\Backups or \\192.168.1.50\Shared"
                  required
                />
              </div>
            </div>

            {/* Cloud Settings */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 border-b pb-2">
                {t("cloudStorageS3")}
              </h4>
              <div>
                <Label className="text-xs font-black uppercase text-gray-400">
                  {t("enableCloudUpload")}
                </Label>
                <Select
                  className="mt-1"
                  value={backupSettings.backupCloudEnabled}
                  onChange={(e) =>
                    setBackupSettings({
                      ...backupSettings,
                      backupCloudEnabled: e.target.value,
                    })
                  }
                >
                  <option value="false">{t("disabled")}</option>
                  <option value="true">{t("enabled")}</option>
                </Select>
              </div>
              {backupSettings.backupCloudEnabled === "true" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label className="text-xs font-black uppercase text-gray-400">
                      {t("bucketName")}
                    </Label>
                    <TextInput
                      className="mt-1"
                      value={backupSettings.backupCloudBucket}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          backupCloudBucket: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-black uppercase text-gray-400">
                      {t("region")}
                    </Label>
                    <TextInput
                      className="mt-1"
                      value={backupSettings.backupCloudRegion}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          backupCloudRegion: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-black uppercase text-gray-400">
                      {t("accessKey")}
                    </Label>
                    <TextInput
                      className="mt-1"
                      type="password"
                      value={backupSettings.backupCloudAccessKey}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          backupCloudAccessKey: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-black uppercase text-gray-400">
                      {t("secretKey")}
                    </Label>
                    <TextInput
                      className="mt-1"
                      type="password"
                      value={backupSettings.backupCloudSecretKey}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          backupCloudSecretKey: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Automated Scheduling */}
            <div className="space-y-4 md:col-span-2">
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 border-b pb-2">
                {t("automatedBackgroundScheduling")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-black uppercase text-gray-400">
                    {t("enableScheduler")}
                  </Label>
                  <Select
                    className="mt-1"
                    value={backupSettings.backupScheduleEnabled}
                    onChange={(e) =>
                      setBackupSettings({
                        ...backupSettings,
                        backupScheduleEnabled: e.target.value,
                      })
                    }
                  >
                    <option value="false">{t("disabled")}</option>
                    <option value="true">{t("enabled")}</option>
                  </Select>
                </div>
                {backupSettings.backupScheduleEnabled === "true" && (
                  <>
                    <div>
                      <Label className="text-xs font-black uppercase text-gray-400">
                        {t("scheduleFrequencyCron")}
                      </Label>
                      <Select
                        className="mt-1"
                        value={backupSettings.backupScheduleCron}
                        onChange={(e) =>
                          setBackupSettings({
                            ...backupSettings,
                            backupScheduleCron: e.target.value,
                          })
                        }
                      >
                        <option value="0 0 0 * * ?">{t("dailyAtMidnight")}</option>
                        <option value="0 0 2 * * ?">{t("dailyAt2AM")}</option>
                        <option value="0 0 0 * * SUN">
                          {t("weeklySundayMidnight")}
                        </option>
                        <option value="0 0/5 * * * ?">
                          {t("every5MinutesTesting")}
                        </option>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-black uppercase text-gray-400">
                        {t("scheduledBackupType")}
                      </Label>
                      <Select
                        className="mt-1"
                        value={backupSettings.backupScheduleType}
                        onChange={(e) =>
                          setBackupSettings({
                            ...backupSettings,
                            backupScheduleType: e.target.value,
                          })
                        }
                      >
                        <option value="full">{t("fullBackup")}</option>
                        <option value="differential">
                          {t("differentialBackup")}
                        </option>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              color={savingSettings ? "light" : "blue"}
              disabled={savingSettings}
              className="rounded-md h-10 px-6 font-black uppercase text-xs tracking-wider shadow-lg shadow-blue-500/20"
            >
              {savingSettings ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Save size={14} className="mr-2" />
              )}
              {t("saveConfiguration")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwitchDatabase;

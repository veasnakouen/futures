import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import toast from "react-hot-toast";

export function useSwitchDatabaseState() {
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

  return {
    t,
    dbInfo,
    loading,
    switching,
    selectedDb,
    setSelectedDb,
    customDb,
    setCustomDb,
    isCustom,
    setIsCustom,
    backupType,
    setBackupType,
    backingUp,
    savingSettings,
    backupSettings,
    setBackupSettings,
    fetchDatabaseInfo,
    handleSwitch,
    handleBackup,
    handleSaveSettings,
  };
}

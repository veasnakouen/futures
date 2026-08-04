import React from "react";
import { Button, Label, TextInput, Select, Spinner } from "@/lib/flowbite-compat";
import { Server, Save } from "lucide-react";

interface Props {
  state: any;
}

export default function BackupSettingsPanel({ state }: Props) {
  const {
    t,
    backupSettings,
    setBackupSettings,
    savingSettings,
    handleSaveSettings,
  } = state;

  return (
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
                      <option value="0 0 0 * * SUN">{t("weeklySundayMidnight")}</option>
                      <option value="0 0/5 * * * ?">{t("every5MinutesTesting")}</option>
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
                      <option value="differential">{t("differentialBackup")}</option>
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
            className="rounded-md h-10 px-6 font-black uppercase text-xs tracking-wider shadow-lg shadow-blue-500/20 cursor-pointer"
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
  );
}

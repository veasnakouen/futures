import React from "react";
import { Button, Label, Select, Alert, Spinner } from "@/lib/flowbite-compat";
import { Save } from "lucide-react";

interface Props {
  state: any;
}

export default function DatabaseBackupPanel({ state }: Props) {
  const { t, backupType, setBackupType, backingUp, handleBackup } = state;

  return (
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
            <option value="full">{t("fullBackup")}</option>
            <option value="differential">{t("differentialBackup")}</option>
          </Select>
        </div>

        <Button
          type="submit"
          color={backingUp ? "light" : "success"}
          disabled={backingUp}
          className="w-full md:w-auto rounded-md h-12 px-8 font-black uppercase text-xs tracking-wider shadow-lg shadow-emerald-500/20 cursor-pointer"
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
  );
}

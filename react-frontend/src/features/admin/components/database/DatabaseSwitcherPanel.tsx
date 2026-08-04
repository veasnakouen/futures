import React from "react";
import { Button, Label, TextInput, Select, Alert, Spinner } from "@/lib/flowbite-compat";
import { Server, RefreshCw, AlertOctagon } from "lucide-react";

interface Props {
  state: any;
}

export default function DatabaseSwitcherPanel({ state }: Props) {
  const {
    t,
    loading,
    switching,
    selectedDb,
    setSelectedDb,
    customDb,
    setCustomDb,
    isCustom,
    setIsCustom,
    fetchDatabaseInfo,
    handleSwitch,
  } = state;

  return (
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
          className="rounded-md font-black uppercase text-[10px] h-12 cursor-pointer"
        >
          <RefreshCw size={12} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} />{" "}
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
              className={`flex-1 py-2 px-3 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                !isCustom
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40"
                  : "bg-transparent text-gray-500 hover:bg-gray-50"
              }`}
            >
              {t("selectDatabase")}
            </button>
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isCustom
                  ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40"
                  : "bg-transparent text-gray-500 hover:bg-gray-50"
              }`}
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
          className="w-full rounded-md h-12 font-black uppercase text-xs tracking-wider shadow-lg shadow-blue-500/20 cursor-pointer"
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
  );
}

import React from "react";
import { Label, TextInput, Spinner } from "@/lib/flowbite-compat";
import { ShieldAlert, Save } from "lucide-react";

export default function SettingsSecurityTab({ state }: { state: any }) {
  const {
    passwordData,
    setPasswordData,
    handleUpdatePassword,
    loading,
  } = state;

  return (
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
        <div className="pt-4 border-t mt-6">
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
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

import React from "react";
import { Label, TextInput, Select, Spinner } from "@/lib/flowbite-compat";
import { User, Mail, Building2, Save, Trash2 } from "lucide-react";

export default function SettingsProfileTab({ state }: { state: any }) {
  const {
    profileData,
    setProfileData,
    handleUpdateProfile,
    loading,
  } = state;

  return (
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
  );
}

import React, { useState } from "react";
import { format } from "date-fns";
import { User, Users, Briefcase, Info, Shield, Heart, AlertCircle, Activity, FileText, Download, Camera, CheckCircle } from "lucide-react";
import AddFamilyMemberModal from "./AddFamilyMemberModal";
import AddHealthRecordModal from "./AddHealthRecordModal";
import AddCaseModal from "./AddCaseModal";
import UploadDocumentModal from "./UploadDocumentModal";

interface ClientInfoTabsProps {
  client: any;
  educations?: any[];
  familyMembers?: any[];
  healthRecords?: any[];
  cases?: any[];
  documents?: any[];
}

const ClientInfoTabs: React.FC<ClientInfoTabsProps> = ({ 
  client, 
  educations,
  familyMembers = [],
  healthRecords = [],
  cases = [],
  documents = []
}) => {
  const [activeTab, setActiveTab] = useState("Client Information");
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const tabs = [
    "Client Information",
    "Administration Information",
    "Family Information",
    "Health Information",
    "Case Summary",
    "Document Management",
  ];

  const getAge = (dob: string) => {
    if (!dob) return "";
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  const currentEducation = educations && educations.length > 0 ? educations[0] : null;

  return (
    <div className="w-full h-auto lg:h-full bg-transparent flex flex-col gap-6">
      {/* Horizontal Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 pt-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 font-bold text-sm rounded-2xl transition-all duration-300 relative group overflow-hidden shrink-0 ${isActive
                  ? "text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white bg-white/40 hover:bg-white/80 dark:bg-gray-800/40 dark:hover:bg-gray-800/80 backdrop-blur-md ring-1 ring-gray-200/50 dark:ring-gray-700/50 hover:shadow-md"
                }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-in fade-in duration-300" />
              )}
              <span className="relative z-10 block transform transition-transform group-hover:scale-105 group-active:scale-95">
                {tab}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {activeTab === "Client Information" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Client / Referral Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><User size={18} className="text-blue-500" /> Client / Referral Information</h3>
                <p className="text-xs text-gray-500 ml-6">Basic identification and contact details</p>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500 w-1/2">Khmer Name</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.firstName || client?.lastName || "---"}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">English Name</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.englishName || "---"}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Date of Birth</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {client?.dateOfBirth ? `${getAge(client.dateOfBirth)}yrs • ${format(new Date(client.dateOfBirth), "yyyy-MM-dd")}` : "---"}
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Address</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.address || "---"}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Birth Address</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.province || "---"}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Phone Number</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.contactPhone || "---"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Carer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Users size={18} className="text-purple-500" /> Carer Information</h3>
                <p className="text-xs text-gray-500 ml-6">Primary caregiver details</p>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500 w-1/2">Current Carer</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Sophea Sok</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Carer Gender</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Female</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Relationship to Client</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Mother</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Carer Phone</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">012 345 678</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Carer Address</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Phnom Penh, Cambodia</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* School Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Briefcase size={18} className="text-emerald-500" /> School Information</h3>
                <p className="text-xs text-gray-500 ml-6">Current education status</p>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500 w-1/2">School Name</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{currentEducation?.schoolName || "Not Enrolled"}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">School Grade</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{currentEducation?.currentLevel || "---"}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Contact / Social Worker</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Mr. Chea / 098 765 432</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Other Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Info size={18} className="text-indigo-500" /> Other Information</h3>
                <p className="text-xs text-gray-500 ml-6">System identifiers and program durations</p>
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500 w-1/2">Global Id</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{client?.id || "---"}</td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Time in NGO</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {client?.registerDate ? `${Math.max(1, Math.floor((Date.now() - new Date(client.registerDate).getTime()) / (1000 * 60 * 60 * 24)))} Day(s)` : "1 Day"}
                      </td>
                    </tr>
                    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-gray-500">Time in Program</td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white leading-relaxed">
                        កម្មវិធីបណ្តុះបណ្តាល - Outreach: 0 Day<br/>
                        កម្មវិធីបណ្តុះបណ្តាលតាមមណ្ឌល - Streetbased: 0 Day
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 1. Administration Information */}
        {activeTab === "Administration Information" && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Shield size={18} className="text-amber-500" /> Administrative Records</h3>
                  <p className="text-xs text-gray-500 ml-6">System and legal registration details</p>
                </div>
                <div className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  Verified
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Registration Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{client?.registerDate ? format(new Date(client.registerDate), "PPP") : "Oct 12, 2025"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Assigned Social Worker</p>
                  <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">SC</div>
                    Sarah Connor
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Branch Location</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{client?.branch || "Phnom Penh HQ"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">ID Poor Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Poor Level 1 (Valid until Dec 2027)</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">National ID</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">0123456789</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Intake Method</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Community Outreach</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Family Information */}
        {activeTab === "Family Information" && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Users size={18} className="text-pink-500" /> Family Members</h3>
                  <p className="text-xs text-gray-500 ml-6">Registered relatives and dependents</p>
                </div>
                <button onClick={() => setIsFamilyModalOpen(true)} className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                  + Add Member
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">Name</th>
                      <th className="px-4 py-3 font-medium">Relationship</th>
                      <th className="px-4 py-3 font-medium">Age</th>
                      <th className="px-4 py-3 font-medium">Occupation</th>
                      <th className="px-4 py-3 font-medium">Contact</th>
                      <th className="px-4 py-3 font-medium rounded-tr-lg">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group cursor-pointer">
                      <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">Sophea Sok</td>
                      <td className="px-4 py-4 text-gray-500">Mother</td>
                      <td className="px-4 py-4 text-gray-500">45</td>
                      <td className="px-4 py-4 text-gray-500">Vendor</td>
                      <td className="px-4 py-4 text-gray-500">012 345 678</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md text-[10px] font-bold uppercase">Primary Carer</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group cursor-pointer">
                      <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">Vuthy Chea</td>
                      <td className="px-4 py-4 text-gray-500">Father</td>
                      <td className="px-4 py-4 text-gray-500">48</td>
                      <td className="px-4 py-4 text-gray-500">Construction</td>
                      <td className="px-4 py-4 text-gray-500">098 765 432</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md text-[10px] font-bold uppercase">Relative</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group cursor-pointer">
                      <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">Bopha Chea</td>
                      <td className="px-4 py-4 text-gray-500">Sister</td>
                      <td className="px-4 py-4 text-gray-500">14</td>
                      <td className="px-4 py-4 text-gray-500">Student</td>
                      <td className="px-4 py-4 text-gray-500">---</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-md text-[10px] font-bold uppercase">Dependent</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. Health Information */}
        {activeTab === "Health Information" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Heart size={18} className="text-rose-500" /> Vital Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-500 font-medium">Blood Type</span>
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded">{healthRecords.length > 0 ? healthRecords[0].bloodType : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-500 font-medium">Height</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{healthRecords.length > 0 && healthRecords[0].height ? `${healthRecords[0].height} cm` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-500 font-medium">Weight</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{healthRecords.length > 0 && healthRecords[0].weight ? `${healthRecords[0].weight} kg` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Last Checkup</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{healthRecords.length > 0 && healthRecords[0].lastCheckupDate ? format(new Date(healthRecords[0].lastCheckupDate), "dd MMM yyyy") : "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 p-6 flex items-start gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg shrink-0">
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-900 dark:text-red-400 mb-1">Known Allergies</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                    {healthRecords.length > 0 && healthRecords[0].allergies ? healthRecords[0].allergies : "No known allergies."}
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
                <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Activity size={18} className="text-teal-500" /> Medical History</h3>
                  <button onClick={() => setIsHealthModalOpen(true)} className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    + Add Record
                  </button>
                </div>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                  {/* Timeline Item 1 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-teal-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">Annual Vaccination</h4>
                        <span className="text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Nov 2025</span>
                      </div>
                      <p className="text-xs text-gray-500">Administered standard flu shot and updated tetanus booster at Kantha Bopha Hospital.</p>
                    </div>
                  </div>
                  {/* Timeline Item 2 */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dental Checkup</h4>
                        <span className="text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">Aug 2025</span>
                      </div>
                      <p className="text-xs text-gray-500">Routine cleaning. Two minor cavities filled. Next appointment in 6 months.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Case Summary */}
        {activeTab === "Case Summary" && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Briefcase size={18} className="text-blue-500" /> Active & Historical Cases</h3>
                  <p className="text-xs text-gray-500 ml-6">Overview of social work interventions</p>
                </div>
                <button onClick={() => setIsCaseModalOpen(true)} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-md shadow-blue-500/20">
                  + New Case
                </button>
              </div>
              <div className="space-y-4">
                {cases.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No cases found.</div>
                ) : (
                  cases.map((c: any) => (
                    <div key={c.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow bg-gray-50/50 dark:bg-gray-800/50 group cursor-pointer gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                          <AlertCircle size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{c.subject || c.serviceType}</h4>
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[9px] font-black uppercase tracking-wider rounded">{c.priority}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1">{c.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Opened</p>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">{c.openDate ? format(new Date(c.openDate), "dd MMM yyyy") : "N/A"}</p>
                        </div>
                        <div className="text-right hidden md:block">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Assigned To</p>
                          <p className="text-xs font-medium text-gray-900 dark:text-white">Worker #{c.caseWorkerId || "?"}</p>
                        </div>
                        <div className="px-3 py-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">
                          {c.status}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. Document Management */}
        {activeTab === "Document Management" && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="mb-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><FileText size={18} className="text-indigo-500" /> Client Documents & Files</h3>
                  <p className="text-xs text-gray-500 ml-6">Securely stored identification and legal files</p>
                </div>
                <button onClick={() => setIsDocModalOpen(true)} className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-md shadow-indigo-500/20 flex items-center gap-2">
                  <Download size={14} /> Upload File
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {documents.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">No documents uploaded.</div>
                ) : (
                  documents.map((doc: any) => (
                    <div key={doc.id} className="group relative p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-lg ${doc.fileType === 'PDF' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'} flex items-center justify-center shrink-0`}>
                          <FileText size={20} />
                        </div>
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100">
                          <Download size={16} />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors" title={doc.fileName}>{doc.fileName}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="uppercase font-bold text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{doc.fileType || "FILE"}</span>
                          <span>{doc.fileSize || "Unknown size"}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AddFamilyMemberModal isOpen={isFamilyModalOpen} onClose={() => setIsFamilyModalOpen(false)} clientId={client?.id} />
      <AddHealthRecordModal isOpen={isHealthModalOpen} onClose={() => setIsHealthModalOpen(false)} clientId={client?.id} />
      <AddCaseModal isOpen={isCaseModalOpen} onClose={() => setIsCaseModalOpen(false)} clientId={client?.id} />
      <UploadDocumentModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} clientId={client?.id} />
    </div>
  );
};

export default ClientInfoTabs;

import React from "react";

interface EmployeeProfileTabProps {
  employee: any;
}

const EmployeeProfileTab: React.FC<EmployeeProfileTabProps> = ({ employee }) => {
  return (
    <div className="w-full h-full bg-transparent flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Identity Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Identity Details</h3>
            <p className="text-xs text-gray-500">Basic identification and personal information</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Field</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Full Name (English)</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {employee?.title} {employee?.firstNameEnglish} {employee?.lastNameEnglish}
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Full Name (Khmer)</td>
                  <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                    {employee?.firstNameKhmer} {employee?.lastNameKhmer}
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Gender Identity</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.gender || "---"}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Date of Birth</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.dateOfBirth || "---"}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Nationality</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.nationality || "---"}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Blood Group</td>
                  <td className="px-4 py-3 font-medium text-red-600">{employee?.bloodGroup || "---"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Contact Information</h3>
            <p className="text-xs text-gray-500">Address and communication details</p>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Field</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Primary Contact</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.phoneNumber || "---"}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Staff Email</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{employee?.email || "---"}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Residential Address</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.address || "---"}</td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-3 text-gray-500">Place of Birth</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.placeOfBirth || "---"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Career Roadmap */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 xl:col-span-2">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Career Roadmap</h3>
            <p className="text-xs text-gray-500">Current designation and employment status</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Current Designation</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.position?.name || employee?.position || "Staff"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Department</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.department?.name || employee?.department || "General"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Join Date</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.joinDate || "---"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Supervisor</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.manager || "Not Assigned"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Field</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Contract Period</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {employee?.contractStartDate || "N/A"} — {employee?.contractEndDate || "Ongoing"}
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Probation End Date</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{employee?.probationEndDate || "None"}</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Employment Status</td>
                    <td className="px-4 py-3 font-medium text-green-600">Full-Time Persistent</td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-gray-500">Compensation Tier</td>
                    <td className="px-4 py-3 font-medium text-blue-600">${employee?.basicSalary?.toLocaleString() || "0"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeProfileTab;

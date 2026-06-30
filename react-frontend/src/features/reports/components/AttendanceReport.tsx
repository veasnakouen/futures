import React from "react";
import { format } from "date-fns";

interface Props {
  data: any[];
  customTitle?: string;
  customSubtitle?: string;
  customLogoUrl?: string | null;
  customLogoLocation?: "top-left" | "top-center" | "top-right";
  customLogoShape?: "rectangle" | "rounded" | "circle";
  customFooterText?: string;
  customSignatures?: string;
  customDateLocation?: string;
}

const AttendanceReport = ({
  data,
  customTitle,
  customSubtitle,
  customLogoUrl,
  customLogoLocation,
  customLogoShape,
  customFooterText,
  customSignatures,
  customDateLocation,
}: Props) => {
  return (
    <div className="p-12 bg-white text-gray-900 font-serif min-h-[297mm]">
      {/* Report Header */}
      <div className="text-center mb-10 border-b-4 border-double border-gray-900 pb-6 relative min-h-[100px]">
        {customLogoUrl && (
          <div
            className={`absolute top-0 ${
              !customLogoLocation || customLogoLocation === "top-left"
                ? "left-0"
                : customLogoLocation === "top-right"
                  ? "right-0"
                  : "left-1/2 -translate-x-1/2"
            }`}
          >
            <img
              src={customLogoUrl}
              alt="Report Logo"
              className={`h-16 object-contain ${
                customLogoShape === "circle"
                  ? "rounded-full aspect-square object-cover"
                  : customLogoShape === "rounded"
                    ? "rounded-2xl"
                    : ""
              }`}
            />
          </div>
        )}
        <div
          className={`flex flex-col items-center justify-center w-full ${customLogoUrl && customLogoLocation === "top-center" ? "pt-20" : "pt-4"}`}
        >
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            {customTitle || "Staff Attendance Audit"}
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">
            {customSubtitle || "M'Lop Tapang HR Department"}
          </p>
        </div>
      </div>

      <div className="flex justify-between mb-8 text-xs font-bold uppercase">
        <div>
          <p>
            Report ID: <span className="font-mono">ATT-{Date.now()}</span>
          </p>
          <p>Generated: {format(new Date(), "dd MMM yyyy HH:mm")}</p>
        </div>
        <div className="text-right">
          <p>Confidential Document</p>
          <p>Page 1 of 1</p>
        </div>
      </div>

      <table className="w-full text-xs border-collapse border border-gray-900">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-900 px-3 py-2 text-left">
              Staff Name
            </th>
            <th className="border border-gray-900 px-3 py-2 text-left">Date</th>
            <th className="border border-gray-900 px-3 py-2 text-center">
              Clock In
            </th>
            <th className="border border-gray-900 px-3 py-2 text-center">
              Clock Out
            </th>
            <th className="border border-gray-900 px-3 py-2 text-center">
              Hours
            </th>
            <th className="border border-gray-900 px-3 py-2 text-center">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((log, i) => {
            const parseDate = (d: any) => {
              if (!d) return null;
              if (Array.isArray(d)) {
                return new Date(
                  d[0],
                  d[1] - 1,
                  d[2],
                  d[3] || 0,
                  d[4] || 0,
                  d[5] || 0,
                );
              }
              const parsed = new Date(d);
              return isNaN(parsed.getTime()) ? null : parsed;
            };

            const start = parseDate(log.clockIn);
            const end = parseDate(log.clockOut);
            const diff =
              start && end
                ? (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                : 0;

            return (
              <tr key={i}>
                <td className="border border-gray-900 px-3 py-2 font-bold">
                  {log.employee?.firstNameEnglish}{" "}
                  {log.employee?.lastNameEnglish}
                </td>
                <td className="border border-gray-900 px-3 py-2">
                  {start ? format(start, "yyyy-MM-dd") : "N/A"}
                </td>
                <td className="border border-gray-900 px-3 py-2 text-center">
                  {start ? format(start, "HH:mm") : "--:--"}
                </td>
                <td className="border border-gray-900 px-3 py-2 text-center">
                  {end ? format(end, "HH:mm") : "--:--"}
                </td>
                <td className="border border-gray-900 px-3 py-2 text-center">
                  {diff.toFixed(2)} hrs
                </td>
                <td className="border border-gray-900 px-3 py-2 text-center font-bold uppercase">
                  {log.status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Date & Location */}
      {customDateLocation && (
        <div className="mt-12 mb-4 text-right text-sm print:break-inside-avoid">
          {customDateLocation}
        </div>
      )}

      {/* Signatures */}
      <div className="mt-20 flex justify-between px-10 print:break-inside-avoid">
        {customSignatures ? (
          customSignatures.split(",").map((sig, idx) => (
            <div key={idx} className="text-center">
              <div className="w-48 border-b border-gray-900 mb-2"></div>
              <p className="text-[10px] font-bold uppercase">{sig.trim()}</p>
            </div>
          ))
        ) : (
          <>
            <div className="text-center">
              <div className="w-48 border-b border-gray-900 mb-2"></div>
              <p className="text-[10px] font-bold uppercase">Prepared By (Admin)</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b border-gray-900 mb-2"></div>
              <p className="text-[10px] font-bold uppercase">
                Verified By (HR Manager)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {customFooterText && (
        <div className="mt-8 text-center text-[10px] text-gray-500 font-sans border-t border-gray-300 pt-4 whitespace-pre-wrap">
          {customFooterText}
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;

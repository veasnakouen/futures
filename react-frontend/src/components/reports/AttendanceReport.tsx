import React from 'react';
import { format } from 'date-fns';

const AttendanceReport = ({ data }: { data: any[] }) => {
  return (
    <div className="p-12 bg-white text-gray-900 font-serif min-h-[297mm]">
      <div className="text-center mb-10 border-b-4 border-double border-gray-900 pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Staff Attendance Audit</h1>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">M'Lop Tapang HR Department</p>
      </div>

      <div className="flex justify-between mb-8 text-xs font-bold uppercase">
        <div>
          <p>Report ID: <span className="font-mono">ATT-{Date.now()}</span></p>
          <p>Generated: {format(new Date(), 'dd MMM yyyy HH:mm')}</p>
        </div>
        <div className="text-right">
          <p>Confidential Document</p>
          <p>Page 1 of 1</p>
        </div>
      </div>

      <table className="w-full text-xs border-collapse border border-gray-900">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-900 px-3 py-2 text-left">Staff Name</th>
            <th className="border border-gray-900 px-3 py-2 text-left">Date</th>
            <th className="border border-gray-900 px-3 py-2 text-center">Clock In</th>
            <th className="border border-gray-900 px-3 py-2 text-center">Clock Out</th>
            <th className="border border-gray-900 px-3 py-2 text-center">Hours</th>
            <th className="border border-gray-900 px-3 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((log, i) => {
            const start = new Date(log.clockIn);
            const end = log.clockOut ? new Date(log.clockOut) : null;
            const diff = end ? (end.getTime() - start.getTime()) / (1000 * 60 * 60) : 0;

            return (
              <tr key={i}>
                <td className="border border-gray-900 px-3 py-2 font-bold">{log.employee?.firstNameEnglish} {log.employee?.lastNameEnglish}</td>
                <td className="border border-gray-900 px-3 py-2">{format(start, 'yyyy-MM-dd')}</td>
                <td className="border border-gray-900 px-3 py-2 text-center">{format(start, 'HH:mm')}</td>
                <td className="border border-gray-900 px-3 py-2 text-center">{end ? format(end, 'HH:mm') : '--:--'}</td>
                <td className="border border-gray-900 px-3 py-2 text-center">{diff.toFixed(2)} hrs</td>
                <td className="border border-gray-900 px-3 py-2 text-center font-bold uppercase">{log.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-20 flex justify-between px-10">
        <div className="text-center">
          <div className="w-48 border-b border-gray-900 mb-2"></div>
          <p className="text-[10px] font-bold uppercase">Prepared By (Admin)</p>
        </div>
        <div className="text-center">
          <div className="w-48 border-b border-gray-900 mb-2"></div>
          <p className="text-[10px] font-bold uppercase">Verified By (HR Manager)</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;

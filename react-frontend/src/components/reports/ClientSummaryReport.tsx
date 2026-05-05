import React from 'react';
import { format } from 'date-fns';

interface Client {
  id: number;
  clientCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  contactPhone: string;
  province: string;
  status: string;
  registerDate: string;
}

interface Props {
  data: Client[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
}

const ClientSummaryReport: React.FC<Props> = ({ data, totalRecords, currentPage, totalPages }) => {
  const safeDateFormat = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd/MM/yyyy');
    } catch (e) {
      return 'N/A';
    }
  };

  if (!Array.isArray(data)) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Error: Report data is in an invalid format.
      </div>
    );
  }

  return (
    <div className="bg-white p-8 text-black min-h-screen font-serif print:p-0">
      {/* Report Header */}
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase">Futures Program</h1>
        <h2 className="text-xl">Client Summary Report</h2>
        <div className="flex justify-between mt-4 text-[10px] font-sans italic text-gray-600">
          <div className="flex flex-col items-start">
            <span>Printed on: {format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold">TOTAL RECORDS: {totalRecords}</span>
            <span>Page Size: {data.length}</span>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-gray-300 text-xs">
          <thead>
            <tr className="bg-gray-100 uppercase">
              <th className="border border-gray-300 p-2">Code</th>
              <th className="border border-gray-300 p-2">Full Name</th>
              <th className="border border-gray-300 p-2">Gender</th>
              <th className="border border-gray-300 p-2">Province</th>
              <th className="border border-gray-300 p-2">Contact</th>
              <th className="border border-gray-300 p-2">Reg. Date</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((client) => (
              <tr key={client.id || Math.random()} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-bold">{client.clientCode || 'N/A'}</td>
                <td className="border border-gray-300 p-2">{client.firstName} {client.lastName}</td>
                <td className="border border-gray-300 p-2">{client.gender || 'N/A'}</td>
                <td className="border border-gray-300 p-2">{client.province || 'N/A'}</td>
                <td className="border border-gray-300 p-2">{client.contactPhone || 'N/A'}</td>
                <td className="border border-gray-300 p-2">
                  {safeDateFormat(client.registerDate)}
                </td>
                <td className="border border-gray-300 p-2">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                    client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {client.status || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[10px] text-gray-500 font-sans border-t pt-4">
        <p>© {new Date().getFullYear()} MT Program - System Modernization</p>
        <p className="mt-1">This is a system generated report. No signature required.</p>
      </div>

      {/* Print-specific Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-container { padding: 0 !important; margin: 0 !important; }
          @page { size: auto; margin: 10mm; }
        }
      `}} />
    </div>
  );
};

export default ClientSummaryReport;

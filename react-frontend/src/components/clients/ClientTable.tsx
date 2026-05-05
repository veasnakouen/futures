import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Avatar, Button, Pagination } from 'flowbite-react';
import { Mail, MapPin, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: number;
  clientCode: string;
  firstName: string;
  lastName: string;
  branch: string;
  gender: string;
  status: string;
  photo?: string;
  email?: string;
  contactPhone?: string;
}

interface ClientTableProps {
  clients: Client[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  handleEdit: (client: Client) => void;
  handleDelete: (id: number) => void;
  goToPageInput: string;
  setGoToPageInput: (val: string) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients, page, setPage, totalPages, handleEdit, handleDelete, goToPageInput, setGoToPageInput
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border dark:border-gray-700">
      <div className="overflow-x-auto">
        <Table hoverable className="w-full">
          <TableHead className="bg-gray-50/50 dark:bg-gray-700/30">
            <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-5 px-8">Client Identity</TableHeadCell>
            <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-5 px-8">Registration Code</TableHeadCell>
            <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-5 px-8">Branch Office</TableHeadCell>
            <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-5 px-8">System Status</TableHeadCell>
            <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-5 px-8 text-right">Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-8 py-24 text-center text-gray-400 font-bold uppercase text-xs italic tracking-widest">No records match your current filters.</TableCell>
              </TableRow>
            ) : clients.map(c => (
              <TableRow 
                key={c.id} 
                onClick={() => navigate(`/clients/${c.id}`)} 
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all group cursor-pointer"
              >
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <Avatar 
                       img={c.photo || '/default.png'} 
                       rounded 
                       size="md" 
                       placeholderInitials={`${c.firstName.charAt(0)}${c.lastName.charAt(0)}`} 
                       className="shadow-md"
                    />
                    <div>
                      <p className="font-black text-gray-900 dark:text-white leading-tight text-lg">{c.firstName} {c.lastName}</p>
                      <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1 uppercase tracking-wider">
                         <Mail size={10} className="text-blue-500" /> {c.email || 'no-email@mtp.org'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-1.5 rounded-lg font-mono text-xs font-black tracking-widest border dark:border-gray-600 shadow-inner">
                     {c.clientCode}
                  </span>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-black uppercase text-[10px] tracking-widest">
                    <MapPin size={14} className="text-rose-500" /> {c.branch}
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                       {c.status || 'Active'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button 
                       onClick={(e) => { e.stopPropagation(); handleEdit(c); }}
                       className="p-3 bg-white dark:bg-gray-700 text-blue-600 border dark:border-gray-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                       onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                       className="p-3 bg-white dark:bg-gray-700 text-rose-600 border dark:border-gray-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="px-10 py-8 bg-gray-50/50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Node <span className="text-blue-600 dark:text-blue-400">{page + 1}</span> of {totalPages}
          </p>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Jump to</span>
            <input 
              type="number" 
              min="1" 
              max={totalPages}
              value={goToPageInput}
              placeholder={String(page + 1)}
              onChange={(e) => setGoToPageInput(e.target.value)}
              onBlur={() => {
                const val = parseInt(goToPageInput);
                if (!isNaN(val) && val >= 1 && val <= totalPages) setPage(val - 1);
                setGoToPageInput('');
              }}
              className="w-14 h-9 px-2 text-center text-xs font-black bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all shadow-inner"
            />
          </div>
        </div>
        
        {totalPages > 0 && (
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p - 1)}
            showIcons
            className="pagination-premium"
          />
        )}
      </div>
    </div>
  );
};

export default ClientTable;

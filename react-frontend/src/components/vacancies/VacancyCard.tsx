import React from 'react';
import { Card, Badge, Button } from 'flowbite-react';
import { Briefcase, Building2, MapPin, DollarSign, Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface VacancyCardProps {
  vacancy: any;
  onApply: (vacancy: any) => void;
  onEdit: (vacancy: any) => void;
  onDelete: (id: number) => void;
}

const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, onApply, onEdit, onDelete }) => {
  return (
    <Card className="border-none shadow-sm hover:shadow-xl transition-all dark:bg-gray-800 p-0 overflow-hidden rounded-lg group border border-gray-100 dark:border-gray-700/50">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="p-8 flex-1 flex gap-8 items-start">
          <div className="hidden sm:flex w-24 h-24 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform overflow-hidden border dark:border-gray-700">
            {vacancy.imageUrl ? (
              <img src={vacancy.imageUrl} alt="Opportunity" className="w-full h-full object-cover" />
            ) : (
              <Briefcase size={32} />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-black dark:text-white tracking-tight">{vacancy.title}</h3>
              <Badge color={vacancy.status === 'Open' ? 'success' : 'gray'} className="rounded-full px-4 py-1 font-black uppercase text-[9px] tracking-widest">
                 {vacancy.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-5 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border dark:border-gray-600">
                 <Building2 size={14} className="text-blue-500" /> {vacancy.employerName || 'Confidential Employer'}
              </span>
              <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border dark:border-gray-600">
                 <MapPin size={14} className="text-rose-500" /> {vacancy.location || 'Phnom Penh'}
              </span>
              <span className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
                 <DollarSign size={14} /> ${vacancy.salary || 'Negotiable'}
              </span>
              <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border dark:border-gray-600">
                 <Clock size={14} className="text-amber-500" /> Closing: {vacancy.closingDate ? format(new Date(vacancy.closingDate), 'MMM dd, yyyy') : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <div className="p-8 bg-gray-50/50 dark:bg-gray-700/20 md:w-56 flex md:flex-col justify-center items-center gap-4 border-l dark:border-gray-700">
          <Button 
             color="blue" 
             size="sm" 
             onClick={() => onApply(vacancy)} 
             className="rounded-lg w-full h-12 shadow-lg shadow-blue-500/20 font-black uppercase text-[10px] tracking-widest"
          >
             Assign Client
          </Button>
          <div className="flex gap-3 mt-2">
            <button 
               onClick={() => onEdit(vacancy)} 
               className="p-3 bg-white dark:bg-gray-700 text-blue-600 border dark:border-gray-600 rounded-lg hover:bg-blue-50 transition-all shadow-sm"
            >
               <Edit size={16} />
            </button>
            <button 
               onClick={() => onDelete(vacancy.id)} 
               className="p-3 bg-white dark:bg-gray-700 text-rose-600 border dark:border-gray-600 rounded-lg hover:bg-rose-50 transition-all shadow-sm"
            >
               <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VacancyCard;

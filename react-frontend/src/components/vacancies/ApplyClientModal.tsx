import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Select, Datepicker, Popover } from 'flowbite-react';
import { UserPlus, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface ApplyClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: any;
  clients: any[];
  selectedClientId: string;
  setSelectedClientId: (id: string) => void;
  placementDate: string;
  setPlacementDate: (date: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ApplyClientModal: React.FC<ApplyClientModalProps> = ({
  isOpen, onClose, vacancy, clients, selectedClientId, setSelectedClientId, placementDate, setPlacementDate, handleSubmit
}) => {
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      setPlacementDate(dateString);
    }
  };

  return (
    <>
    <Modal show={isOpen} onClose={onClose} size="lg">
      <ModalHeader className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex flex-col">
          <h3 className="text-xl font-black dark:text-white leading-tight">Assign Candidate</h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 flex items-center gap-1">
            <Briefcase size={10} /> {vacancy?.jobTitle} @ {vacancy?.companyName}
          </p>
        </div>
      </ModalHeader>
      
      <ModalBody className="p-8 dark:bg-gray-800">
        <form id="apply-client-form" onSubmit={handleSubmit} className="space-y-6 pb-96">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Select Candidate Pool</Label>
            <Select required value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="rounded-lg">
              <option value="">Choose a client...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.clientCode})</option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Planned Commencement</Label>
            <Popover
              content={
                <div className="p-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700">
                  <Datepicker 
                    inline={true}
                    value={placementDate ? new Date(placementDate) : new Date()}
                    onChange={handleDateChange}
                  />
                </div>
              }
              placement="top"
              trigger="click"
            >
              <div className="group relative cursor-pointer">
                <div className="flex items-center justify-between w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-lg group-hover:border-blue-400 transition-all">
                  <span className={`text-sm font-bold ${placementDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {placementDate ? format(new Date(placementDate), 'MMM dd, yyyy') : 'Select Deployment Date...'}
                  </span>
                  <Calendar size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </Popover>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-blue-600">
              <UserPlus size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Assignment Strategy</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">This action will create a new placement record for the selected candidate within the enterprise network.</p>
            </div>
          </div>
        </form>
      </ModalBody>
      
      <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex gap-4 w-full">
          <Button type="submit" form="apply-client-form" color="blue" className="flex-1 rounded-lg h-12 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
            Execute Assignment <ChevronRight size={18} className="ml-2" />
          </Button>
          <Button color="gray" onClick={onClose} className="rounded-lg px-8 font-bold">Cancel</Button>
        </div>
      </ModalFooter>
    </Modal>
    </>
  );
};

export default ApplyClientModal;

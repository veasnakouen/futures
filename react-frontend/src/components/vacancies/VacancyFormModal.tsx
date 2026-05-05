import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Select, Textarea, Datepicker, Popover } from 'flowbite-react';
import { Briefcase, Calendar, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface VacancyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  employers?: any[];
  onQuickEmployer?: () => void;
}

const VacancyFormModal: React.FC<VacancyFormModalProps> = ({
  isOpen, onClose, isEditMode, formData, setFormData, handleSubmit, employers, onQuickEmployer
}) => {
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      setFormData({ ...formData, closingDate: dateString });
    }
  };

  return (
    <>
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <ModalHeader className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
          <Briefcase className="text-blue-600" size={24} />
          {isEditMode ? 'Modify Career Node' : 'Initialize Vacancy'}
        </h3>
      </ModalHeader>
      
      <ModalBody className="p-8 dark:bg-gray-800">
        <form id="vacancy-form" onSubmit={handleSubmit} className="space-y-6 pb-96">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Job Designation</Label>
              <TextInput required value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} className="rounded-lg" />
            </div>
            
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Company Entity</Label>
              <TextInput required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} className="rounded-lg" />
            </div>
            
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Location Node</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <TextInput className="pl-10 rounded-lg" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Compensatory Range</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                <TextInput className="pl-10 rounded-lg font-mono font-bold" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} placeholder="e.g. 250 - 450" />
              </div>
            </div>
            
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Application Deadline</Label>
              <Popover
                content={
                  <div className="p-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700">
                    <Datepicker 
                      inline={true}
                      value={formData.closingDate ? new Date(formData.closingDate) : new Date()}
                      onChange={handleDateChange}
                    />
                  </div>
                }
                placement="top"
                trigger="click"
              >
                <div className="group relative cursor-pointer">
                  <div className="flex items-center justify-between w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-lg group-hover:border-blue-400 transition-all">
                    <span className={`text-sm font-bold ${formData.closingDate ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {formData.closingDate ? format(new Date(formData.closingDate), 'MMM dd, yyyy') : 'Select Deadline...'}
                    </span>
                    <Calendar size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Work Modality</Label>
              <Select value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })} className="rounded-lg">
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
                <option>Contract</option>
              </Select>
            </div>
            
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Current Lifecycle Status</Label>
              <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="rounded-lg">
                <option>Active</option>
                <option>Paused</option>
                <option>Closed</option>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Operational Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="rounded-xl" />
          </div>
        </form>
      </ModalBody>
      
      <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex gap-4 w-full">
          <Button type="submit" form="vacancy-form" color="blue" className="flex-1 rounded-lg h-12 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
            {isEditMode ? 'Synchronize Record' : 'Deploy Vacancy'}
          </Button>
          <Button color="gray" onClick={onClose} className="rounded-lg px-8 font-bold">Discard</Button>
        </div>
      </ModalFooter>
    </Modal>
    </>
  );
};

export default VacancyFormModal;

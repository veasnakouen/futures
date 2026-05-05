import React from 'react';
import { Modal, ModalHeader, ModalBody, Label, TextInput, Select, Avatar, FileInput, Button } from 'flowbite-react';

interface ClientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClientRegistrationModal: React.FC<ClientRegistrationModalProps> = ({
  isOpen, onClose, isEditMode, formData, setFormData, handleSubmit, handlePhotoChange
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <ModalHeader className="border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col">
          <h3 className="text-xl font-black dark:text-white leading-tight">
            {isEditMode ? 'Modify Client Profile' : 'Execute New Registration'}
          </h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">System Node: Client_Registry_v4</p>
        </div>
      </ModalHeader>
      
      <ModalBody className="bg-white dark:bg-gray-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col items-center justify-center w-full md:w-1/3">
              <div className="relative group">
                <Avatar
                  img={formData.photo || '/default.png'}
                  rounded
                  size="xl"
                  className="shadow-2xl mb-6 border-4 border-white dark:border-gray-700"
                  placeholderInitials={formData.firstName && formData.lastName ? `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}` : 'CN'}
                />
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <p className="text-[8px] font-black text-white uppercase">Replace</p>
                </div>
              </div>
              <div className="w-full text-center relative">
                <Label htmlFor="photo" className="cursor-pointer bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 px-6 py-2.5 rounded-lg text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all inline-block shadow-sm">
                  Upload Media
                </Label>
                <FileInput id="photo" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </div>
              <p className="text-[9px] text-gray-400 mt-4 font-bold uppercase tracking-tighter italic">JPG, PNG (Max 2MB)</p>
            </div>

            <div className="flex-1 flex flex-col gap-6 justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">First Name</Label>
                  <TextInput id="firstName" placeholder="John" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="rounded-lg" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Last Name</Label>
                  <TextInput id="lastName" placeholder="Doe" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientCode" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Client Code</Label>
                  <TextInput id="clientCode" placeholder="MTP-001" required value={formData.clientCode} onChange={(e) => setFormData({ ...formData, clientCode: e.target.value })} className="rounded-lg" />
                </div>
                <div>
                  <Label htmlFor="branch" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Branch Office</Label>
                  <Select id="branch" required value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="rounded-lg">
                    <option value="Phnom Penh">Phnom Penh</option>
                    <option value="Battambang">Battambang</option>
                    <option value="Siem Reap">Siem Reap</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="gender" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Gender</Label>
              <Select id="gender" required value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="rounded-lg">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Registration Status</Label>
              <Select id="status" required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="rounded-lg">
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Email Address</Label>
              <TextInput id="email" type="email" placeholder="client@mtp.org" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-lg" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Contact Phone</Label>
              <TextInput id="phone" placeholder="+855 12 345 678" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} className="rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-12 pt-8 border-t dark:border-gray-700">
            <Button color="light" onClick={onClose} className="rounded-lg px-8 font-black uppercase text-[10px]">Discard</Button>
            <Button type="submit" color="blue" className="rounded-lg px-12 shadow-xl shadow-blue-500/30 font-black uppercase text-[10px] h-12">
              {isEditMode ? 'Update Node' : 'Initialize Record'}
            </Button>
          </div>
        </form>
      </ModalBody>

    </Modal>
  );
};

export default ClientRegistrationModal;

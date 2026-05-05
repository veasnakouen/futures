import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Select, Textarea, Datepicker, Popover } from 'flowbite-react';
import { User, Briefcase, DollarSign, ShieldCheck, Plus, Trash2, Camera, Upload, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EmployeeRegistrationModalProps {
   isOpen: boolean;
   onClose: () => void;
   isEditMode: boolean;
   regTab: 'personal' | 'employment' | 'financial' | 'emergency' | 'custom';
   setRegTab: (tab: any) => void;
   formData: any;
   setFormData: (data: any) => void;
   handleSubmit: (e: React.FormEvent) => void;
}

const EmployeeRegistrationModal: React.FC<EmployeeRegistrationModalProps> = ({
   isOpen, onClose, isEditMode, regTab, setRegTab, formData, setFormData, handleSubmit
}) => {
   
   const handleDateChange = (field: string, date: Date | null) => {
      if (date) {
         const dateString = date.toISOString().split('T')[0];
         setFormData({ ...formData, [field]: dateString });
      }
   };

   // Helper for a more premium, custom-styled DatePicker
   const DatePickerField = ({ label, value, field }: { label: string, value: string, field: string }) => (
      <div className="space-y-1.5">
         <Label className="block font-black text-[10px] uppercase text-gray-400 tracking-widest ml-1">{label}</Label>
         <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 transition-colors group-focus-within:text-blue-600 text-gray-400">
               <Calendar size={14} strokeWidth={3} />
            </div>
            <Datepicker 
               value={value ? new Date(value) : new Date()}
               onSelectedDateChanged={(date) => handleDateChange(field, date)}
               showClearButton={false}
               showTodayButton={true}
               className="w-full"
               theme={{
                  root: {
                     input: {
                        base: "block w-full border-0 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 text-sm font-bold h-11 pl-10 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-blue-400/50 dark:hover:ring-blue-500/50",
                     }
                  },
                  popup: {
                     root: {
                        base: "absolute top-10 z-[60] block pt-2",
                        inner: "inline-block rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] dark:shadow-[0_20px_50px_rgba(0,_0,_0,_0.3)] dark:bg-gray-800 border dark:border-gray-700 backdrop-blur-xl"
                     },
                     header: {
                       base: "mb-2 px-2",
                       title: "px-2 py-3 text-center font-black text-gray-900 dark:text-white text-xs uppercase tracking-widest",
                       selectors: {
                          base: "flex justify-between mb-2",
                          button: {
                             base: "text-sm rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 font-black hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-600/20 px-5 py-2.5 transition-all",
                             prev: "px-3",
                             next: "px-3",
                             view: ""
                          }
                       }
                     },
                     footer: {
                        base: "mt-4 flex space-x-2 border-t dark:border-gray-700 pt-4",
                        button: {
                           base: "w-full rounded-xl px-5 py-2.5 text-center text-[10px] font-black uppercase tracking-widest transition-all duration-200 active:scale-95",
                           today: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40",
                           clear: "border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        }
                     }
                  }
               }}
            />
         </div>
      </div>
   );

   return (
      <Modal show={isOpen} onClose={onClose} size="3xl">
         <ModalHeader className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
            <h3 className="text-xl font-black dark:text-white leading-tight">
               {isEditMode ? 'Modify Personnel Record' : 'Onboard New Staff'}
            </h3>
         </ModalHeader>
         <ModalBody className="p-0 dark:bg-gray-800 overflow-y-auto max-h-[85vh]">
            <div className="flex min-h-[600px]">
               {/* Form Sidebar - Sticky to the Modal Body */}
               <div className="w-64 bg-gray-50 dark:bg-gray-700/30 border-r dark:border-gray-700 p-8 sticky top-0 h-[600px] shrink-0">
                  <nav className="space-y-1">
                     {[
                        { id: 'personal', label: 'Personal Data', icon: <User size={14} /> },
                        { id: 'employment', label: 'Employment', icon: <Briefcase size={14} /> },
                        { id: 'financial', label: 'Financial', icon: <DollarSign size={14} /> },
                        { id: 'emergency', label: 'Emergency', icon: <ShieldCheck size={14} /> },
                        { id: 'custom', label: 'Custom Fields', icon: <Plus size={14} /> }
                     ].map(t => (
                        <button
                           key={t.id}
                           type="button"
                           onClick={() => setRegTab(t.id as any)}
                           className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${regTab === t.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                           {t.icon} {t.label}
                        </button>
                     ))}
                  </nav>
               </div>

               {/* Form Content - NO independent scroll here to prevent clipping */}
               <div className="flex-1 p-10">
                  <form id="employee-form" onSubmit={handleSubmit} className="space-y-8 pb-32">
                     {regTab === 'personal' && (
                        <div className="space-y-6 animate-fade-in">
                           {/* Profile Image Upload */}
                           <div className="flex flex-col items-center mb-8 bg-gray-50 dark:bg-gray-700/20 p-6 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
                              <div className="relative group">
                                 <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                                    {formData.photo ? (
                                       <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center text-gray-400">
                                          <User size={48} />
                                       </div>
                                    )}
                                 </div>
                                 <label className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all border-2 border-white dark:border-gray-800">
                                    <Camera size={16} />
                                    <input 
                                       type="file" 
                                       className="hidden" 
                                       accept="image/*"
                                       onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                             const reader = new FileReader();
                                             reader.onloadend = () => {
                                                setFormData({ ...formData, photo: reader.result });
                                             };
                                             reader.readAsDataURL(file);
                                          }
                                       }}
                                    />
                                 </label>
                              </div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Upload Official Personnel Photo</p>
                           </div>
                            <div className="grid grid-cols-6 gap-6">
                               <div className="col-span-1">
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Title</Label>
                                  <Select value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}>
                                     <option>Mr</option>
                                     <option>Ms</option>
                                     <option>Mrs</option>
                                     <option>Dr</option>
                                  </Select>
                               </div>
                               <div className="col-span-2">
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">First Name (EN)</Label>
                                  <TextInput required value={formData.firstNameEnglish} onChange={e => setFormData({ ...formData, firstNameEnglish: e.target.value })} />
                               </div>
                               <div className="col-span-3">
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Last Name (EN)</Label>
                                  <TextInput required value={formData.lastNameEnglish} onChange={e => setFormData({ ...formData, lastNameEnglish: e.target.value })} />
                               </div>
                            </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">First Name (KH)</Label>
                                 <TextInput value={formData.firstNameKhmer} onChange={e => setFormData({ ...formData, firstNameKhmer: e.target.value })} placeholder="នាមខ្លួន" />
                              </div>
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Last Name (KH)</Label>
                                 <TextInput value={formData.lastNameKhmer} onChange={e => setFormData({ ...formData, lastNameKhmer: e.target.value })} placeholder="នាមត្រកូល" />
                              </div>
                           </div>
                            <div className="grid grid-cols-3 gap-6">
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Gender</Label>
                                  <Select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                     <option>Male</option>
                                     <option>Female</option>
                                     <option>Other</option>
                                  </Select>
                               </div>
                               <DatePickerField label="Date of Birth" value={formData.dateOfBirth} field="dateOfBirth" />
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Blood Group</Label>
                                  <Select value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}>
                                     <option value="">Unknown</option>
                                     <option>A+</option><option>A-</option>
                                     <option>B+</option><option>B-</option>
                                     <option>O+</option><option>O-</option>
                                     <option>AB+</option><option>AB-</option>
                                  </Select>
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Nationality</Label>
                                  <TextInput value={formData.nationality} onChange={e => setFormData({ ...formData, nationality: e.target.value })} />
                               </div>
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Place of Birth</Label>
                                  <TextInput value={formData.placeOfBirth} onChange={e => setFormData({ ...formData, placeOfBirth: e.target.value })} />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Marital Status</Label>
                                  <Select value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                                     <option>Single</option>
                                     <option>Married</option>
                                     <option>Divorced</option>
                                     <option>Widowed</option>
                                  </Select>
                               </div>
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Number of Children</Label>
                                  <TextInput type="number" value={formData.children} onChange={e => setFormData({ ...formData, children: e.target.value })} />
                               </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Identity Card Type</Label>
                                  <Select value={formData.identityCardType} onChange={e => setFormData({ ...formData, identityCardType: e.target.value })}>
                                     <option>National ID</option>
                                     <option>Passport</option>
                                     <option>Driving License</option>
                                  </Select>
                               </div>
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Identity Card Number</Label>
                                  <TextInput value={formData.identityCardNumber} onChange={e => setFormData({ ...formData, identityCardNumber: e.target.value })} />
                               </div>
                            </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Contact Number</Label>
                                 <TextInput value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="+855 ..." />
                              </div>
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Email Address</Label>
                                 <TextInput type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="example@mtp.org" />
                              </div>
                           </div>
                           <div>
                              <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Home Address</Label>
                              <Textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Full residential address..." />
                           </div>
                        </div>
                     )}

                     {regTab === 'employment' && (
                        <div className="space-y-6 animate-fade-in">
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Official Staff ID</Label>
                                 <TextInput required value={formData.idNo} onChange={e => setFormData({ ...formData, idNo: e.target.value })} />
                              </div>
                              <DatePickerField label="Join Date" value={formData.joinDate} field="joinDate" />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Position / Title</Label>
                                 <TextInput required value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                              </div>
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Department</Label>
                                 <Select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                    <option>General</option>
                                    <option>IT</option>
                                    <option>Social</option>
                                    <option>Admin</option>
                                    <option>Finance</option>
                                 </Select>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Contract Type</Label>
                                 <Select value={formData.contractType} onChange={e => setFormData({ ...formData, contractType: e.target.value })}>
                                    <option>Full-Time</option>
                                    <option>Part-Time</option>
                                    <option>Contractor</option>
                                    <option>Intern</option>
                                 </Select>
                              </div>
                               <div>
                                  <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Employment Status</Label>
                                  <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                     <option>Active</option>
                                     <option>On Leave</option>
                                     <option>Probation</option>
                                     <option>Terminated</option>
                                  </Select>
                               </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                               <DatePickerField label="Contract Start Date" value={formData.contractStartDate} field="contractStartDate" />
                               <DatePickerField label="Contract End Date" value={formData.contractEndDate} field="contractEndDate" />
                               <DatePickerField label="Probation End Date" value={formData.probationEndDate} field="probationEndDate" />
                            </div>
                            <div>
                               <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Manager / Supervisor</Label>
                               <TextInput value={formData.manager} onChange={e => setFormData({ ...formData, manager: e.target.value })} placeholder="Enter manager name..." />
                            </div>
                            <div>
                               <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Internal Notes</Label>
                               <Textarea value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} placeholder="Confidential notes..." />
                            </div>
                         </div>
                     )}

                     {regTab === 'financial' && (
                        <div className="space-y-6 animate-fade-in">
                           <div>
                              <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Base Salary (USD)</Label>
                              <TextInput type="number" required value={formData.basicSalary || ''} onChange={e => setFormData({ ...formData, basicSalary: e.target.value ? parseFloat(e.target.value) : null })} />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Bank Name</Label>
                                 <TextInput value={formData.bankName || ''} onChange={e => setFormData({ ...formData, bankName: e.target.value })} placeholder="e.g. ABA Bank" />
                              </div>
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Account Number</Label>
                                 <TextInput value={formData.bankAccountNumber || ''} onChange={e => setFormData({ ...formData, bankAccountNumber: e.target.value })} placeholder="000 123 456" />
                              </div>
                           </div>
                        </div>
                     )}

                     {regTab === 'emergency' && (
                        <div className="space-y-6 animate-fade-in">
                           <div>
                              <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Full Name</Label>
                              <TextInput value={formData.emergencyContactName || ''} onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })} />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Relationship</Label>
                                 <TextInput value={formData.emergencyContact || ''} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} />
                              </div>
                              <div>
                                 <Label className="mb-1 block font-bold text-[10px] uppercase text-gray-400">Emergency Phone</Label>
                                 <TextInput value={formData.emergencyContactPhone || ''} onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })} />
                              </div>
                           </div>
                        </div>
                     )}

                     {regTab === 'custom' && (
                        <div className="space-y-6 animate-fade-in">
                           <div className="flex justify-between items-center">
                              <h4 className="text-sm font-black dark:text-white uppercase tracking-widest">Custom Record Fields</h4>
                              <Button color="light" size="xs" onClick={() => setFormData({...formData, customFields: [...formData.customFields, { key: '', value: '' }]})}>Add Field</Button>
                           </div>
                           <div className="space-y-3">
                              {formData.customFields.map((field: any, idx: number) => (
                                 <div key={idx} className="flex gap-3">
                                    <TextInput placeholder="Label (e.g. T-Shirt Size)" className="flex-1" value={field.key} onChange={e => {
                                       const newFields = [...formData.customFields];
                                       newFields[idx].key = e.target.value;
                                       setFormData({...formData, customFields: newFields});
                                    }} />
                                    <TextInput placeholder="Value" className="flex-1" value={field.value} onChange={e => {
                                       const newFields = [...formData.customFields];
                                       newFields[idx].value = e.target.value;
                                       setFormData({...formData, customFields: newFields});
                                    }} />
                                    <button type="button" className="text-red-500 p-2" onClick={() => {
                                       const newFields = formData.customFields.filter((_: any, i: number) => i !== idx);
                                       setFormData({...formData, customFields: newFields});
                                    }}><Trash2 size={16}/></button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </form>
               </div>
            </div>
         </ModalBody>
         <ModalFooter className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="flex gap-4 w-full">
               <Button color="blue" type="submit" form="employee-form" className="flex-1 rounded-lg h-12 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                  {isEditMode ? 'Synchronize Record' : 'Execute Onboarding'}
               </Button>
               <Button color="gray" onClick={onClose} className="rounded-lg px-8">Discard</Button>
            </div>
         </ModalFooter>
      </Modal>
   );
};

export default EmployeeRegistrationModal;

import React, { useState } from 'react';
import {Badge, Button, TextInput, Label, Avatar, Tooltip, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Dropdown, DropdownItem, DropdownHeader, DropdownDivider} from '@/lib/flowbite-compat';
import ModernPagination from '@/components/common/ModernPagination';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import {
   Package, Plus, Search, Download, Edit3, Trash2, Box,
   Activity, Archive, MapPin, DollarSign, Layers, LayoutGrid, List,
   Eye, ArrowRightLeft, MoveHorizontal, AlertCircle, MoreVertical, X, Upload
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import StockTransactionModal from '@/features/inventory/components/StockTransactionModal';
import DatePicker from '@/components/common/DatePicker';
import { format } from 'date-fns';

interface StockModuleProps {
   items: any[];
   onAdd: (data: any) => Promise<void>;
   onUpdate: (id: number, data: any) => Promise<void>;
   onDelete: (id: number) => Promise<void>;
   loading: boolean;
   onRefresh?: () => void;
}

const WarehouseModule: React.FC<StockModuleProps> = ({ items, onAdd, onUpdate, onDelete, loading, onRefresh }) => {
   const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('TABLE');
   const [itemsPerRow, setItemsPerRow] = useState("4");
   const [searchQuery, setSearchQuery] = useState('');
   const [categoryFilter, setCategoryFilter] = useState('ALL');

   // Modal State
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [currentStep, setCurrentStep] = useState(1);
   const [isProcessing, setIsProcessing] = useState(false);

   // Details State
   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
   const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
   const [viewingItem, setViewingItem] = useState<any>(null);
   const [selectedItemForTx, setSelectedItemForTx] = useState<any>(null);
   const defaultFormData = {
      name: '', sku: '', category: 'Office Supplies', quantity: 0,
      unit: 'pcs', minQuantity: 5, unitPrice: 0, location: 'Main Warehouse',
      status: 'In Stock', description: '', imageUrl: '',
      vendor: '', maxQuantity: 100, leadTimeDays: 7, binLocation: '',
      weight: 0, dimensions: '', batchNumber: '', barcode: '', expirationDate: '',
      isReturnable: false, isKit: false, isIntangible: false, isSubscription: false,
      isActive: true, renewalDate: '', acquisitionType: 'Purchased',
      donorOrPartnerName: '', costCenter: '', usefulLifeYears: 0,
      productFamily: '', brand: '', modelNumber: ''
   };
   const [formData, setFormData] = useState(defaultFormData);
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10);

   const safeItems = Array.isArray(items) ? items : [];
   const categories = ['ALL', 'Office Supplies', 'Electronics', 'Furniture', 'Software', 'General'];
   const filteredItems = safeItems.filter(item => {
      const matchesSearch = (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
         (item.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'ALL' || (item.category || 'General') === categoryFilter;
      return matchesSearch && matchesCat;
   });

   
   const columns: ColumnDef<any>[] = [
      {
         header: "Item Specification",
         accessorKey: "name",
         sortable: true,
         cell: (item) => (
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 shadow-sm overflow-hidden shrink-0">
                  {item.imageUrl ? (
                     <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                     <Package size={20} className="text-blue-600" />
                  )}
               </div>
               <div>
                  <p className="font-black dark:text-white uppercase tracking-tight text-sm">{item.name}</p>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.location || 'Primary Node'}</p>
               </div>
            </div>
         )
      },
      {
         header: "SKU / ID",
         accessorKey: "sku",
         sortable: true,
         className: "font-mono text-[10px] font-black text-gray-500"
      },
      {
         header: "Category",
         accessorKey: "category",
         sortable: true,
         cell: (item) => (
            <Badge color="gray" className="rounded-lg px-3 py-1 text-[9px] font-black uppercase">
               {item.category || 'General'}
            </Badge>
         )
      },
      {
         header: "Stock Level",
         accessorKey: "quantity",
         sortable: true,
         cell: (item) => (
            <div className="flex items-center gap-2">
               <span className={`text-lg font-black ${item.quantity <= item.minQuantity ?'text-red-500':'text-gray-700 dark:text-white'}`}>
                  {item.quantity}
               </span>
               <span className="text-[9px] font-bold text-gray-400 uppercase">{item.unit || 'pcs'}</span>
               {item.quantity <= item.minQuantity && (
                  <Tooltip content="Low Stock Warning">
                     <Activity size={14} className="text-red-500 animate-pulse" />
                  </Tooltip>
               )}
            </div>
         )
      },
      {
         header: "Unit Price",
         accessorKey: "unitPrice",
         sortable: true,
         className: "font-black text-blue-600 dark:text-blue-400",
         cell: (item) => `$${item.unitPrice?.toLocaleString()}`
      },
      {
         header: "Actions",
         className: "text-right",
         cell: (item) => (
            <div className="flex justify-end">
               <Dropdown placement="bottom-end"
                  label={
                     <div className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-400 hover:text-blue-600 cursor-pointer">
                        <MoreVertical size={18} />
                     </div>
                  }
                  arrowIcon={false}
                  inline
                  className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl rounded-xl"
               >
                  <DropdownHeader>
                     <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 py-1">Node Actions</span>
                  </DropdownHeader>
                  <DropdownItem onClick={() => setTimeout(() => handleOpenTransaction(item), 0)} className="font-bold text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                     <div className="flex items-center gap-2">
                        <ArrowRightLeft size={14} />
                        <span>Stock Movement</span>
                     </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setTimeout(() => handleOpenDetails(item), 0)} className="font-bold text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                     <div className="flex items-center gap-2">
                        <Eye size={14} />
                        <span>Audit Details</span>
                     </div>
                  </DropdownItem>
                  <DropdownItem onClick={() => setTimeout(() => handleOpenEdit(item), 0)} className="font-bold text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                     <div className="flex items-center gap-2">
                        <Edit3 size={14} />
                        <span>Edit Record</span>
                     </div>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onClick={() => setTimeout(() => onDelete(item.id), 0)} className="font-bold text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                     <div className="flex items-center gap-2">
                        <Trash2 size={14} />
                        <span>Decommission</span>
                     </div>
                  </DropdownItem>
               </Dropdown>
            </div>
         )
      }
   ];

   const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
   const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   // Reset to page 1 on search/filter
   React.useEffect(() => {
      setCurrentPage(1);
   }, [searchQuery, categoryFilter]);

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
         };
         reader.readAsDataURL(file);
      }
   };

   const handleOpenAdd = () => {
      setFormData(defaultFormData);
      setCurrentStep(1);
      setIsEditMode(false);
      setIsModalOpen(true);
   };

   const handleOpenEdit = (item: any) => {
      setFormData({
         name: item.name,
         sku: item.sku || '',
         category: item.category || 'General',
         quantity: item.quantity,
         unit: item.unit || 'pcs',
         minQuantity: item.minQuantity,
         unitPrice: item.unitPrice || 0,
         location: item.location || 'Main Warehouse',
         status: item.status || 'In Stock',
         description: item.description || '',
         imageUrl: item.imageUrl || '',
         vendor: item.vendor || '',
         maxQuantity: item.maxQuantity || 100,
         leadTimeDays: item.leadTimeDays || 7,
         binLocation: item.binLocation || '',
         weight: item.weight || 0,
         dimensions: item.dimensions || '',
         batchNumber: item.batchNumber || '',
         barcode: item.barcode || '',
         expirationDate: item.expirationDate || '',
         isReturnable: item.isReturnable ?? false,
         isKit: item.isKit ?? false,
         isIntangible: item.isIntangible ?? false,
         isSubscription: item.isSubscription ?? false,
         isActive: item.isActive ?? true,
         renewalDate: item.renewalDate || '',
         acquisitionType: item.acquisitionType || 'Purchased',
         donorOrPartnerName: item.donorOrPartnerName || '',
         costCenter: item.costCenter || '',
         usefulLifeYears: item.usefulLifeYears || 0,
         productFamily: item.productFamily || '',
         brand: item.brand || '',
         modelNumber: item.modelNumber || ''
      });
      setEditingId(item.id);
      setCurrentStep(1);
      setIsEditMode(true);
      setIsModalOpen(true);
   };

   const handleOpenDetails = (item: any) => {
      setViewingItem(item);
      setIsDetailsModalOpen(true);
   };

   const handleOpenTransaction = (item: any) => {
      setSelectedItemForTx(item);
      setIsTransactionModalOpen(true);
   };

   const handleSubmit = async () => {
      if (!formData.name || !formData.sku) {
         toast.error("Name and SKU are required");
         return;
      }
      try {
         setIsProcessing(true);
         if (isEditMode && editingId) {
            await onUpdate(editingId, formData);
         } else {
            await onAdd(formData);
         }
         setIsModalOpen(false);
         // Reset form on success
         setFormData(defaultFormData);
      } catch (err) {
         console.error("Stock Operation Hub Error:", err);
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <div className="space-y-8 animate-fade-in pb-12">
         {/* Warehouse Analytics */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-8 rounded-xl dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center border-l-4 border-l-blue-600 bg-white/50 backdrop-blur-xl">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Unique SKUs</p>
               <h4 className="text-4xl font-black dark:text-white text-blue-600">{safeItems.length}</h4>
            </div>
            <div className="p-8 rounded-xl dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center border-l-4 border-l-emerald-500 bg-white/50 backdrop-blur-xl">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Units</p>
               <h4 className="text-4xl font-black dark:text-white text-emerald-600">
                  {safeItems.reduce((sum, item) => sum + (item.quantity || 0), 0)}
               </h4>
            </div>
            <div className="p-8 rounded-xl dark:bg-gray-800 border-none shadow-sm flex flex-col justify-center border-l-4 border-l-amber-500 bg-white/50 backdrop-blur-xl">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Low Stock Alerts</p>
               <h4 className="text-4xl font-black dark:text-white text-amber-500">
                  {safeItems.filter(item => (item.quantity || 0) <= (item.minQuantity || 5)).length}
               </h4>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-indigo-800 to-blue-900 text-white border-none shadow-xl flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-cyan-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Inventory Health</p>
               </div>
               <h4 className="text-2xl font-black">Stable</h4>
               <p className="text-[9px] font-bold mt-1 opacity-60 uppercase tracking-tighter">Nodes Synced with ERP</p>
            </div>
         </div>

         {/* Navigation & Filters */}
         <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
               {viewMode === 'GRID' && (
                 <div className="flex-shrink-0">
                   <select
                     className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-0 focus:border-transparent transition-all duration-200 text-xs h-9 border-none outline-none px-3 min-w-[100px] font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                     value={itemsPerRow}
                     onChange={(e) => setItemsPerRow(e.target.value)}
                   >
                     <option value="3">3 per row</option>
                     <option value="4">4 per row</option>
                     <option value="5">5 per row</option>
                   </select>
                 </div>
               )}
               <div className="relative flex shrink-0 bg-gray-100/80 dark:bg-gray-900/60 p-1 rounded-xl w-24 /50 shadow-inner overflow-hidden h-[34px]">
                  {/* Sliding Pill */}
                  <div
                     className="absolute top-1 bottom-1 left-1 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-out pointer-events-none"
                     style={{
                        width: 'calc(50% - 4px)',
                        transform: `translateX(${viewMode === 'TABLE' ? '0' : '100%'})`
                     }}
                  />
                  <button
                     onClick={() => setViewMode('TABLE')}
                     title="List View"
                     className={`relative z-10 flex-1 py-1 transition-all duration-300 flex items-center justify-center rounded-lg focus:outline-none ${viewMode ==='TABLE'?'text-blue-600 dark:text-blue-400':'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                     <List size={16} className={`transition-transform duration-300 ${viewMode ==='TABLE'?'scale-110':''}`} />
                  </button>
                  <button
                     onClick={() => setViewMode('GRID')}
                     title="Grid View"
                     className={`relative z-10 flex-1 py-1 transition-all duration-300 flex items-center justify-center rounded-lg focus:outline-none ${viewMode ==='GRID'?'text-blue-600 dark:text-blue-400':'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                  >
                     <LayoutGrid size={16} className={`transition-transform duration-300 ${viewMode ==='GRID'?'scale-110':''}`} />
                  </button>
               </div>
            </div>
         </div>

         {loading && safeItems.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center">
               <Spinner size="xl" />
               <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Syncing Warehouse Ledger...</p>
            </div>
         ) : viewMode === 'TABLE' ? (
            <div className="mt-4">
               <DataTable
                  data={paginatedItems}
                  columns={columns}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="Search item name or SKU code..."
                  filters={
                     <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-white dark:bg-[#0d1117] rounded-md text-xs font-bold text-gray-500 shadow-sm h-[42px] border-none focus:ring-1 focus:ring-indigo-500 px-4 min-w-[160px]"
                     >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                  }
                  actions={
                     <Button size="sm" color="blue" onClick={handleOpenAdd} className="h-[42px] rounded-md shadow-sm font-black uppercase text-xs">
                        <Plus size={16} className="mr-2" /> New Item
                     </Button>
                  }
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  emptyMessage="No inventory nodes found in this sector."
               />
            </div>
         ) : (
            <div className={`grid gap-8 ${ itemsPerRow ==="3"?"grid-cols-1 md:grid-cols-2 lg:grid-cols-3": itemsPerRow ==="5"?"grid-cols-1 sm:grid-cols-3 lg:grid-cols-5":"grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
               {paginatedItems.map((item) => (
                  <div key={item.id} className="group relative border-none shadow-sm hover:shadow-2xl hover:z-20 transition-all duration-500 dark:bg-gray-800 rounded-[2rem] bg-white/40 backdrop-blur-2xl border-white/20 p-0 overflow-hidden">
                     <div className="h-32 bg-gradient-to-br from-blue-600/10 to-indigo-600/5 relative overflow-hidden">
                        {item.imageUrl ? (
                           <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                           <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_70%)]"></div>
                        )}
                        <div className="absolute top-6 left-8 p-4 bg-white/90 dark:bg-gray-700/90 backdrop-blur-md rounded-xl shadow-xl shadow-blue-500/10 text-blue-600 transition-transform group-hover:scale-110 duration-500 z-10">
                           <Box size={24} />
                        </div>

                        {/* Dropdown Action Menu */}
                        <div className="absolute top-6 right-6">
                           <Dropdown placement="bottom-end"
                              label={
                                 <div className="p-2 rounded-lg hover:bg-white/20 transition-all text-white/70 hover:text-white cursor-pointer">
                                    <MoreVertical size={18} />
                                 </div>
                              }
                              arrowIcon={false}
                              inline
                              className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-none shadow-2xl rounded-xl"
                           >
                              <DropdownHeader>
                                 <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2 py-1">Node Operations</span>
                              </DropdownHeader>
                              <DropdownItem onClick={() => setTimeout(() => handleOpenTransaction(item), 0)} className="font-bold text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                                 <div className="flex items-center gap-2">
                                    <ArrowRightLeft size={14} />
                                    <span>Movement</span>
                                 </div>
                              </DropdownItem>
                              <DropdownItem onClick={() => setTimeout(() => handleOpenDetails(item), 0)} className="font-bold text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                 <div className="flex items-center gap-2">
                                    <Eye size={14} />
                                    <span>Audit Node</span>
                                 </div>
                              </DropdownItem>
                              <DropdownItem onClick={() => setTimeout(() => handleOpenEdit(item), 0)} className="font-bold text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                                 <div className="flex items-center gap-2">
                                    <Edit3 size={14} />
                                    <span>Edit Record</span>
                                 </div>
                              </DropdownItem>
                              <DropdownDivider />
                              <DropdownItem onClick={() => setTimeout(() => onDelete(item.id), 0)} className="font-bold text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                                 <div className="flex items-center gap-2">
                                    <Trash2 size={14} />
                                    <span>Decommission</span>
                                 </div>
                              </DropdownItem>
                           </Dropdown>
                        </div>
                     </div>

                     <div className="p-8 pt-4">
                        <div className="flex justify-between items-center mb-4">
                           <Badge color={item.quantity <= item.minQuantity ? 'failure' : 'success'} className="rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-[0.2em] shadow-sm">
                              {item.status || 'Active Node'}
                           </Badge>
                           <span className="text-[10px] font-mono font-black text-gray-400 group-hover:text-blue-500 transition-colors">#{item.sku}</span>
                        </div>

                        <h4 className="font-black dark:text-white text-2xl tracking-tighter leading-tight mb-2 group-hover:translate-x-1 transition-transform duration-500 uppercase">{item.name}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <Layers size={10} className="text-blue-500" /> {item.category || 'Standard Node'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 my-8 p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl transition-all group-hover:border-blue-500/30 group-hover:bg-blue-500/5">
                           <div>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Inventory Node</p>
                              <div className="flex items-baseline gap-1">
                                 <p className={`text-3xl font-black ${item.quantity <= item.minQuantity ?'text-rose-500 animate-pulse':'dark:text-white text-gray-900'}`}>
                                    {item.quantity}
                                 </p>
                                 <span className="text-[10px] font-black text-gray-400 uppercase">{item.unit}</span>
                              </div>
                           </div>
                           <div className="border-l pl-4 flex flex-col justify-center">
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Valuation</p>
                              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">${item.unitPrice}</p>
                           </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                           <div className="flex items-center gap-2 text-gray-400 group-hover:text-indigo-500 transition-colors">
                              <MapPin size={14} className="text-rose-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.location || 'Central Warehouse'}</span>
                           </div>
                           {item.quantity <= item.minQuantity && (
                              <div className="flex items-center gap-2 text-rose-500 animate-bounce">
                                 <AlertCircle size={14} />
                                 <span className="text-[8px] font-black uppercase tracking-tighter">Critical Stock</span>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {totalPages > 1 && (
            <div className="mt-8">
               <ModernPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredItems.length}
                  pageSize={itemsPerPage}
                  onPageSizeChange={setItemsPerPage}
               />
            </div>
         )}

         {/* Stock Item Modal */}
         <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
            <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? 'Modify Stock Record' : 'Register New Inventory Node'}
               </h3>
               <button type="button" onClick={() => setIsModalOpen(false)} className="text-red-500 hover:text-red-600 transition-colors bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 p-1.5 rounded-md shadow-sm border-red-500">
                  <X size={16} />
               </button>
            </div>
            <ModalBody className="p-0">
               {/* Stepper UI */}
               <div className="flex items-center justify-between px-8 py-4 bg-gray-50 dark:bg-gray-800/80 rounded-full mx-6 mt-6 mb-2">
                  {[
                     { step: 1, title: 'Item Identity', icon: Box },
                     { step: 2, title: 'Logistics', icon: Package },
                     { step: 3, title: 'Compliance', icon: Upload }
                  ].map((s) => (
                     <div key={s.step} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-colors ${currentStep >= s.step ?'bg-blue-600 text-white shadow-md shadow-blue-500/20':'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                           {s.step}
                        </div>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= s.step ?'text-blue-600 dark:text-blue-400':'text-gray-400'}`}>
                           {s.title}
                        </p>
                     </div>
                  ))}
               </div>

               <div className="space-y-6 p-6">
                  {currentStep === 1 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className="col-span-full">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Item Identity</Label>
                           <TextInput
                              placeholder="Item Name (e.g. A4 Paper Case)"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="rounded-xl shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">SKU / Serial</Label>
                           <TextInput
                              placeholder="SKU-10022"
                              value={formData.sku}
                              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category</Label>
                           <select
                              className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm transition-all"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                           >
                              {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Stock Level</Label>
                           <TextInput
                              type="number"
                              value={formData.quantity}
                              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Unit Price (USD)</Label>
                           <TextInput
                              type="number"
                              value={formData.unitPrice}
                              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                              className="shadow-sm"
                           />
                        </div>
                        <div className="col-span-full">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Visual Reference</Label>
                           <div className="flex items-center gap-5 p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 rounded-xl shadow-inner group">
                              <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
                                 {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                 ) : (
                                    <Box className="text-gray-300 dark:text-gray-600" size={28} />
                                 )}
                              </div>
                              <div className="flex-1 space-y-3">
                                 <p className="text-[10px] font-bold text-gray-400 uppercase">Upload a high-quality photo of the inventory item.</p>
                                 <div className="flex items-center gap-3">
                                    <input
                                       type="file"
                                       id="stock-image-upload"
                                       accept="image/*"
                                       onChange={handleImageChange}
                                       className="hidden"
                                    />
                                    <label htmlFor="stock-image-upload" className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm">
                                       <Upload size={14} className="mr-2" /> Upload Image
                                    </label>
                                    {formData.imageUrl && (
                                       <button
                                          type="button"
                                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                          className="inline-flex items-center px-4 py-2 text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest"
                                       >
                                          <X size={14} className="mr-2" /> Remove
                                       </button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {currentStep === 2 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Vendor / Supplier</Label>
                           <TextInput
                              placeholder="Vendor Name"
                              value={formData.vendor}
                              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Barcode / UPC</Label>
                           <TextInput
                              placeholder="Scan or enter barcode"
                              value={formData.barcode}
                              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Max Stock Limit</Label>
                           <TextInput
                              type="number"
                              value={formData.maxQuantity}
                              onChange={(e) => setFormData({ ...formData, maxQuantity: parseInt(e.target.value) || 0 })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Restock Lead Time (Days)</Label>
                           <TextInput
                              type="number"
                              value={formData.leadTimeDays}
                              onChange={(e) => setFormData({ ...formData, leadTimeDays: parseInt(e.target.value) || 0 })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Bin Location</Label>
                           <TextInput
                              placeholder="e.g. Aisle 4, Rack B2"
                              value={formData.binLocation}
                              onChange={(e) => setFormData({ ...formData, binLocation: e.target.value })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Expiration Date</Label>
                           <DatePicker
                              value={formData.expirationDate ? new Date(formData.expirationDate) : null}
                              onChange={(date) => setFormData({ ...formData, expirationDate: format(date, 'yyyy-MM-dd') })}
                              placeholder="Select expiry date..."
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Cost Center / Department</Label>
                           <TextInput
                              placeholder="e.g. IT Dept"
                              value={formData.costCenter}
                              onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Acquisition Source</Label>
                           <select
                              className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 shadow-sm transition-all"
                              value={formData.acquisitionType}
                              onChange={(e) => setFormData({ ...formData, acquisitionType: e.target.value })}
                           >
                              <option value="Purchased">Purchased</option>
                              <option value="Donated">Donated</option>
                              <option value="Leased">Leased</option>
                           </select>
                        </div>
                        <div className="col-span-full">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Funding Source / Sponsor</Label>
                           <TextInput
                              placeholder="Who paid for this? (e.g. John Doe, Grants Dept)"
                              value={formData.donorOrPartnerName}
                              onChange={(e) => setFormData({ ...formData, donorOrPartnerName: e.target.value })}
                              className="shadow-sm"
                           />
                        </div>
                     </div>
                  )}

                  {currentStep === 3 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Product Family</Label>
                           <TextInput
                              placeholder="e.g. End-User Computing"
                              value={formData.productFamily}
                              onChange={(e) => setFormData({ ...formData, productFamily: e.target.value })}
                              className="shadow-sm"
                           />
                        </div>
                        <div>
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Brand & Model</Label>
                           <div className="flex gap-2">
                              <TextInput
                                 placeholder="Brand"
                                 value={formData.brand}
                                 onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                 className="flex-1 shadow-sm"
                              />
                              <TextInput
                                 placeholder="Model Number"
                                 value={formData.modelNumber}
                                 onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                                 className="flex-1 shadow-sm"
                              />
                           </div>
                        </div>

                        <div className="col-span-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Asset Flags</Label>
                           <div className="grid grid-cols-2 gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" checked={formData.isReturnable} onChange={(e) => setFormData({ ...formData, isReturnable: e.target.checked })} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700" />
                                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Requires Return (Offboarding)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" checked={formData.isIntangible} onChange={(e) => setFormData({ ...formData, isIntangible: e.target.checked })} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700" />
                                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Intangible (Software/License)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" checked={formData.isKit} onChange={(e) => setFormData({ ...formData, isKit: e.target.checked })} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700" />
                                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Kit / Bundle (e.g. Onboarding Kit)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700" />
                                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Active Status</span>
                              </label>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </ModalBody>
            <ModalFooter className="flex justify-between border-t bg-gray-50 dark:bg-gray-800/80 p-5 rounded-b-md">
               <Button outline size="sm" color="light" onClick={() => setIsModalOpen(false)} className="font-black uppercase text-[10px] tracking-widest shadow-sm">
                  Discard
               </Button>
               <div className="flex gap-3">
                  {currentStep > 1 && (
                     <Button outline size="sm" color="light" onClick={() => setCurrentStep(currentStep - 1)} className="font-black uppercase text-[10px] tracking-widest shadow-sm">
                        Back
                     </Button>
                  )}
                  {currentStep < 3 ? (
                     <Button outline size="sm" color="blue" onClick={() => setCurrentStep(currentStep + 1)} className="font-black uppercase text-[10px] tracking-widest shadow-md">
                        Next
                     </Button>
                  ) : (
                     <Button outline size="sm" color="blue" onClick={handleSubmit} disabled={isProcessing} className="font-black uppercase text-[10px] tracking-widest shadow-sm">
                        {isProcessing ? 'Saving...' : (isEditMode ? 'Modify Record' : 'Register Node')}
                     </Button>
                  )}
               </div>
            </ModalFooter>
         </Modal>

         {/* Stock Details Modal */}
         <Modal show={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} size="lg">
            <div className="flex justify-between items-center p-5 border-b rounded-t-md bg-white dark:bg-gray-800">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Stock Item Inspector</h3>
               <button type="button" onClick={() => setIsDetailsModalOpen(false)} className="text-red-500 hover:text-red-600 transition-colors bg-white hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20 p-1.5 rounded-md shadow-sm border-red-500">
                  <X size={16} />
               </button>
            </div>
            <ModalBody>
               {viewingItem && (
                  <div className="space-y-8">
                     <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-700/50 flex items-center justify-center text-gray-400 shadow-xl overflow-hidden shrink-0">
                           {viewingItem.imageUrl ? (
                              <img src={viewingItem.imageUrl} alt={viewingItem.name} className="w-full h-full object-cover" />
                           ) : (
                              <Package size={32} className="text-blue-600" />
                           )}
                        </div>
                        <div>
                           <Badge color={viewingItem.quantity <= viewingItem.minQuantity ? 'failure' : 'success'} className="mb-2 px-4">
                              {viewingItem.status || 'Active'}
                           </Badge>
                           <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight leading-none">{viewingItem.name}</h3>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 font-mono">SKU-NODE: {viewingItem.sku}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center">
                           <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Stock Level</p>
                           <p className={`font-black text-lg ${viewingItem.quantity <= viewingItem.minQuantity ?'text-red-500':'dark:text-white'}`}>
                              {viewingItem.quantity} {viewingItem.unit}
                           </p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center">
                           <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Unit Value</p>
                           <p className="font-black text-lg text-blue-600 dark:text-blue-400">${viewingItem.unitPrice}</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center">
                           <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Category</p>
                           <p className="font-black text-[10px] dark:text-white uppercase mt-1">{viewingItem.category || 'General'}</p>
                        </div>
                     </div>

                     <div className="p-6 bg-white dark:bg-gray-800 rounded-xl space-y-4">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                           <MapPin size={12} className="text-blue-500" /> Logistics Context
                        </h5>
                        <div className="grid grid-cols-2 gap-8">
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Primary Node Location</p>
                              <p className="font-black text-sm dark:text-white uppercase">{viewingItem.location || 'Central Warehouse'}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Safety Threshold (Min)</p>
                              <p className="font-black text-sm dark:text-white">{viewingItem.minQuantity} {viewingItem.unit}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Bin Location</p>
                              <p className="font-black text-sm dark:text-white uppercase">{viewingItem.binLocation || 'Not Assigned'}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Max Capacity</p>
                              <p className="font-black text-sm dark:text-white">{viewingItem.maxQuantity || 'Unlimited'} {viewingItem.unit}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Vendor Supply</p>
                              <p className="font-black text-sm dark:text-white uppercase">{viewingItem.vendor || 'Unknown Vendor'}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-tighter">Restock Lead Time</p>
                              <p className="font-black text-sm dark:text-white">{viewingItem.leadTimeDays || 'N/A'} Days</p>
                           </div>
                           {viewingItem.barcode && (
                              <div className="col-span-2 mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
                                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Scanned Barcode ID</p>
                                 <p className="font-mono font-black text-gray-800 dark:text-gray-200 tracking-wider text-sm">{viewingItem.barcode}</p>
                              </div>
                           )}
                           {viewingItem.expirationDate && (
                              <div className="col-span-2 mt-2 p-3 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 rounded-lg">
                                 <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Expiration Warning</p>
                                 <p className="font-black text-rose-600 dark:text-rose-400">{viewingItem.expirationDate}</p>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                           <LayoutGrid size={12} className="text-purple-500" /> HR & Internal Controls
                        </h5>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Product Family</p>
                              <p className="font-black text-sm dark:text-white uppercase">{viewingItem.productFamily || 'N/A'}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Brand & Model</p>
                              <p className="font-black text-sm dark:text-white uppercase">{viewingItem.brand || 'Unknown'} {viewingItem.modelNumber || ''}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Acquisition Source</p>
                              <div className="flex flex-col gap-1">
                                 <p className="font-black text-sm dark:text-white uppercase">{viewingItem.acquisitionType || 'Purchased'}</p>
                                 {viewingItem.acquisitionType !== 'Purchased' && viewingItem.donorOrPartnerName && (
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">From: {viewingItem.donorOrPartnerName}</p>
                                 )}
                              </div>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Cost Center</p>
                              <p className="font-black text-sm dark:text-white uppercase">{viewingItem.costCenter || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                           {viewingItem.isReturnable && <Badge color="indigo">Requires Return</Badge>}
                           {!viewingItem.isReturnable && <Badge color="gray">No Return Required</Badge>}
                           {viewingItem.isKit && <Badge color="warning">Onboarding Kit</Badge>}
                           {viewingItem.isIntangible && <Badge color="purple">Intangible / Digital</Badge>}
                           {viewingItem.isActive ? <Badge color="success">Active in Catalog</Badge> : <Badge color="failure">Archived</Badge>}
                        </div>
                     </div>

                     {viewingItem.description && (
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/20 rounded-xl">
                           <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Item Narrative</p>
                           <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-bold">
                              {viewingItem.description}
                           </p>
                        </div>
                     )}
                  </div>
               )}
            </ModalBody>
            <ModalFooter>
               <Button outline size="sm" color="blue" onClick={() => setIsDetailsModalOpen(false)} className="w-full font-black uppercase text-[10px] tracking-widest">
                  Close Item Inspector
               </Button>
            </ModalFooter>
         </Modal>

         <StockTransactionModal
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
            item={selectedItemForTx}
            onSuccess={() => {
               onRefresh?.();
            }}
         />
      </div>
   );
};

export default WarehouseModule;

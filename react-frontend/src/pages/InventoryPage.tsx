import { useState, useEffect } from 'react'
import { Card, Button, Spinner, Pagination } from 'flowbite-react'
import { Package, Plus, Activity } from 'lucide-react'
import Layout from '../components/Layout'
import api from '../services/api'
import toast from 'react-hot-toast'
import ConfirmModal from '../components/ConfirmModal'

// Modular Components
import InventorySummary from '../components/inventory/InventorySummary'
import InventoryFilters from '../components/inventory/InventoryFilters'
import InventoryTable from '../components/inventory/InventoryTable'
import InventoryItemModal from '../components/inventory/InventoryItemModal'

const InventoryPage = ({ isDark, setIsDark }: any) => {
   const [items, setItems] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [search, setSearch] = useState('');
   const [categoryFilter, setCategoryFilter] = useState('');
   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
   const [itemToDelete, setItemToDelete] = useState<number | null>(null);
   
   const [formData, setFormData] = useState({
      name: '',
      sku: '',
      category: 'Office Supplies',
      quantity: 0,
      unit: 'pcs',
      minQuantity: 5,
      unitPrice: 0,
      location: 'Warehouse',
      status: 'In Stock',
      description: '',
      imageUrl: ''
   });

   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const PAGE_SIZE = 12;
   
   useEffect(() => {
      fetchInventory(currentPage - 1, PAGE_SIZE, search, categoryFilter);
   }, [currentPage, search, categoryFilter]);

   const fetchInventory = async (page = 0, size = 12, searchTerms = '', category = '') => {
      try {
         setLoading(true);
         const response = await api.get(`/inventory?page=${page}&size=${size}&search=${searchTerms}&category=${category}`);
         const data = response.data;
         setItems(data.content || (Array.isArray(data) ? data : []));
         setTotalPages(data.totalPages || 1);
      } catch (err) {
         toast.error("Failed to load inventory data");
      } finally {
         setLoading(false);
      }
   };

   const handleEdit = (item: any) => {
      setFormData({
         name: item.name,
         sku: item.sku || '',
         category: item.category || 'Office Supplies',
         quantity: item.quantity,
         unit: item.unit || 'pcs',
         minQuantity: item.minQuantity,
         unitPrice: item.unitPrice || 0,
         location: item.location || 'Warehouse',
         status: item.status || 'In Stock',
         description: item.description || '',
         imageUrl: item.imageUrl || ''
      });
      setEditingId(item.id);
      setIsEditMode(true);
      setIsModalOpen(true);
   };

   const handleDelete = (id: number) => {
      setItemToDelete(id);
      setIsConfirmOpen(true);
   };

   const confirmDelete = async () => {
      if (!itemToDelete) return;
      try {
         await api.delete(`/inventory/${itemToDelete}`);
         toast.success("Item removed from inventory");
         fetchInventory();
      } catch (err) {
         toast.error("Failed to delete item");
      } finally {
         setIsConfirmOpen(false);
         setItemToDelete(null);
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         setLoading(true);
         if (isEditMode && editingId) {
            await api.put(`/inventory/${editingId}`, formData);
            toast.success("Item updated");
         } else {
            await api.post('/inventory', formData);
            toast.success("New item added to inventory");
         }
         setIsModalOpen(false);
         setIsEditMode(false);
         setEditingId(null);
         fetchInventory();
         resetForm();
      } catch (err) {
         toast.error("Operation failed");
      } finally {
         setLoading(false);
      }
   };

   const resetForm = () => {
      setFormData({
         name: '',
         sku: '',
         category: 'Office Supplies',
         quantity: 0,
         unit: 'pcs',
         minQuantity: 5,
         unitPrice: 0,
         location: 'Warehouse',
         status: 'In Stock',
         description: '',
         imageUrl: ''
      });
   };


   return (
      <Layout isDark={isDark} setIsDark={setIsDark} title="Inventory & Stock">
         <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto pb-12">
            <header className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-gray-700/50">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-600 text-white rounded-lg shadow-xl shadow-blue-500/20">
                     <Package size={32} />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black dark:text-white tracking-tight">Stock Management</h2>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Tracking {items.length} unique nodes across 4 locations
                     </p>
                  </div>
               </div>
               <Button color="blue" onClick={() => { setIsEditMode(false); setEditingId(null); resetForm(); setIsModalOpen(true); }} className="rounded-lg px-8 h-14 bg-blue-600 hover:bg-blue-700 border-none shadow-xl shadow-blue-500/30 transition-all active:scale-95 font-black uppercase tracking-widest text-[10px]">
                  <Plus size={20} className="mr-2" /> Add New Item
               </Button>
            </header>

            <InventorySummary items={items} />

            <Card className="border-none shadow-sm dark:bg-gray-800 overflow-hidden rounded-lg">
               <InventoryFilters 
                  search={search} 
                  setSearch={setSearch} 
                  categoryFilter={categoryFilter} 
                  setCategoryFilter={setCategoryFilter} 
               />

               {loading && items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-gray-500 dark:text-gray-400">
                     <Spinner size="xl" />
                     <p className="mt-6 font-black animate-pulse text-[10px] uppercase tracking-[0.2em]">Syncing Stock Levels...</p>
                  </div>
               ) : (
                  <InventoryTable 
                     items={items} 
                     handleEdit={handleEdit} 
                     handleDelete={handleDelete} 
                  />
               )}

               <div className="px-10 py-8 bg-gray-50/50 dark:bg-gray-800/50 border-t dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                     <Activity size={18} className="text-blue-500" />
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Stock Visibility: {items.length} Nodes on Page {currentPage}/{totalPages}</p>
                  </div>
                  <div className="flex items-center gap-6">
                     {totalPages > 1 && (
                        <Pagination 
                           currentPage={currentPage} 
                           totalPages={totalPages} 
                           onPageChange={setCurrentPage} 
                           showIcons 
                           className="pagination-premium"
                        />
                     )}
                     <div className="flex gap-3">
                        <Button color="light" size="xs" className="rounded-lg px-5 font-black uppercase text-[9px]">Export CSV</Button>
                        <Button color="light" size="xs" className="rounded-lg px-5 font-black uppercase text-[9px]">Stock Audit</Button>
                     </div>
                  </div>
               </div>
            </Card>
         </div>

         <InventoryItemModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            isEditMode={isEditMode}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
         />

         <ConfirmModal
            show={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={confirmDelete}
            message="Are you sure you want to delete this item? This will remove it from the stock records forever."
         />
      </Layout>
   );
};

export default InventoryPage;

import React, { useState } from 'react';
import { Modal, Spinner } from '@/lib/flowbite-compat';
import { X, Camera, Image as ImageIcon, Plus } from 'lucide-react';
import { posService, PosProductDto } from '../../../services/posService';
import { uploadToCloudinary } from '@/utils/cloudinary';
import ImageCropperModal from "@/components/common/ImageCropperModal";
import { toast } from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit: PosProductDto | null;
    onSaved: () => void;
    existingCategories?: string[];
    existingBrands?: string[];
}

export default function ProductFormModal({ isOpen, onClose, productToEdit, onSaved, existingCategories: fallbackCategories = [], existingBrands: fallbackBrands = [] }: ProductFormModalProps) {
    const [formData, setFormData] = useState<Partial<PosProductDto>>({
        name: '',
        sku: '',
        category: 'General',
        price: 0,
        stockQuantity: 0,
        description: '',
        imageUrl: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [cropTarget, setCropTarget] = useState<'product' | 'brand'>('product');

    // Custom Add Item state
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [addItemType, setAddItemType] = useState<'category' | 'brand'>('category');
    const [newItemData, setNewItemData] = useState({ name: '', description: '', colorCode: '#3b82f6', logoUrl: '' });
    const [isSavingItem, setIsSavingItem] = useState(false);

    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            loadCategoriesAndBrands();
        }
    }, [isOpen]);

    const loadCategoriesAndBrands = async () => {
        try {
            const [cats, brnds] = await Promise.all([
                posService.getAllCategories(),
                posService.getAllBrands()
            ]);
            setCategories(Array.from(new Set([...fallbackCategories, ...cats.map(c => c.name)])));
            setBrands(Array.from(new Set([...fallbackBrands, ...brnds.map(b => b.name)])));
        } catch (error) {
            console.error("Failed to load categories/brands", error);
            setCategories(fallbackCategories);
            setBrands(fallbackBrands);
        }
    };

    React.useEffect(() => {
        if (productToEdit) {
            setFormData(productToEdit);
        } else {
            setFormData({
                name: '',
                sku: '',
                category: 'General',
                price: 0,
                stockQuantity: 0,
                description: '',
                imageUrl: ''
            });
        }
    }, [productToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (productToEdit && productToEdit.id) {
                await posService.updateProduct(productToEdit.id, formData as PosProductDto);
            } else {
                await posService.createProduct(formData as PosProductDto);
            }
            onSaved();
            onClose();
        } catch (error) {
            console.error("Failed to save product", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'brand' = 'product') => {
        const file = e.target.files?.[0];
        if (file) {
            setCropTarget(target);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCropImageSrc(reader.result as string);
                setIsCropModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} size="md">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                        {productToEdit ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-inner border border-gray-200 dark:border-gray-600">
                                {formData.imageUrl ? (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">No Image</span>
                                    </div>
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                        <Spinner size="lg" color="info" />
                                        <span className="text-xs font-bold mt-2">Uploading...</span>
                                    </div>
                                )}
                            </div>
                            <label className="absolute -bottom-3 -right-3 p-3 bg-blue-600 text-white rounded-full cursor-pointer shadow-xl hover:bg-blue-700 hover:scale-110 transition-all border-4 border-white dark:border-gray-800">
                                <Camera size={18} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'product')}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>

                    <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                                <input 
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                                <input 
                                    required
                                    type="text"
                                    value={formData.sku}
                                    onChange={e => setFormData({...formData, sku: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Barcode</label>
                                <input 
                                    type="text"
                                    value={formData.barcode || ''}
                                    onChange={e => setFormData({...formData, barcode: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Category</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddItemType('category');
                                            setNewItemData({ name: '', description: '', colorCode: '#3b82f6', logoUrl: '' });
                                            setIsAddItemModalOpen(true);
                                        }}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full transition-colors"
                                    >
                                        <Plus size={12} /> Add New
                                    </button>
                                </div>
                                <CreatableSelect
                                    isClearable
                                    options={categories.map(c => ({ value: c, label: c }))}
                                    value={formData.category ? { value: formData.category, label: formData.category } : null}
                                    onChange={(selected) => setFormData({...formData, category: selected ? selected.value : ''})}
                                    placeholder="Select or create..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '42px',
                                            borderRadius: '0.5rem',
                                            borderColor: '#d1d5db',
                                            boxShadow: 'none',
                                            '&:hover': { borderColor: '#3b82f6' }
                                        })
                                    }}
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Brand</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddItemType('brand');
                                            setNewItemData({ name: '', description: '', colorCode: '#3b82f6', logoUrl: '' });
                                            setIsAddItemModalOpen(true);
                                        }}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full transition-colors"
                                    >
                                        <Plus size={12} /> Add New
                                    </button>
                                </div>
                                <CreatableSelect
                                    isClearable
                                    options={brands.map(b => ({ value: b, label: b }))}
                                    value={formData.brand ? { value: formData.brand, label: formData.brand } : null}
                                    onChange={(selected) => setFormData({...formData, brand: selected ? selected.value : ''})}
                                    placeholder="Select or create..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '42px',
                                            borderRadius: '0.5rem',
                                            borderColor: '#d1d5db',
                                            boxShadow: 'none',
                                            '&:hover': { borderColor: '#3b82f6' }
                                        })
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                                <input 
                                    required
                                    type="number"
                                    step="0.01"
                                    value={formData.price ?? ''}
                                    onChange={e => setFormData({...formData, price: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Cost Price ($)</label>
                                <input 
                                    type="number"
                                    step="0.01"
                                    value={formData.costPrice ?? ''}
                                    onChange={e => setFormData({...formData, costPrice: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                                <input 
                                    required
                                    type="number"
                                    value={formData.stockQuantity ?? ''}
                                    onChange={e => setFormData({...formData, stockQuantity: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Unit</label>
                                <input 
                                    type="text"
                                    value={formData.unit || ''}
                                    onChange={e => setFormData({...formData, unit: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tax Rate (%)</label>
                                <input 
                                    type="number"
                                    step="0.01"
                                    value={formData.taxRate ?? ''}
                                    onChange={e => setFormData({...formData, taxRate: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select
                                    value={formData.status || 'ACTIVE'}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="OUT_OF_STOCK">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 shrink-0">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="productForm"
                        disabled={isLoading || isUploading}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
            </div>

            {/* Add Item Modal */}
            <Modal show={isAddItemModalOpen} onClose={() => !isSavingItem && setIsAddItemModalOpen(false)} size="md">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Plus size={20} className="text-blue-600"/> Add New {addItemType === 'category' ? 'Category' : 'Brand'}
                        </h3>
                        <button onClick={() => !isSavingItem && setIsAddItemModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input
                                type="text"
                                value={newItemData.name}
                                onChange={(e) => setNewItemData({...newItemData, name: e.target.value})}
                                placeholder={`Enter ${addItemType} name...`}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                                value={newItemData.description}
                                onChange={(e) => setNewItemData({...newItemData, description: e.target.value})}
                                placeholder="Short description..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                rows={2}
                            />
                        </div>

                        {addItemType === 'category' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Color Code</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={newItemData.colorCode}
                                        onChange={(e) => setNewItemData({...newItemData, colorCode: e.target.value})}
                                        className="h-10 w-20 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                                    />
                                    <span className="text-gray-600 dark:text-gray-400 font-mono text-sm">{newItemData.colorCode}</span>
                                </div>
                            </div>
                        )}

                        {addItemType === 'brand' && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Logo URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newItemData.logoUrl}
                                        onChange={(e) => setNewItemData({...newItemData, logoUrl: e.target.value})}
                                        placeholder="Paste image URL or upload..."
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors cursor-pointer flex items-center justify-center">
                                        <Camera size={20} />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'brand')}
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                            <button disabled={isSavingItem} onClick={() => setIsAddItemModalOpen(false)} className="px-4 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors">
                                Cancel
                            </button>
                            <button
                                disabled={isSavingItem || !newItemData.name.trim()}
                                onClick={async () => {
                                    const name = newItemData.name.trim();
                                    if (name) {
                                        setIsSavingItem(true);
                                        try {
                                            if (addItemType === 'category') {
                                                await posService.createCategory({ name, description: newItemData.description, colorCode: newItemData.colorCode });
                                                setCategories(prev => [...prev, name]);
                                                setFormData({ ...formData, category: name });
                                                toast.success("Category created successfully");
                                            } else {
                                                await posService.createBrand({ name, description: newItemData.description, logoUrl: newItemData.logoUrl });
                                                setBrands(prev => [...prev, name]);
                                                setFormData({ ...formData, brand: name });
                                                toast.success("Brand created successfully");
                                            }
                                            setIsAddItemModalOpen(false);
                                        } catch(e) {
                                            toast.error("Failed to save " + addItemType);
                                        } finally {
                                            setIsSavingItem(false);
                                        }
                                    }
                                }}
                                className="px-6 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition-all flex items-center justify-center min-w-[100px] disabled:opacity-50"
                            >
                                {isSavingItem ? <Spinner size="sm" /> : 'Save Item'}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {cropImageSrc && (
                <ImageCropperModal
                    isOpen={isCropModalOpen}
                    onClose={() => {
                        setIsCropModalOpen(false);
                        setCropImageSrc(null);
                    }}
                    imageSrc={cropImageSrc}
                    onCropComplete={async (croppedFile: File) => {
                        try {
                            setIsUploading(true);
                            const url = await uploadToCloudinary(croppedFile);
                            if (cropTarget === 'brand') {
                                setNewItemData(prev => ({ ...prev, logoUrl: url }));
                            } else {
                                setFormData(prev => ({ ...prev, imageUrl: url }));
                            }
                        } catch (err) {
                            toast.error("Failed to upload image");
                        } finally {
                            setIsUploading(false);
                        }
                    }}
                    aspectRatio={1}
                />
            )}
        </Modal>
    );
}

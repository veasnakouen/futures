import React, { useState, useEffect } from 'react';
import { posService, PosProductDto } from '../../../services/posService';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import ProductFormModal from './ProductFormModal';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function ProductList() {
    const [products, setProducts] = useState<PosProductDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<PosProductDto | null>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await posService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
        }
    };

    const handleOpenModal = (product?: PosProductDto) => {
        setSelectedProduct(product || null);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setProductToDelete(id);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await posService.deleteProduct(productToDelete);
            toast.success("Product deleted successfully");
            loadProducts();
        } catch (error) {
            console.error("Failed to delete product", error);
            toast.error("Failed to delete product");
        } finally {
            setProductToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="text-blue-600" /> POS Products
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your point of sale inventory and pricing.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="p-4">Product Name</th>
                                <th className="p-4">SKU / Barcode</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 font-semibold text-gray-900 dark:text-white">
                                        <div className="flex items-center gap-3">
                                            {product.imageUrl && (
                                                <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded object-cover border border-gray-200 dark:border-gray-700" />
                                            )}
                                            <div>
                                                <div>{product.name}</div>
                                                {product.brand && <div className="text-xs text-gray-500">{product.brand}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        <div>{product.sku}</div>
                                        {product.barcode && <div className="text-xs">{product.barcode}</div>}
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-gray-900 dark:text-white">${product.price?.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stockQuantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stockQuantity} {product.unit || 'in stock'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${product.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : product.status === 'OUT_OF_STOCK' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {product.status || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No products found. Add one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productToEdit={selectedProduct}
                onSaved={loadProducts}
                existingCategories={Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]}
                existingBrands={Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[]}
            />

            <ConfirmModal 
                isOpen={productToDelete !== null}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete Product"
                type="danger"
            />
        </div>
    );
}

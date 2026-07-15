import React, { useState, useEffect } from 'react';
import { posService, PosProductDto } from '../../../services/posService';
import { ShoppingCart, Plus, Minus, CreditCard, Search } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { toast } from 'react-hot-toast';
import SearchInput from "@/components/common/SearchInput";
import CheckoutModal from '../components/CheckoutModal';

export default function PosDashboard() {
    const [products, setProducts] = useState<PosProductDto[]>([]);
    const [cart, setCart] = useState<{ product: PosProductDto, quantity: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await posService.getAllProducts();
            setProducts(data);
        } catch (error: any) {
            toast.error(`Failed to load products: ${error.message || "Unknown error"}`);
        }
    };

    const addToCart = (product: PosProductDto) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === productId);
            if (existing && existing.quantity > 1) {
                return prev.map(item => item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
            }
            return prev.filter(item => item.product.id !== productId);
        });
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setIsCheckoutModalOpen(true);
    };

    const processCheckout = async (paymentMethod: 'CASH' | 'QR_CODE') => {
        try {
            const saleItems = cart.map(item => ({
                id: '',
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                unitPrice: item.product.price,
                subtotal: item.product.price * item.quantity,
                discount: 0
            }));

            await posService.createSale({
                id: '',
                cashierId: (user as any)?.id || 'Unknown',
                paymentMethod: paymentMethod,
                totalAmount: total,
                receiptNumber: 'REC-' + Date.now(),
                transactionDate: new Date().toISOString(),
                items: saleItems
            });
            toast.success(`Checkout Successful via ${paymentMethod === 'QR_CODE' ? 'KHQR' : 'Cash'}!`);
            setCart([]);
        } catch (error: any) {
            console.error("Checkout failed", error);
            toast.error(error.response?.data?.message || "Checkout Failed");
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Products Section */}
            <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-hidden">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">POS Terminal</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Select items to add to the cart</p>
                    </div>
                    <SearchInput
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col"
                            >
                                <div className="h-40 bg-slate-100 dark:bg-slate-700 relative flex items-center justify-center text-4xl shrink-0 overflow-hidden">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <span className="opacity-30">🛒</span>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight line-clamp-2 mb-1">{product.name}</h3>
                                    <p className="text-xs font-medium text-slate-400 mb-3 truncate">{product.category}</p>
                                    <div className="mt-auto text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                        ${product.price.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-96 backdrop-blur-2xl bg-white/80 dark:bg-slate-900/80 border-l border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-2xl relative z-10">
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                        <ShoppingCart size={20} className="text-blue-600" /> Current Order
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart size={32} className="opacity-50" />
                            </div>
                            <p className="font-medium text-sm">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cart.map(item => (
                                <div key={item.product.id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                                    <div className="flex-1 pr-3">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-0.5 line-clamp-1">{item.product.name}</h4>
                                        <p className="text-xs font-medium text-slate-400">${item.product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-1">
                                        <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 rounded-md bg-white dark:bg-slate-700 text-slate-500 shadow-sm hover:text-red-500 transition-colors active:scale-95">
                                            <Minus size={12} strokeWidth={3} />
                                        </button>
                                        <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => addToCart(item.product)} className="p-1.5 rounded-md bg-white dark:bg-slate-700 text-slate-500 shadow-sm hover:text-blue-600 transition-colors active:scale-95">
                                            <Plus size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                    <div className="w-16 text-right font-black text-slate-900 dark:text-white">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                            <span>Subtotal</span>
                            <span className="text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400">
                            <span>Tax (10%)</span>
                            <span className="text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black text-slate-900 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-700/50">
                            <span>Total</span>
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:dark:from-slate-700 disabled:dark:to-slate-800 disabled:cursor-not-allowed disabled:text-slate-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-blue-500/25 active:scale-[0.98]"
                    >
                        <CreditCard size={20} /> Checkout
                    </button>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                totalAmount={total}
                onConfirm={processCheckout}
            />
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { posService, PosProductDto } from '../../../services/posService';
import { ShoppingCart, Plus, Minus, CreditCard, Search } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function PosDashboard() {
    const [products, setProducts] = useState<PosProductDto[]>([]);
    const [cart, setCart] = useState<{ product: PosProductDto, quantity: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuthStore();

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

    const handleCheckout = async () => {
        if (cart.length === 0) return;
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
                paymentMethod: 'CASH',
                totalAmount: total,
                receiptNumber: 'REC-' + Date.now(),
                transactionDate: new Date().toISOString(),
                items: saleItems
            });
            alert("Checkout Successful!");
            setCart([]);
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Checkout Failed");
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Products Section */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">POS Terminal</h1>
                        <p className="text-sm text-gray-500">Select items to add to the cart</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 w-64"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <div 
                                key={product.id} 
                                onClick={() => addToCart(product)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow active:scale-95"
                            >
                                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 overflow-hidden flex items-center justify-center text-4xl">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        "🛒"
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white truncate">{product.name}</h3>
                                <p className="text-sm text-gray-500 truncate">{product.category}</p>
                                <div className="mt-2 text-lg font-black text-blue-600 dark:text-blue-400">
                                    ${product.price.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <ShoppingCart size={20} /> Current Order
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <ShoppingCart size={48} className="mb-4 opacity-50" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.product.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.product.name}</h4>
                                        <p className="text-xs text-gray-500">${item.product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => removeFromCart(item.product.id)} className="p-1 rounded bg-white dark:bg-gray-600 text-gray-500 shadow-sm hover:text-red-500">
                                            <Minus size={14} />
                                        </button>
                                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => addToCart(item.product)} className="p-1 rounded bg-white dark:bg-gray-600 text-gray-500 shadow-sm hover:text-blue-500">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <div className="w-16 text-right font-bold text-gray-900 dark:text-white">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        <CreditCard size={20} /> Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

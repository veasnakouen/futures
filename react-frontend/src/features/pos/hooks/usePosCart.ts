import { useState } from 'react';
import { PosProductDto } from '../../../services/posService';

export interface CartItem {
    product: PosProductDto;
    quantity: number;
}

export function usePosCart(initialTaxRate = 0.10) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [taxRate, setTaxRate] = useState<number>(initialTaxRate);
    const [orderDiscount, setOrderDiscount] = useState<number>(0);

    const addToCart = (product: PosProductDto) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product.id === productId) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean) as CartItem[];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        setOrderDiscount(0);
    };

    // Calculation Math
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const taxableSubtotal = Math.max(0, subtotal - orderDiscount);
    const taxAmount = taxableSubtotal * taxRate;
    const finalTotal = taxableSubtotal + taxAmount;
    const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        taxRate,
        setTaxRate,
        orderDiscount,
        setOrderDiscount,
        subtotal,
        taxAmount,
        finalTotal,
        totalItemCount,
    };
}

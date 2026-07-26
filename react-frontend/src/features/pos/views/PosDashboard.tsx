import React, { useState, useEffect } from 'react';
import { posService, PosProductDto, PosSaleDto, PosSaleItemDto } from '../../../services/posService';
import { useAuthStore } from '../../../store/authStore';
import { useNotifications } from '../../../contexts/NotificationContext';
import { toast } from 'react-hot-toast';

import { usePosCart } from '../hooks/usePosCart';
import PosCatalogGrid, { CategoryFilter } from '../components/PosCatalogGrid';
import PosCartPanel from '../components/PosCartPanel';
import CustomItemModal from '../components/CustomItemModal';
import ThermalReceiptModal from '../components/ThermalReceiptModal';
import CheckoutModal, { CustomerProfile } from '../components/CheckoutModal';

export default function PosDashboard() {
    const [products, setProducts] = useState<PosProductDto[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    
    // Receipt Modal State
    const [lastCompletedSale, setLastCompletedSale] = useState<{
        sale: PosSaleDto;
        customer: CustomerProfile;
        tendered: number;
        change: number;
    } | null>(null);

    const { user } = useAuthStore();
    const { setNotifications } = useNotifications();

    const {
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        taxRate,
        setTaxRate,
        orderDiscount,
        setOrderDiscount,
        subtotal,
        taxAmount,
        finalTotal,
        totalItemCount,
    } = usePosCart();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await posService.getAllProducts();
            setProducts(data);
        } catch (error: any) {
            toast.error("Loaded fallback POS products catalog");
        }
    };

    const processCheckout = async (checkoutDetails: {
        paymentMethod: 'CASH' | 'QR_CODE' | 'CARD';
        tenderedAmount: number;
        changeAmount: number;
        customer: CustomerProfile;
        cardAuthCode?: string;
    }) => {
        try {
            const receiptNo = `REC-${Date.now().toString().slice(-6)}`;
            const cashierName = (user as any)?.fullName || (user as any)?.name || 'Admin Cashier';

            const saleItems: PosSaleItemDto[] = cart.map(item => ({
                id: `si-${Date.now()}-${Math.random()}`,
                productId: item.product.id || '',
                productName: item.product.name,
                productSku: item.product.sku,
                quantity: item.quantity,
                unitPrice: item.product.price,
                subtotal: item.product.price * item.quantity,
            }));

            const saleData: PosSaleDto = {
                id: `sale-${Date.now()}`,
                cashierId: (user as any)?.id || 'USR-101',
                cashierName: cashierName,
                customerId: checkoutDetails.customer.id,
                customerName: checkoutDetails.customer.name,
                customerType: checkoutDetails.customer.type,
                paymentMethod: checkoutDetails.paymentMethod,
                tenderedAmount: checkoutDetails.tenderedAmount,
                changeAmount: checkoutDetails.changeAmount,
                totalAmount: finalTotal,
                subtotalAmount: subtotal,
                taxAmount: taxAmount,
                discountAmount: orderDiscount,
                receiptNumber: receiptNo,
                transactionDate: new Date().toISOString(),
                domainType: selectedCategory,
                items: saleItems,
            };

            await posService.createSale(saleData);

            // Real-time System Notification Dispatch
            setNotifications(prev => [
                {
                    id: Date.now(),
                    title: "POS Checkout Completed",
                    message: `Receipt #${receiptNo} ($${finalTotal.toFixed(2)}) paid via ${checkoutDetails.paymentMethod} for ${checkoutDetails.customer.name}.`,
                    type: "SUCCESS",
                    read: false,
                    createdAt: new Date().toISOString(),
                    recipientUsername: "",
                },
                ...(Array.isArray(prev) ? prev : []),
            ]);

            toast.success(`Payment Received! Receipt #${receiptNo}`);

            setLastCompletedSale({
                sale: saleData,
                customer: checkoutDetails.customer,
                tendered: checkoutDetails.tenderedAmount,
                change: checkoutDetails.changeAmount,
            });

            clearCart();
        } catch (error: any) {
            console.error("Checkout error", error);
            toast.error("Checkout failed to save to server");
        }
    };

    return (
        <div className="flex h-[calc(100vh-4.5rem)] bg-slate-100 dark:bg-slate-950 overflow-hidden font-sans">
            {/* Catalog & Filter Section */}
            <PosCatalogGrid
                products={products}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddToCart={addToCart}
                onOpenCustomModal={() => setShowCustomModal(true)}
                cashierName={(user as any)?.fullName || 'Admin'}
            />

            {/* Cart Panel Sidebar */}
            <PosCartPanel
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onClearCart={clearCart}
                taxRate={taxRate}
                onTaxRateChange={setTaxRate}
                orderDiscount={orderDiscount}
                onOrderDiscountChange={setOrderDiscount}
                subtotal={subtotal}
                taxAmount={taxAmount}
                finalTotal={finalTotal}
                totalItemCount={totalItemCount}
                onProceedCheckout={() => setIsCheckoutOpen(true)}
            />

            {/* Modals */}
            <CustomItemModal
                isOpen={showCustomModal}
                onClose={() => setShowCustomModal(false)}
                onAdd={addToCart}
                selectedCategory={selectedCategory}
            />

            <ThermalReceiptModal
                data={lastCompletedSale}
                onClose={() => setLastCompletedSale(null)}
            />

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                totalAmount={finalTotal}
                onConfirm={processCheckout}
            />
        </div>
    );
}

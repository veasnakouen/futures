import React, { useState, useEffect } from "react";
import PosCatalogGrid, { CategoryFilter } from "../components/PosCatalogGrid";
import PosCartPanel from "../components/PosCartPanel";
import CheckoutModal from "../components/CheckoutModal";
import ProductFormModal from "../components/ProductFormModal";
import { posService, PosProductDto } from "../../../services/posService";
import { toast } from "react-hot-toast";

export interface CartItem {
  product: PosProductDto;
  quantity: number;
}

export default function PosDashboard() {
  const [products, setProducts] = useState<PosProductDto[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [taxRate, setTaxRate] = useState<number>(0.10);
  const [orderDiscount, setOrderDiscount] = useState<number>(0);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await posService.getAllProducts();
      setProducts(data || []);
    } catch {
      toast.error("Failed to load POS catalog");
    }
  };

  const handleAddToCart = (product: PosProductDto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountedSubtotal = Math.max(0, subtotal - orderDiscount);
  const taxAmount = discountedSubtotal * taxRate;
  const finalTotal = discountedSubtotal + taxAmount;

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden border-none">
      {/* Main Catalog View */}
      <PosCatalogGrid
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddToCart={handleAddToCart}
        onOpenCustomModal={() => setIsProductModalOpen(true)}
        cashierName="Administrator"
      />

      {/* Modern Borderless Cart Panel */}
      <PosCartPanel
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
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

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} totalAmount={finalTotal} onConfirm={() => { setCart([]); toast.success("Sale complete!"); }} />
      <ProductFormModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} productToEdit={null} onSaved={loadProducts} />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import PosCatalogGrid, { CategoryFilter } from "../components/PosCatalogGrid";
import CheckoutModal, { CustomerProfile } from "../components/CheckoutModal";
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

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Main Catalog View */}
      <PosCatalogGrid
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddToCart={handleAddToCart}
        onOpenCustomModal={() => setIsProductModalOpen(true)}
        cashierName="Operator #1"
      />

      {/* Cart Drawer */}
      <div className="w-80 bg-white dark:bg-slate-900 border-l p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-sm font-black uppercase text-slate-500 mb-3">Current Cart</h2>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-bold">{item.product.name}</p>
                  <p className="text-slate-400">${item.product.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <span className="font-mono font-black">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between font-black text-base">
            <span>Total:</span>
            <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
          <button onClick={() => setIsCheckoutOpen(true)} disabled={cart.length === 0} className="w-full py-3 bg-blue-600 text-white font-black rounded-xl text-xs">
            Pay Now (${totalAmount.toFixed(2)})
          </button>
        </div>
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} totalAmount={totalAmount} onConfirm={() => { setCart([]); toast.success("Sale complete!"); }} />
      <ProductFormModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} productToEdit={null} onSaved={loadProducts} />
    </div>
  );
}

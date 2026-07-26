import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Store, Tag, Stethoscope, Bed, GraduationCap, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { PosProductDto } from '../../../services/posService';
import { offlineSyncService } from '../../../services/offlineSyncService';

export type CategoryFilter = 'ALL' | 'RETAIL' | 'CLINIC' | 'HOTEL' | 'SCHOOL';

interface PosCatalogGridProps {
    products: PosProductDto[];
    selectedCategory: CategoryFilter;
    onSelectCategory: (cat: CategoryFilter) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddToCart: (product: PosProductDto) => void;
    onOpenCustomModal: () => void;
    cashierName: string;
}

export default function PosCatalogGrid({
    products,
    selectedCategory,
    onSelectCategory,
    searchQuery,
    onSearchChange,
    onAddToCart,
    onOpenCustomModal,
    cashierName,
}: PosCatalogGridProps) {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [pendingCount, setPendingCount] = useState<number>(0);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    useEffect(() => {
        const updateStatus = () => {
            const online = offlineSyncService.isOnline();
            setIsOnline(online);
            const pending = offlineSyncService.getPendingQueue().length;
            setPendingCount(pending);

            if (online && pending > 0 && !isSyncing) {
                triggerSync();
            }
        };

        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        const interval = setInterval(updateStatus, 5000);

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
            clearInterval(interval);
        };
    }, [isSyncing]);

    const triggerSync = async () => {
        setIsSyncing(true);
        await offlineSyncService.syncPendingQueue();
        setPendingCount(offlineSyncService.getPendingQueue().length);
        setIsSyncing(false);
    };

    const categoryPills: { id: CategoryFilter; label: string; icon: any }[] = [
        { id: 'ALL', label: 'All Items', icon: Store },
        { id: 'RETAIL', label: 'Retail', icon: Tag },
        { id: 'CLINIC', label: 'Clinic', icon: Stethoscope },
        { id: 'HOTEL', label: 'Hotel', icon: Bed },
        { id: 'SCHOOL', label: 'School', icon: GraduationCap },
    ];

    const getProductDomain = (p: PosProductDto): CategoryFilter => {
        if (p.domain) {
            const d = p.domain.toUpperCase();
            if (['RETAIL', 'CLINIC', 'HOTEL', 'SCHOOL'].includes(d)) return d as CategoryFilter;
        }
        const cat = (p.category || '').toUpperCase();
        if (cat.includes('CLINIC') || cat.includes('MEDICAL') || cat.includes('LAB') || cat.includes('PHARMACY')) return 'CLINIC';
        if (cat.includes('HOTEL') || cat.includes('ROOM') || cat.includes('LODGING') || cat.includes('MINIBAR')) return 'HOTEL';
        if (cat.includes('SCHOOL') || cat.includes('TUITION') || cat.includes('BOOK') || cat.includes('UNIFORM')) return 'SCHOOL';
        return 'RETAIL';
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const domain = getProductDomain(p);
        const matchesCat = selectedCategory === 'ALL' || domain === selectedCategory;
        return matchesSearch && matchesCat;
    });

    const getItemCountForCategory = (catId: CategoryFilter) => {
        if (catId === 'ALL') return products.length;
        return products.filter(p => getProductDomain(p) === catId).length;
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 p-5 overflow-hidden">
            {/* Top Toolbar: Brand Info + Search & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 shrink-0 bg-white dark:bg-slate-900 p-3.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800">
                {/* Brand & Register Info */}
                <div className="flex items-center gap-2.5 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 shrink-0">
                        POS
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-none whitespace-nowrap">
                                Square Register
                            </h1>
                            {/* Live Network & Sync Badge */}
                            {isOnline ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                                    <Wifi size={10} /> Online
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                                    <WifiOff size={10} /> Offline Mode {pendingCount > 0 && `(${pendingCount} Queued)`}
                                </span>
                            )}
                            {isSyncing && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 animate-pulse">
                                    <RefreshCw size={10} className="animate-spin" /> Syncing...
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 whitespace-nowrap">
                            Cashier: <span className="font-bold text-slate-700 dark:text-slate-300">{cashierName}</span>
                        </p>
                    </div>
                </div>

                {/* Search Bar & Custom Item Button (Fluid & Responsive) */}
                <div className="flex items-center gap-2 flex-1 min-w-[200px] justify-end">
                    <div className="relative w-full max-w-[220px] lg:max-w-[260px]">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search SKU or item..."
                            className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={onOpenCustomModal}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                        title="Add Custom Item"
                    >
                        <PlusCircle size={15} />
                        <span className="hidden xl:inline">+ Custom Item</span>
                    </button>
                </div>
            </div>

            {/* Dedicated Category Tabs Row (Prominent & Never Squished) */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto custom-scrollbar pb-1 shrink-0">
                {categoryPills.map(cat => {
                    const Icon = cat.icon;
                    const isActive = selectedCategory === cat.id;
                    const count = getItemCountForCategory(cat.id);
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 border ${
                                isActive
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                            <span>{cat.label}</span>
                            <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Grid Product List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                {filteredProducts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                        <Store size={40} className="opacity-30 mb-2" />
                        <p className="font-bold text-xs text-slate-600 dark:text-slate-400">No products found</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Try searching for a different item name or SKU</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => onAddToCart(product)}
                                className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                            >
                                {/* Thumbnail / Category Badge */}
                                <div className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800 mb-2.5 overflow-hidden relative flex items-center justify-center">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <Store className="text-slate-300 dark:text-slate-600" size={36} />
                                    )}
                                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-[9px] font-bold text-white rounded-md uppercase">
                                        {getProductDomain(product)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs line-clamp-2 leading-snug mb-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-[10px] font-medium text-slate-400 truncate">
                                        SKU: {product.sku}
                                    </p>
                                </div>

                                {/* Price Tag */}
                                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        + Add
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

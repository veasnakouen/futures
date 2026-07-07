import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  MapPin,
  DollarSign,
  Layers,
  Tag,
  Eye,
  Monitor,
  Cpu,
} from "lucide-react";
import { Link } from '@/lib/react-router-compat';
import api from '@/services/api';
import ScrollReveal from "./ScrollReveal";
import { Spinner } from '@/lib/flowbite-compat';

const FALLBACK_PRODUCTS = [
  {
    id: -1,
    name: "Developer Workstation Pro",
    sku: "SYS-WS-PRO01",
    category: "Electronics",
    quantity: 12,
    unit: "pcs",
    unitPrice: 2499.0,
    location: "Tech Lab A",
    status: "In Stock",
    description:
      "High-performance developer workstation with multi-core processor and dual GPUs.",
    imageUrl:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -2,
    name: "Ergonomic Mesh Chair",
    sku: "FUR-CH-ERG02",
    category: "Furniture",
    quantity: 25,
    unit: "pcs",
    unitPrice: 450.0,
    location: "Main Office",
    status: "In Stock",
    description:
      "Fully adjustable ergonomic office chair with lumbar support and breathable mesh.",
    imageUrl:
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -3,
    name: 'UltraWide 34" Monitor',
    sku: "MON-UW-34B",
    category: "Electronics",
    quantity: 8,
    unit: "pcs",
    unitPrice: 799.0,
    location: "Conference Room",
    status: "In Stock",
    description:
      "34-inch curved ultrawide monitor with color-accurate panel and USB-C hub.",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -4,
    name: "Mechanical Keyboard",
    sku: "KEY-MECH-RGB",
    category: "Office Supplies",
    quantity: 40,
    unit: "pcs",
    unitPrice: 129.0,
    location: "Warehouse B",
    status: "In Stock",
    description:
      "Tenkeyless tactile mechanical keyboard with programmable RGB backlighting.",
    imageUrl:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -5,
    name: "Wireless ANC Headphones",
    sku: "AUD-NC-HEAD",
    category: "Electronics",
    quantity: 15,
    unit: "pcs",
    unitPrice: 349.0,
    location: "Tech Lab A",
    status: "In Stock",
    description:
      "Active noise-canceling over-ear wireless headphones with studio-quality audio.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -6,
    name: "Smart Security Camera",
    sku: "SEC-CAM-IP66",
    category: "Security",
    quantity: 18,
    unit: "pcs",
    unitPrice: 189.0,
    location: "Warehouse A",
    status: "In Stock",
    description:
      "Weatherproof indoor/outdoor security camera with night vision and smart alerts.",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -7,
    name: "Ergonomic Standing Desk",
    sku: "FUR-DK-STAND",
    category: "Furniture",
    quantity: 5,
    unit: "pcs",
    unitPrice: 699.0,
    location: "Main Office",
    status: "In Stock",
    description:
      "Motorized height-adjustable desk with memory presets and built-in cable management.",
    imageUrl:
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -8,
    name: "Portable SSD 2TB",
    sku: "STG-SSD-2TB",
    category: "Electronics",
    quantity: 50,
    unit: "pcs",
    unitPrice: 159.0,
    location: "Tech Lab B",
    status: "In Stock",
    description:
      "Rugged and fast external solid-state drive with high-speed transfer speeds.",
    imageUrl:
      "https://images.unsplash.com/photo-1597872200319-3813cbf60ca6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -9,
    name: "Conference Speakerphone",
    sku: "AUD-SPK-CONF",
    category: "Electronics",
    quantity: 7,
    unit: "pcs",
    unitPrice: 299.0,
    location: "Conference Room",
    status: "In Stock",
    description:
      "Professional 360-degree microphone array and conference call speaker system.",
    imageUrl:
      "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -10,
    name: "Smart Biometric Lock",
    sku: "SEC-LCK-BIO",
    category: "Security",
    quantity: 22,
    unit: "pcs",
    unitPrice: 249.0,
    location: "Warehouse A",
    status: "In Stock",
    description:
      "Keyless entry smart door lock with biometric fingerprint scanner and backup keypad.",
    imageUrl:
      "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
  },
];

const getPlaceholderIcon = (category: string = "") => {
  const cat = category.toLowerCase();
  if (
    cat.includes("tech") ||
    cat.includes("electron") ||
    cat.includes("computer") ||
    cat.includes("device") ||
    cat.includes("sys")
  ) {
    return (
      <Monitor
        size={48}
        className="text-blue-500 dark:text-blue-400 opacity-60"
      />
    );
  }
  if (
    cat.includes("furnit") ||
    cat.includes("chair") ||
    cat.includes("desk") ||
    cat.includes("table")
  ) {
    return (
      <Layers
        size={48}
        className="text-purple-500 dark:text-purple-400 opacity-60"
      />
    );
  }
  return (
    <Package
      size={48}
      className="text-emerald-500 dark:text-emerald-400 opacity-60"
    />
  );
};

const ProductCarousel: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<any>(null);

  useEffect(() => {
    // Fetch assets with a timeout so it doesn't hang indefinitely
    api
      .get("/stock/hr/assets", {
        params: { page: 0, size: 100 },
        timeout: 15000,
      })
      .then((res) => {
        const items = res.data?.content || res.data || [];

        if (Array.isArray(items) && items.length > 0) {
          const withImages = items.filter(
            (item: any) => item.imageUrl && item.imageUrl.trim() !== "",
          );
          if (withImages.length > 0) {
            const mappedItems = withImages.map((asset: any) => ({
              ...asset,
              category: asset.assetType || "Equipment",
              sku: asset.serialNumber,
              quantity: 1,
              unit: "Unit",
              minQuantity: 0,
              unitPrice: 0,
              location: asset.employee
                ? `${asset.employee.firstName} ${asset.employee.lastName}`
                : "Stock Node",
              description:
                asset.status === "Assigned"
                  ? "Currently deployed to an active custodian."
                  : "Available in stock node for deployment.",
            }));

            setProducts(mappedItems.slice(0, 10));
            return;
          }
        }
        // Avoid showing fake data if no valid items returned
        setProducts([]);
      })
      .catch((err) => {
        console.warn("Failed to fetch assets for carousel:", err.message);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || products.length === 0 || isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [loading, products, isHovered]);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800/40 dark:backdrop-blur-md rounded-md p-10 h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4">
            <Spinner size="xl" color="info" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 animate-pulse">
            Loading Inventory Showcase...
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <ScrollReveal
      animation="fade-in-up"
      delay={0}
      duration={600}
      triggerOnce={true}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-to-br from-blue-50/30 via-white to-white dark:from-slate-900/30 dark:via-gray-850/40 dark:to-gray-800/20 rounded-md p-8 md:p-10 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] relative overflow-hidden group min-h-[340px] flex items-center"
      >
        {/* Visual Backdrops */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-400/5 rounded-md -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-purple-500/5 dark:bg-purple-400/5 rounded-md blur-3xl pointer-events-none"></div>

        {/* Carousel Navigation Chevrons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-md bg-white/85 dark:bg-gray-850/80 text-gray-650 dark:text-gray-300 shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-md bg-white/85 dark:bg-gray-850/80 text-gray-650 dark:text-gray-300 shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all z-20"
        >
          <ChevronRight size={18} />
        </button>

        {/* Slides Content */}
        <div className="relative w-full h-full z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Slide Details */}
          <div className="flex-1 space-y-4 text-left w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-[9px] font-black tracking-widest uppercase bg-blue-50/80 dark:bg-blue-950/40 border-blue-100/50 dark:border-blue-900/30 px-3 py-1 rounded-md shadow-sm">
                <Tag size={10} /> {currentProduct.category}
              </span>
              <span
                className={`text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-md shadow-sm ${currentProduct.status !== "Available" ? "bg-amber-50 border-amber-100/50 text-amber-600 dark:bg-amber-950/30 dark:border-amber-900/30 dark:text-amber-450" : "bg-emerald-50 border-emerald-100/50 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-450"}`}
              >
                {currentProduct.status || "Available"}
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                {currentProduct.name}
              </h3>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed max-w-lg">
                {currentProduct.description ||
                  "No description provided for this stock node."}
              </p>
            </div>

            {/* Spec Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              <div className="bg-white/60 dark:bg-gray-800/40 p-3 rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-455 mb-0.5">
                  Asset Code
                </p>
                <p className="text-[10px] font-black text-gray-800 dark:text-gray-200 truncate">
                  {currentProduct.sku || "N/A"}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/40 p-3 rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-455 mb-0.5">
                  Unit Price
                </p>
                <p className="text-[10px] font-black text-gray-850 dark:text-gray-200 flex items-center tabular-nums">
                  <DollarSign size={10} className="text-gray-400" />
                  {currentProduct.unitPrice > 0
                    ? currentProduct.unitPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    : "---"}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/40 p-3 rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-455 mb-0.5">
                  Quantity
                </p>
                <p className="text-[10px] font-black text-gray-800 dark:text-gray-200 tabular-nums">
                  {currentProduct.quantity} {currentProduct.unit}
                </p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/40 p-3 rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-455 mb-0.5">
                  Node Location
                </p>
                <p className="text-[10px] font-black text-gray-800 dark:text-gray-200 flex items-center gap-1 truncate">
                  <MapPin size={10} className="text-gray-450 shrink-0" />
                  {currentProduct.location || "Warehouse"}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/hr"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-md shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Eye size={12} /> Manage Assets
              </Link>
            </div>
          </div>

          {/* Slide Image Panel */}
          <div className="w-full md:w-[320px] lg:w-[380px] h-[210px] md:h-[240px] shrink-0 rounded-md overflow-hidden relative shadow-md bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-center">
            {currentProduct.imageUrl ? (
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                {getPlaceholderIcon(currentProduct.category)}
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-450 dark:text-gray-500">
                  Asset Record (No Image)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dots Page Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-5 bg-blue-600 dark:bg-blue-500" : "w-1.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-450"}`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ProductCarousel;

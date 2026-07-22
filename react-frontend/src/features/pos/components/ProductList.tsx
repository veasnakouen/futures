import React, { useState, useEffect } from "react";
import { posService, PosProductDto } from "../../../services/posService";
import { Plus, Package, Edit, Trash2, Tag, Layers } from "lucide-react";
import ProductFormModal from "./ProductFormModal";
import { toast } from "react-hot-toast";
import ConfirmModal from "../../../components/common/ConfirmModal";
import DataTable, { ColumnDef } from "../../../components/common/DataTable";
import { Badge } from "@/lib/flowbite-compat";

export default function ProductList() {
  const [products, setProducts] = useState<PosProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PosProductDto | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await posService.getAllProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setIsLoading(false);
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

  // Filter products by search
  const filteredProducts = products.filter((p) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.sku && p.sku.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query))
    );
  });

  const totalFiltered = filteredProducts.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns: ColumnDef<PosProductDto>[] = [
    {
      header: "Product Name",
      accessorKey: "name",
      sortable: true,
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package size={20} className="text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">
              {product.name}
            </div>
            {product.brand && (
              <div className="text-xs text-gray-500">{product.brand}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "SKU / Barcode",
      accessorKey: "sku",
      sortable: true,
      cell: (product) => (
        <div className="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">
          <div>{product.sku || "N/A"}</div>
          {product.barcode && (
            <div className="text-[10px] text-gray-400">{product.barcode}</div>
          )}
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      sortable: true,
      cell: (product) => (
        <Badge color="gray" className="rounded-md font-bold text-[10px] uppercase">
          {product.category || "General"}
        </Badge>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      sortable: true,
      cell: (product) => (
        <span className="font-mono font-bold text-gray-900 dark:text-white">
          ${(product.price || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Stock Quantity",
      accessorKey: "stockQuantity",
      sortable: true,
      cell: (product) => (
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            product.stockQuantity > 10
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
          }`}
        >
          {product.stockQuantity} {product.unit || "in stock"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (product) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            product.status === "ACTIVE"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
              : product.status === "OUT_OF_STOCK"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {product.status || "ACTIVE"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (product) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenModal(product)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            title="Edit Product"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(product.id!)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="text-blue-600" /> POS Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your point of sale inventory, SKU catalog, and pricing.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Enhanced Enterprise DataTable */}
      <DataTable
        data={paginatedProducts}
        columns={columns}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search product name, SKU, or category..."
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalFiltered}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        enableViewToggle={true}
        enableColumnToggle={true}
        emptyMessage="No products found in POS inventory."
        emptyIcon={<Package size={32} className="text-gray-300" />}
        renderGridCard={(product: PosProductDto) => (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center shrink-0">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={22} className="text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">
                  {product.name}
                </h4>
                <span className="text-[10px] font-mono text-gray-400 font-bold">
                  {product.sku || "N/A"}
                </span>
              </div>

              {/* Hover Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-1 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(product);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                  title="Edit Product"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product.id!);
                  }}
                  className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100 dark:border-gray-700">
              <Badge color="gray" className="rounded-md font-bold text-[9px] uppercase">
                {product.category || "General"}
              </Badge>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                ${(product.price || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={selectedProduct}
        onSaved={loadProducts}
        existingCategories={
          Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[]
        }
        existingBrands={
          Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[]
        }
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

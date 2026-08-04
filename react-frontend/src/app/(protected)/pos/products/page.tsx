"use client";

import React, { useState } from "react";
import ProductList from '../../../../features/pos/components/ProductList';
import ProductFormModal from '../../../../features/pos/components/ProductFormModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { posService, PosProductDto } from "../../../../services/posService";
import { toast } from "react-hot-toast";

export default function PosProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PosProductDto | null>(null);
  const [productToDelete, setProductToDelete] = useState<PosProductDto | null>(null);

  const queryClient = useQueryClient();

  const { data: productsData, refetch } = useQuery({
    queryKey: ["pos-products"],
    queryFn: () => posService.getAllProducts(),
  });

  const products: PosProductDto[] = Array.isArray(productsData) ? productsData : [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => posService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<PosProductDto[]>(["pos-products"], (old = []) =>
        old.filter((item) => item.id !== deletedId)
      );
      queryClient.invalidateQueries({ queryKey: ["pos-products"] });
      toast.success("Product deleted successfully");
      setProductToDelete(null);
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const handleDeleteConfirm = () => {
    if (productToDelete?.id) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <ProductList
        products={products}
        onAddNew={() => {
          setSelectedProduct(null);
          setIsModalOpen(true);
        }}
        onEdit={(p: PosProductDto) => {
          setSelectedProduct(p);
          setIsModalOpen(true);
        }}
        onDelete={(p: any) => {
          if (typeof p === "object" && p !== null) {
            setProductToDelete(p as PosProductDto);
          } else {
            const found = products.find((item) => item.id === p);
            if (found) setProductToDelete(found);
          }
        }}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={selectedProduct}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ["pos-products"] });
          refetch();
          toast.success("Product catalog updated successfully");
        }}
      />

      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product Confirmation"
        message={`Are you sure you want to delete "${productToDelete?.name || 'this product'}" from the catalog? This action cannot be undone.`}
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

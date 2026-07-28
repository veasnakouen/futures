import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, Trash2, Package } from "lucide-react";
import { PosProductDto } from "../../../services/posService";

export interface ProductListProps {
  products?: PosProductDto[];
  onEdit?: (product: PosProductDto) => void;
  onDelete?: (id: any) => void;
  onAddNew?: () => void;
  [key: string]: any;
}

export default function ProductList({
  products = [],
  onEdit = () => {},
  onDelete = () => {},
  onAddNew = () => {},
}: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
          <Input
            type="text"
            placeholder="Search catalog by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <Button size="sm" onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9">
          <Plus size={14} className="mr-1" /> Add Product
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase font-black text-gray-400">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y text-xs">
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-bold dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                    {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded" /> : <Package size={16} />}
                  </div>
                  {product.name}
                </TableCell>
                <TableCell className="font-mono text-gray-500">{product.sku}</TableCell>
                <TableCell>{product.category || "General"}</TableCell>
                <TableCell className="font-mono font-bold text-blue-600">${product.price?.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${product.stockQuantity < 10 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                    {product.stockQuantity}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="h-8 w-8 p-0 text-blue-600"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => product.id && onDelete(product.id)} className="h-8 w-8 p-0 text-red-600"><Trash2 size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

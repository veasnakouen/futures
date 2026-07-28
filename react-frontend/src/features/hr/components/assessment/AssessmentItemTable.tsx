import React from "react";
import { Button, TextInput, Select, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from '@/lib/flowbite-compat';
import { Plus, Trash2 } from "lucide-react";

interface AssessmentItemTableProps {
  items: { itemName: string; unitType: string; quantity: number; price: number }[];
  onAddItem: () => void;
  onItemChange: (index: number, field: string, value: any) => void;
  onRemoveItem: (index: number) => void;
}

const AssessmentItemTable: React.FC<AssessmentItemTableProps> = ({
  items,
  onAddItem,
  onItemChange,
  onRemoveItem,
}) => {
  return (
    <div className="rounded-md overflow-hidden bg-white dark:bg-gray-800 border">
      <Table hoverable>
        <TableHead className="bg-blue-100 dark:bg-blue-900/30">
          <TableHeadCell className="py-2 text-xs">Item Name*</TableHeadCell>
          <TableHeadCell className="py-2 text-xs w-24">Unit Type*</TableHeadCell>
          <TableHeadCell className="py-2 text-xs w-20">Quantity*</TableHeadCell>
          <TableHeadCell className="py-2 text-xs w-24">Price ($)*</TableHeadCell>
          <TableHeadCell className="py-2 text-xs w-10"></TableHeadCell>
        </TableHead>
        <TableBody className="divide-y dark:divide-gray-700">
          {items.map((item, idx) => (
            <TableRow key={idx} className="border-b">
              <TableCell className="p-1">
                <TextInput sizing="sm" value={item.itemName} onChange={(e) => onItemChange(idx, "itemName", e.target.value)} />
              </TableCell>
              <TableCell className="p-1">
                <Select sizing="sm" value={item.unitType} onChange={(e) => onItemChange(idx, "unitType", e.target.value)}>
                  <option>PCs</option>
                  <option>Box</option>
                  <option>Set</option>
                  <option>Unit</option>
                </Select>
              </TableCell>
              <TableCell className="p-1">
                <TextInput type="number" sizing="sm" value={item.quantity} onChange={(e) => onItemChange(idx, "quantity", parseInt(e.target.value) || 0)} />
              </TableCell>
              <TableCell className="p-1">
                <TextInput type="number" sizing="sm" value={item.price} onChange={(e) => onItemChange(idx, "price", parseFloat(e.target.value) || 0)} />
              </TableCell>
              <TableCell className="p-1 text-center">
                <Button size="xs" color="failure" outline className="p-0 h-8 w-8 rounded-md mx-auto" onClick={() => onRemoveItem(idx)}>
                  <Trash2 size={12} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t">
        <Button size="xs" color="light" onClick={onAddItem} className="font-bold text-xs">
          <Plus size={14} className="mr-1" /> Add Item
        </Button>
      </div>
    </div>
  );
};

export default AssessmentItemTable;

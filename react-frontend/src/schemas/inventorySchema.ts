import { z } from "zod";

export const inventorySchema = z.object({
  name: z.string().min(1, "Item name is required").max(255),
  sku: z.string().max(50).optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  minQuantity: z.coerce.number().min(0, "Minimum quantity cannot be negative"),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative"),
  location: z.string().min(1, "Location is required"),
  status: z.string().min(1, "Status is required"),
  description: z.string().max(1000).optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
});

export type InventoryFormData = z.infer<typeof inventorySchema>;

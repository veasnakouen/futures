import { z } from "zod";

export const inventorySchema = z.object({
  name: z.string().min(1, "Item name is required").max(255),
  sku: z.string().max(50).optional().or(z.literal("")),
  category: z.any().optional(),
  brand: z.string().optional().or(z.literal("")),
  stockQuantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  reorderLevel: z.coerce.number().min(0, "Minimum quantity cannot be negative"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  costPrice: z.coerce.number().min(0, "Cost price cannot be negative").optional(),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
  weight: z.coerce.number().min(0).optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().min(0).optional(),
  trackStock: z.boolean().default(true),
  department: z.any().optional(), // For backend return object
  departmentId: z.coerce.number().optional(),
  description: z.string().max(1000).optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
});

export type InventoryFormData = z.infer<typeof inventorySchema>;

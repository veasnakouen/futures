import { z } from "zod";

export const assetSchema = z.object({
  name: z.string().min(1, "Asset name is required").max(255),
  serialNumber: z.string().min(1, "Serial number is required").max(255),
  assetType: z.string().min(1, "Asset type is required"),
  status: z.string().min(1, "Status is required"),
  imageUrl: z.string().optional().or(z.literal("")),
  vendor: z.string().optional().or(z.literal("")),
  purchaseDate: z.string().optional().or(z.literal("")),
  purchaseCost: z.number().optional().or(z.literal(0)),
  warrantyExpiryDate: z.string().optional().or(z.literal("")),
  assetCondition: z.string().optional().or(z.literal("")),
  barcode: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  isReturnable: z.boolean().optional().default(true),
  isKit: z.boolean().optional().default(false),
  isIntangible: z.boolean().optional().default(false),
  isSubscription: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  renewalDate: z.string().optional().or(z.literal("")),
  acquisitionType: z.string().optional().or(z.literal("")),
  donorOrPartnerName: z.string().optional().or(z.literal("")),
  costCenter: z.string().optional().or(z.literal("")),
  usefulLifeYears: z.number().optional().or(z.literal(0)),
  productFamily: z.string().optional().or(z.literal("")),
  brand: z.string().optional().or(z.literal("")),
  modelNumber: z.string().optional().or(z.literal("")),
});

export interface AssetFormData extends z.infer<typeof assetSchema> {}

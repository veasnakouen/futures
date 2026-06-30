import { z } from "zod";

export const biometricDeviceSchema = z.object({
  name: z.string().min(1, "Device alias is required"),
  ipAddress: z
    .string()
    .regex(
      /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/,
      "Invalid IPv4 address",
    ),
  port: z
    .string()
    .min(1, "Port is required")
    .regex(/^\d+$/, "Port must be numeric"),
  location: z.string().min(1, "Physical location is required"),
});

export type BiometricDeviceFormData = z.infer<typeof biometricDeviceSchema>;

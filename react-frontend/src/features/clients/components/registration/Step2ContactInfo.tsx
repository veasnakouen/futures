import React from "react";
import { Label, TextInput, Select } from "@/lib/flowbite-compat";
import { MapPin } from "lucide-react";

interface Props {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step2ContactInfo({ formData, setFormData }: Props) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <MapPin className="text-emerald-500" size={20} /> Contact & Location
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-xs font-bold text-gray-500 mb-1 block">Email Address</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="client@mtp.org"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs font-bold text-gray-500 mb-1 block">Contact Phone</Label>
              <TextInput
                id="phone"
                placeholder="+855 12 345 678"
                value={formData.contactPhone || ""}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="relativePhone" className="text-xs font-bold text-gray-500 mb-1 block">Relative Phone (Emergency)</Label>
              <TextInput
                id="relativePhone"
                placeholder="+855 12 987 654"
                value={formData.relativePhone || ""}
                onChange={(e) => setFormData({ ...formData, relativePhone: e.target.value })}
                className="rounded-md"
              />
            </div>
            <div>
              <Label htmlFor="province" className="text-xs font-bold text-gray-500 mb-1 block">Province</Label>
              <Select
                id="province"
                value={formData.province || "Phnom Penh"}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="rounded-md"
              >
                <option value="Phnom Penh">Phnom Penh</option>
                <option value="Battambang">Battambang</option>
                <option value="Siem Reap">Siem Reap</option>
                <option value="Kampong Cham">Kampong Cham</option>
                <option value="Sihanoukville">Sihanoukville</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="text-xs font-bold text-gray-500 mb-1 block">Full Address</Label>
            <TextInput
              id="address"
              placeholder="House 123, Street 456..."
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

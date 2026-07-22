import React, { useMemo } from "react";
import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { PatientFormValues } from "./patientSchema";
import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/locationService";
import { MapPin, Building, Globe, Navigation, Home, Compass } from "lucide-react";

interface Props {
  register: UseFormRegister<PatientFormValues>;
  watch: UseFormWatch<PatientFormValues>;
  setValue: UseFormSetValue<PatientFormValues>;
}

export const PatientAddressFields: React.FC<Props> = ({ register, watch, setValue }) => {
  const cityRegistration = register("address.city");
  const districtRegistration = register("address.district");
  const communeRegistration = register("address.commune");
  const villageRegistration = register("address.village");

  // Watch values for cascading dropdown selections
  const selectedProvinceName = watch("address.city");
  const selectedDistrictName = watch("address.district");
  const selectedCommuneName = watch("address.commune");

  // Fetch Provinces
  const { data: provincesRes } = useQuery({
    queryKey: ["provinces"],
    queryFn: locationService.getProvinces,
  });
  const provinces = provincesRes?.data || [];

  const selectedProvinceId = useMemo(() => {
    return provinces.find((p) => p.nameEn === selectedProvinceName)?.id;
  }, [provinces, selectedProvinceName]);

  // Fetch Districts (cascades on Province)
  const { data: districtsRes } = useQuery({
    queryKey: ["districts", selectedProvinceId],
    queryFn: () => locationService.getDistricts(selectedProvinceId!),
    enabled: !!selectedProvinceId,
  });
  const districts = districtsRes?.data || [];

  const selectedDistrictId = useMemo(() => {
    return districts.find((d) => d.nameEn === selectedDistrictName)?.id;
  }, [districts, selectedDistrictName]);

  // Fetch Communes (cascades on District)
  const { data: communesRes } = useQuery({
    queryKey: ["communes", selectedDistrictId],
    queryFn: () => locationService.getCommunes(selectedDistrictId!),
    enabled: !!selectedDistrictId,
  });
  const communes = communesRes?.data || [];

  const selectedCommuneId = useMemo(() => {
    return communes.find((c) => c.nameEn === selectedCommuneName)?.id;
  }, [communes, selectedCommuneName]);

  // Fetch Villages (cascades on Commune)
  const { data: villagesRes } = useQuery({
    queryKey: ["villages", selectedCommuneId],
    queryFn: () => locationService.getVillages(selectedCommuneId!),
    enabled: !!selectedCommuneId,
  });
  const villages = villagesRes?.data || [];

  // Handlers to reset child location dropdowns when parent selection changes
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    cityRegistration.onChange(e);
    setValue("address.city", e.target.value);
    setValue("address.district", "");
    setValue("address.commune", "");
    setValue("address.village", "");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    districtRegistration.onChange(e);
    setValue("address.district", e.target.value);
    setValue("address.commune", "");
    setValue("address.village", "");
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    communeRegistration.onChange(e);
    setValue("address.commune", e.target.value);
    setValue("address.village", "");
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 shadow-sm space-y-4">
      <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
        <MapPin size={15} /> Residential Location Management
      </h4>

      {/* Cascading Location Management Select Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Province / City */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Province / City
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <select
              {...cityRegistration}
              onChange={handleProvinceChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm"
            >
              <option value="">Select Province / City...</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.nameEn}>
                  {p.nameEn} {p.nameKh ? `(${p.nameKh})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            District
          </label>
          <div className="relative">
            <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <select
              {...districtRegistration}
              onChange={handleDistrictChange}
              disabled={!selectedProvinceId}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900/50"
            >
              <option value="">
                {selectedProvinceId ? "Select District..." : "Select Province first"}
              </option>
              {districts.map((d) => (
                <option key={d.id} value={d.nameEn}>
                  {d.nameEn} {d.nameKh ? `(${d.nameKh})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Commune */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Commune
          </label>
          <div className="relative">
            <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <select
              {...communeRegistration}
              onChange={handleCommuneChange}
              disabled={!selectedDistrictId}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900/50"
            >
              <option value="">
                {selectedDistrictId ? "Select Commune..." : "Select District first"}
              </option>
              {communes.map((c) => (
                <option key={c.id} value={c.nameEn}>
                  {c.nameEn} {c.nameKh ? `(${c.nameKh})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Village */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Village
          </label>
          <div className="relative">
            <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500" size={16} />
            <select
              {...villageRegistration}
              disabled={!selectedCommuneId}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900/50"
            >
              <option value="">
                {selectedCommuneId ? "Select Village..." : "Select Commune first"}
              </option>
              {villages.map((v) => (
                <option key={v.id} value={v.nameEn}>
                  {v.nameEn} {v.nameKh ? `(${v.nameKh})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* House / Street Address */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Street Address / House No.
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              {...register("address.street")}
              placeholder="e.g. House #123, Street 271"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Country
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              {...register("address.country")}
              placeholder="Cambodia"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Zip / Postal Code */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Zip / Postal Code
          </label>
          <input
            {...register("address.zipCode")}
            placeholder="e.g. 200101"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

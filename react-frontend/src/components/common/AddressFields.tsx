import React, { useMemo } from "react";
import { UseFormRegister, FieldErrors, FieldValues, Path, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { locationService } from "../../services/locationService";

interface AddressFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  prefix: Path<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
}

export default function AddressFields<T extends FieldValues>({ register, errors, prefix, watch, setValue }: AddressFieldsProps<T>) {
  // Watch values for cascading dropdowns
  const selectedProvinceName = watch(`${prefix}.city` as Path<T>);
  const selectedDistrictName = watch(`${prefix}.district` as Path<T>);
  const selectedCommuneName = watch(`${prefix}.commune` as Path<T>);

  // Queries
  const { data: provincesRes } = useQuery({
    queryKey: ["provinces"],
    queryFn: locationService.getProvinces,
  });
  const provinces = provincesRes?.data || [];

  const selectedProvinceId = useMemo(() => {
    return provinces.find((p) => p.nameEn === selectedProvinceName)?.id;
  }, [provinces, selectedProvinceName]);

  const { data: districtsRes } = useQuery({
    queryKey: ["districts", selectedProvinceId],
    queryFn: () => locationService.getDistricts(selectedProvinceId!),
    enabled: !!selectedProvinceId,
  });
  const districts = districtsRes?.data || [];

  const selectedDistrictId = useMemo(() => {
    return districts.find((d) => d.nameEn === selectedDistrictName)?.id;
  }, [districts, selectedDistrictName]);

  const { data: communesRes } = useQuery({
    queryKey: ["communes", selectedDistrictId],
    queryFn: () => locationService.getCommunes(selectedDistrictId!),
    enabled: !!selectedDistrictId,
  });
  const communes = communesRes?.data || [];

  const selectedCommuneId = useMemo(() => {
    return communes.find((c) => c.nameEn === selectedCommuneName)?.id;
  }, [communes, selectedCommuneName]);

  const { data: villagesRes } = useQuery({
    queryKey: ["villages", selectedCommuneId],
    queryFn: () => locationService.getVillages(selectedCommuneId!),
    enabled: !!selectedCommuneId,
  });
  const villages = villagesRes?.data || [];

  // Handlers to clear cascading fields when parent changes
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(`${prefix}.city` as Path<T>, e.target.value as any);
    setValue(`${prefix}.district` as Path<T>, "" as any);
    setValue(`${prefix}.commune` as Path<T>, "" as any);
    setValue(`${prefix}.village` as Path<T>, "" as any);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(`${prefix}.district` as Path<T>, e.target.value as any);
    setValue(`${prefix}.commune` as Path<T>, "" as any);
    setValue(`${prefix}.village` as Path<T>, "" as any);
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(`${prefix}.commune` as Path<T>, e.target.value as any);
    setValue(`${prefix}.village` as Path<T>, "" as any);
  };

  // Helper to safely extract error message for nested fields
  const getError = (fieldName: string) => {
    const errorObj = (errors as any)[prefix];
    if (errorObj && errorObj[fieldName]) {
      return errorObj[fieldName]?.message;
    }
    return undefined;
  };

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Address Information</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
          <input
            {...register(`${prefix}.country` as Path<T>)}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Cambodia"
          />
          {getError('country') && <span className="text-red-500 text-xs mt-1">{getError('country')}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Province / City</label>
          <select
            {...register(`${prefix}.city` as Path<T>)}
            onChange={handleProvinceChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.nameEn}>{p.nameEn}</option>
            ))}
          </select>
          {getError('city') && <span className="text-red-500 text-xs mt-1">{getError('city')}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
          <select
            {...register(`${prefix}.district` as Path<T>)}
            onChange={handleDistrictChange}
            disabled={!selectedProvinceId}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.nameEn}>{d.nameEn}</option>
            ))}
          </select>
          {getError('district') && <span className="text-red-500 text-xs mt-1">{getError('district')}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Commune</label>
          <select
            {...register(`${prefix}.commune` as Path<T>)}
            onChange={handleCommuneChange}
            disabled={!selectedDistrictId}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select Commune</option>
            {communes.map((c) => (
              <option key={c.id} value={c.nameEn}>{c.nameEn}</option>
            ))}
          </select>
          {getError('commune') && <span className="text-red-500 text-xs mt-1">{getError('commune')}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Village</label>
          <select
            {...register(`${prefix}.village` as Path<T>)}
            disabled={!selectedCommuneId}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select Village</option>
            {villages.map((v) => (
              <option key={v.id} value={v.nameEn}>{v.nameEn}</option>
            ))}
          </select>
          {getError('village') && <span className="text-red-500 text-xs mt-1">{getError('village')}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
          <input
            {...register(`${prefix}.street` as Path<T>)}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. St. 271, House 123"
          />
          {getError('street') && <span className="text-red-500 text-xs mt-1">{getError('street')}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zip / Postal Code</label>
          <input
            {...register(`${prefix}.zipCode` as Path<T>)}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          {getError('zipCode') && <span className="text-red-500 text-xs mt-1">{getError('zipCode')}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State / Region</label>
          <input
            {...register(`${prefix}.state` as Path<T>)}
            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          {getError('state') && <span className="text-red-500 text-xs mt-1">{getError('state')}</span>}
        </div>
      </div>
    </div>
  );
}

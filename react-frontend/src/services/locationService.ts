import api from "./api";

export interface ProvinceDto {
  id: number;
  nameEn: string;
  nameKh?: string;
  postcode?: string;
}

export interface DistrictDto {
  id: number;
  nameEn: string;
  nameKh?: string;
  postcode?: string;
  provinceId: number;
}

export interface CommuneDto {
  id: number;
  nameEn: string;
  nameKh?: string;
  postcode?: string;
  districtId: number;
}

export interface VillageDto {
  id: number;
  nameEn: string;
  nameKh?: string;
  postcode?: string;
  communeId: number;
}

export const locationService = {
  // Provinces
  getProvinces: () => api.get<ProvinceDto[]>("/locations/provinces"),
  createProvince: (data: Omit<ProvinceDto, "id">) => api.post<ProvinceDto>("/locations/provinces", data),
  updateProvince: (id: number, data: Omit<ProvinceDto, "id">) => api.put<ProvinceDto>(`/locations/provinces/${id}`, data),
  deleteProvince: (id: number) => api.delete(`/locations/provinces/${id}`),

  // Districts
  getDistricts: (provinceId: number) => api.get<DistrictDto[]>(`/locations/districts?provinceId=${provinceId}`),
  createDistrict: (data: Omit<DistrictDto, "id">) => api.post<DistrictDto>("/locations/districts", data),
  updateDistrict: (id: number, data: Omit<DistrictDto, "id">) => api.put<DistrictDto>(`/locations/districts/${id}`, data),
  deleteDistrict: (id: number) => api.delete(`/locations/districts/${id}`),

  // Communes
  getCommunes: (districtId: number) => api.get<CommuneDto[]>(`/locations/communes?districtId=${districtId}`),
  createCommune: (data: Omit<CommuneDto, "id">) => api.post<CommuneDto>("/locations/communes", data),
  updateCommune: (id: number, data: Omit<CommuneDto, "id">) => api.put<CommuneDto>(`/locations/communes/${id}`, data),
  deleteCommune: (id: number) => api.delete(`/locations/communes/${id}`),

  // Villages
  getVillages: (communeId: number) => api.get<VillageDto[]>(`/locations/villages?communeId=${communeId}`),
  createVillage: (data: Omit<VillageDto, "id">) => api.post<VillageDto>("/locations/villages", data),
  updateVillage: (id: number, data: Omit<VillageDto, "id">) => api.put<VillageDto>(`/locations/villages/${id}`, data),
  deleteVillage: (id: number) => api.delete(`/locations/villages/${id}`),
};

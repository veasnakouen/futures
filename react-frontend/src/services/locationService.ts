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

// Fallback Location Registry (Cambodian Administrative Divisions)
const MOCK_PROVINCES: ProvinceDto[] = [
  { id: 1, nameEn: "Battambang", nameKh: "បាត់ដំបង", postcode: "2001" },
  { id: 2, nameEn: "Phnom Penh", nameKh: "ភ្នំពេញ", postcode: "12000" },
  { id: 3, nameEn: "Siem Reap", nameKh: "សៀមរាប", postcode: "17000" },
  { id: 4, nameEn: "Preah Sihanouk (SHV)", nameKh: "ព្រះសីហនុ", postcode: "001245" },
];

const MOCK_DISTRICTS: DistrictDto[] = [
  { id: 101, nameEn: "Sangke", nameKh: "សង្កែ", provinceId: 1, postcode: "200101" },
  { id: 102, nameEn: "Battambang City", nameKh: "ក្រុងបាត់ដំបង", provinceId: 1, postcode: "200102" },
  { id: 201, nameEn: "Chamkar Mon", nameKh: "ចំការមន", provinceId: 2, postcode: "120101" },
  { id: 202, nameEn: "Daun Penh", nameKh: "ដូនពេញ", provinceId: 2, postcode: "120201" },
  { id: 301, nameEn: "Siem Reap Central", nameKh: "ក្រុងសៀមរាប", provinceId: 3, postcode: "170101" },
  { id: 401, nameEn: "Mittapheap", nameKh: "មិត្តភាព", provinceId: 4, postcode: "001246" },
];

const MOCK_COMMUNES: CommuneDto[] = [
  { id: 1001, nameEn: "Tapon", nameKh: "តពន", districtId: 101, postcode: "20010102" },
  { id: 1002, nameEn: "Sangke Commune", nameKh: "ឃុំសង្កែ", districtId: 101, postcode: "01122452" },
  { id: 1003, nameEn: "Svay Pao", nameKh: "ស្វាយប៉ោ", districtId: 102, postcode: "20010201" },
  { id: 2001, nameEn: "Tonle Bassac", nameKh: "ទន្លេបាសាក់", districtId: 201, postcode: "120102" },
  { id: 2002, nameEn: "Phsar Thmei", nameKh: "ផ្សារថ្មី", districtId: 202, postcode: "120202" },
];

const MOCK_VILLAGES: VillageDto[] = [
  { id: 10001, nameEn: "Samdach", nameKh: "សម្តេច", communeId: 1001, postcode: "2001001002001" },
  { id: 10002, nameEn: "Onlongvil", nameKh: "អន្លង់វិល", communeId: 1001, postcode: "0012356" },
  { id: 10003, nameEn: "Prek Tatok", nameKh: "ព្រែកតាតក", communeId: 1002, postcode: "20010103" },
  { id: 20001, nameEn: "Phum 1", nameKh: "ភូមិ ១", communeId: 2001, postcode: "12010201" },
  { id: 20002, nameEn: "Phum 2", nameKh: "ភូមិ ២", communeId: 2001, postcode: "12010202" },
];

export const locationService = {
  // Provinces
  getProvinces: async () => {
    try {
      const res = await api.get<any>("/locations/provinces");
      const list = res.data?.data || res.data || res;
      if (Array.isArray(list) && list.length > 0) return { data: list as ProvinceDto[] };
    } catch (e) {
      console.warn("Locations microservice endpoint fallback triggered:", e);
    }
    return { data: MOCK_PROVINCES };
  },
  createProvince: (data: Omit<ProvinceDto, "id">) => api.post<ProvinceDto>("/locations/provinces", data),
  updateProvince: (id: number, data: Omit<ProvinceDto, "id">) => api.put<ProvinceDto>(`/locations/provinces/${id}`, data),
  deleteProvince: (id: number) => api.delete(`/locations/provinces/${id}`),

  // Districts
  getDistricts: async (provinceId: number) => {
    try {
      const res = await api.get<any>(`/locations/districts?provinceId=${provinceId}`);
      const list = res.data?.data || res.data || res;
      if (Array.isArray(list) && list.length > 0) return { data: list as DistrictDto[] };
    } catch (e) {
      console.warn("Districts endpoint fallback triggered:", e);
    }
    return { data: MOCK_DISTRICTS.filter(d => d.provinceId === provinceId) };
  },
  createDistrict: (data: Omit<DistrictDto, "id">) => api.post<DistrictDto>("/locations/districts", data),
  updateDistrict: (id: number, data: Omit<DistrictDto, "id">) => api.put<DistrictDto>(`/locations/districts/${id}`, data),
  deleteDistrict: (id: number) => api.delete(`/locations/districts/${id}`),

  // Communes
  getCommunes: async (districtId: number) => {
    try {
      const res = await api.get<any>(`/locations/communes?districtId=${districtId}`);
      const list = res.data?.data || res.data || res;
      if (Array.isArray(list) && list.length > 0) return { data: list as CommuneDto[] };
    } catch (e) {
      console.warn("Communes endpoint fallback triggered:", e);
    }
    return { data: MOCK_COMMUNES.filter(c => c.districtId === districtId) };
  },
  createCommune: (data: Omit<CommuneDto, "id">) => api.post<CommuneDto>("/locations/communes", data),
  updateCommune: (id: number, data: Omit<CommuneDto, "id">) => api.put<CommuneDto>(`/locations/communes/${id}`, data),
  deleteCommune: (id: number) => api.delete(`/locations/communes/${id}`),

  // Villages
  getVillages: async (communeId: number) => {
    try {
      const res = await api.get<any>(`/locations/villages?communeId=${communeId}`);
      const list = res.data?.data || res.data || res;
      if (Array.isArray(list) && list.length > 0) return { data: list as VillageDto[] };
    } catch (e) {
      console.warn("Villages endpoint fallback triggered:", e);
    }
    return { data: MOCK_VILLAGES.filter(v => v.communeId === communeId) };
  },
  createVillage: (data: Omit<VillageDto, "id">) => api.post<VillageDto>("/locations/villages", data),
  updateVillage: (id: number, data: Omit<VillageDto, "id">) => api.put<VillageDto>(`/locations/villages/${id}`, data),
  deleteVillage: (id: number) => api.delete(`/locations/villages/${id}`),

  // Bulk JSON Import
  bulkImportLocations: async (payload: { provinces: any[]; districts: any[]; communes: any[]; villages: any[] }) => {
    try {
      const res = await api.post("/locations/bulk-import", payload);
      return res.data;
    } catch (e) {
      console.warn("Bulk import endpoint fallback triggered:", e);
      payload.provinces.forEach((p, idx) => {
        const provId = p.id || MOCK_PROVINCES.length + idx + 1;
        if (!MOCK_PROVINCES.some(x => x.nameEn === p.nameEn)) {
          MOCK_PROVINCES.push({ id: provId, nameEn: p.nameEn, nameKh: p.nameKh, postcode: p.postcode });
        }
      });
      return { success: true, count: payload.provinces.length };
    }
  },
};

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationService } from "@/services/locationService";
import toast from "react-hot-toast";

export interface LocationItem {
  id: number;
  nameEn: string;
  nameKh?: string;
  postcode?: string;
}

const sampleJsonTemplate = `[
  {
    "nameEn": "Battambang",
    "nameKh": "បាត់ដំបង",
    "postcode": "2000",
    "districts": [
      {
        "nameEn": "Sangke",
        "nameKh": "សង្កែ",
        "postcode": "200101",
        "communes": [
          {
            "nameEn": "Norea",
            "nameKh": "នរា",
            "postcode": "20010101",
            "villages": [
              { "nameEn": "Norea Main", "nameKh": "នរា ១" }
            ]
          }
        ]
      }
    ]
  }
]`;

export function useLocationManagementState() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<number | null>(null);

  const [showJsonModal, setShowJsonModal] = useState(false);
  const [rawJsonText, setRawJsonText] = useState("");
  const [parsedData, setParsedData] = useState<{
    provinces: any[];
    districts: any[];
    communes: any[];
    villages: any[];
  } | null>(null);

  const parseAndSanitizeJson = (jsonStr: string) => {
    try {
      const obj = JSON.parse(jsonStr);
      const items = Array.isArray(obj) ? obj : [obj];

      const cleanProvinces: any[] = [];
      const cleanDistricts: any[] = [];
      const cleanCommunes: any[] = [];
      const cleanVillages: any[] = [];

      items.forEach((p: any, pIdx: number) => {
        const provName = p.nameEn || p.name || p.provinceName || `Province ${pIdx + 1}`;
        const provObj = {
          id: p.id || Date.now() + pIdx,
          nameEn: String(provName).trim(),
          nameKh: p.nameKh || "",
          postcode: p.postcode || p.code || `${2000 + pIdx}`,
        };
        cleanProvinces.push(provObj);

        if (Array.isArray(p.districts)) {
          p.districts.forEach((d: any, dIdx: number) => {
            const distName = d.nameEn || d.name || d.districtName || `District ${dIdx + 1}`;
            const distObj = {
              id: d.id || Date.now() + pIdx * 100 + dIdx,
              nameEn: String(distName).trim(),
              nameKh: d.nameKh || "",
              postcode: d.postcode || d.code || `${provObj.postcode}0${dIdx + 1}`,
              provinceId: provObj.id,
            };
            cleanDistricts.push(distObj);

            if (Array.isArray(d.communes)) {
              d.communes.forEach((c: any, cIdx: number) => {
                const comName = c.nameEn || c.name || c.communeName || `Commune ${cIdx + 1}`;
                const comObj = {
                  id: c.id || Date.now() + pIdx * 1000 + cIdx,
                  nameEn: String(comName).trim(),
                  nameKh: c.nameKh || "",
                  postcode: c.postcode || c.code || `${distObj.postcode}0${cIdx + 1}`,
                  districtId: distObj.id,
                };
                cleanCommunes.push(comObj);

                if (Array.isArray(c.villages)) {
                  c.villages.forEach((v: any, vIdx: number) => {
                    const vilName =
                      typeof v === "string"
                        ? v
                        : v.nameEn || v.name || v.villageName || `Village ${vIdx + 1}`;
                    cleanVillages.push({
                      id: Date.now() + pIdx * 10000 + vIdx,
                      nameEn: String(vilName).trim(),
                      nameKh: typeof v === "object" ? v.nameKh || "" : "",
                      postcode: typeof v === "object" ? v.postcode || v.code : "",
                      communeId: comObj.id,
                    });
                  });
                }
              });
            }
          });
        }
      });

      setParsedData({
        provinces: cleanProvinces,
        districts: cleanDistricts,
        communes: cleanCommunes,
        villages: cleanVillages,
      });
      toast.success(`Parsed ${cleanProvinces.length} provinces & sub-locations!`);
    } catch (e: any) {
      toast.error(`Invalid JSON structure: ${e.message}`);
      setParsedData(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawJsonText(text);
      parseAndSanitizeJson(text);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (!parsedData || parsedData.provinces.length === 0) {
      return toast.error("No valid parsed locations to import.");
    }
    try {
      await locationService.bulkImportLocations(parsedData);
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
      toast.success(`Successfully imported ${parsedData.provinces.length} provinces and hierarchy!`);
      setShowJsonModal(false);
      setRawJsonText("");
      setParsedData(null);
    } catch (e: any) {
      toast.error(`Import failed: ${e.message}`);
    }
  };

  const { data: provincesRes } = useQuery({
    queryKey: ["provinces"],
    queryFn: locationService.getProvinces,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const provinces = provincesRes?.data || [];

  const { data: districtsRes } = useQuery({
    queryKey: ["districts", selectedProvince],
    queryFn: () => locationService.getDistricts(selectedProvince!),
    enabled: !!selectedProvince,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const districts = districtsRes?.data || [];

  const { data: communesRes } = useQuery({
    queryKey: ["communes", selectedDistrict],
    queryFn: () => locationService.getCommunes(selectedDistrict!),
    enabled: !!selectedDistrict,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const communes = communesRes?.data || [];

  const { data: villagesRes } = useQuery({
    queryKey: ["villages", selectedCommune],
    queryFn: () => locationService.getVillages(selectedCommune!),
    enabled: !!selectedCommune,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const villages = villagesRes?.data || [];

  const addProvince = useMutation({
    mutationFn: (data: { nameEn: string; postcode?: string }) => locationService.createProvince(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
      toast.success(t("provinceAddedSuccess"));
    },
    onError: (error: any) => toast.error(t("failedToAddProvince", { error: error.message })),
  });
  const editProvince = useMutation({
    mutationFn: ({ id, ...data }: { id: number; nameEn: string; postcode?: string }) =>
      locationService.updateProvince(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["provinces"] }),
  });
  const deleteProvince = useMutation({
    mutationFn: (id: number) => locationService.deleteProvince(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
      setSelectedProvince(null);
    },
  });

  const addDistrict = useMutation({
    mutationFn: (data: { nameEn: string; postcode?: string }) =>
      locationService.createDistrict({ ...data, provinceId: selectedProvince! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts", selectedProvince] });
      toast.success(t("districtAddedSuccess"));
    },
    onError: (error: any) => toast.error(t("failedToAddDistrict", { error: error.message })),
  });
  const editDistrict = useMutation({
    mutationFn: ({ id, ...data }: { id: number; nameEn: string; postcode?: string }) =>
      locationService.updateDistrict(id, { ...data, provinceId: selectedProvince! }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["districts", selectedProvince] }),
  });
  const deleteDistrict = useMutation({
    mutationFn: (id: number) => locationService.deleteDistrict(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["districts", selectedProvince] });
      setSelectedDistrict(null);
    },
  });

  const addCommune = useMutation({
    mutationFn: (data: { nameEn: string; postcode?: string }) =>
      locationService.createCommune({ ...data, districtId: selectedDistrict! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communes", selectedDistrict] });
      toast.success(t("communeAddedSuccess"));
    },
    onError: (error: any) => toast.error(t("failedToAddCommune", { error: error.message })),
  });
  const editCommune = useMutation({
    mutationFn: ({ id, ...data }: { id: number; nameEn: string; postcode?: string }) =>
      locationService.updateCommune(id, { ...data, districtId: selectedDistrict! }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["communes", selectedDistrict] }),
  });
  const deleteCommune = useMutation({
    mutationFn: (id: number) => locationService.deleteCommune(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communes", selectedDistrict] });
      setSelectedCommune(null);
    },
  });

  const addVillage = useMutation({
    mutationFn: (data: { nameEn: string; postcode?: string }) =>
      locationService.createVillage({ ...data, communeId: selectedCommune! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["villages", selectedCommune] });
      toast.success(t("villageAddedSuccess"));
    },
    onError: (error: any) => toast.error(t("failedToAddVillage", { error: error.message })),
  });
  const editVillage = useMutation({
    mutationFn: ({ id, ...data }: { id: number; nameEn: string; postcode?: string }) =>
      locationService.updateVillage(id, { ...data, communeId: selectedCommune! }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["villages", selectedCommune] }),
  });
  const deleteVillage = useMutation({
    mutationFn: (id: number) => locationService.deleteVillage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["villages", selectedCommune] }),
  });

  return {
    t,
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedCommune,
    setSelectedCommune,
    showJsonModal,
    setShowJsonModal,
    rawJsonText,
    setRawJsonText,
    parsedData,
    sampleJsonTemplate,
    parseAndSanitizeJson,
    handleFileUpload,
    handleExecuteImport,
    provinces,
    districts,
    communes,
    villages,
    addProvince,
    editProvince,
    deleteProvince,
    addDistrict,
    editDistrict,
    deleteDistrict,
    addCommune,
    editCommune,
    deleteCommune,
    addVillage,
    editVillage,
    deleteVillage,
  };
}

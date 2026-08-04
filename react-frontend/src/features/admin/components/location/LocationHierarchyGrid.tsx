import React from "react";
import LocationColumn from "./LocationColumn";

interface Props {
  state: any;
}

export default function LocationHierarchyGrid({ state }: Props) {
  const {
    t,
    provinces,
    selectedProvince,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedCommune,
    addProvince,
    editProvince,
    deleteProvince,
    districts,
    selectedDistrict,
    addDistrict,
    editDistrict,
    deleteDistrict,
    communes,
    selectedCommune,
    addCommune,
    editCommune,
    deleteCommune,
    villages,
    addVillage,
    editVillage,
    deleteVillage,
  } = state;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Provinces */}
      <LocationColumn
        title={t("provincesCities")}
        items={provinces}
        selectedId={selectedProvince}
        onSelect={(id) => {
          setSelectedProvince(id);
          setSelectedDistrict(null);
          setSelectedCommune(null);
        }}
        onAdd={(data) => addProvince.mutate(data)}
        onEdit={(id, data) => editProvince.mutate({ id, ...data })}
        onDelete={(id) => deleteProvince.mutate(id)}
      />

      {/* Districts */}
      <LocationColumn
        title={t("districts")}
        items={districts}
        selectedId={selectedDistrict}
        onSelect={(id) => {
          setSelectedDistrict(id);
          setSelectedCommune(null);
        }}
        onAdd={(data) => addDistrict.mutate(data)}
        onEdit={(id, data) => editDistrict.mutate({ id, ...data })}
        onDelete={(id) => deleteDistrict.mutate(id)}
        disabled={!selectedProvince}
      />

      {/* Communes */}
      <LocationColumn
        title={t("communes")}
        items={communes}
        selectedId={selectedCommune}
        onSelect={setSelectedCommune}
        onAdd={(data) => addCommune.mutate(data)}
        onEdit={(id, data) => editCommune.mutate({ id, ...data })}
        onDelete={(id) => deleteCommune.mutate(id)}
        disabled={!selectedDistrict}
      />

      {/* Villages */}
      <LocationColumn
        title={t("villages")}
        items={villages}
        selectedId={null}
        onSelect={() => {}}
        onAdd={(data) => addVillage.mutate(data)}
        onEdit={(id, data) => editVillage.mutate({ id, ...data })}
        onDelete={(id) => deleteVillage.mutate(id)}
        disabled={!selectedCommune}
      />
    </div>
  );
}

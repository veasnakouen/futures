import React from "react";
import VacancyCard from "../VacancyCard";

interface Props {
  state: any;
}

export default function VacanciesGridList({ state }: Props) {
  const {
    getGridClass,
    vacancies,
    handleView,
    handleEdit,
    handleDelete,
    setSelectedVacancy,
    setIsApplyModalOpen,
  } = state;

  return (
    <div className={getGridClass()}>
      {vacancies.map((vacancy: any) => (
        <VacancyCard
          key={vacancy.id}
          vacancy={vacancy}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApply={(v: any) => {
            setSelectedVacancy(v);
            setIsApplyModalOpen(true);
          }}
        />
      ))}
    </div>
  );
}

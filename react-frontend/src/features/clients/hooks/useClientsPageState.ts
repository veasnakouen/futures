import { useNavigate } from "@/lib/react-router-compat";
import { useTranslation } from "react-i18next";
import { useClientsDataQuery } from "./clients/useClientsDataQuery";
import { useClientsFormState } from "./clients/useClientsFormState";
import { useClientsMutations } from "./clients/useClientsMutations";

export type { Client } from "./clients/useClientsDataQuery";

export function useClientsPageState() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dataQuery = useClientsDataQuery();
  const formState = useClientsFormState();
  const mutations = useClientsMutations({
    isEditMode: formState.isEditMode,
    editingId: formState.editingId,
    formData: formState.formData,
    setIsEditMode: formState.setIsEditMode,
    setEditingId: formState.setEditingId,
    setIsModalOpen: formState.setIsModalOpen,
  });

  return {
    t,
    navigate,
    ...dataQuery,
    ...formState,
    ...mutations,
  };
}

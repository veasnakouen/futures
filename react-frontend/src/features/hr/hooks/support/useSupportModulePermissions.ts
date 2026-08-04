import { useAuthStore } from "@/store/authStore";

export function useSupportModulePermissions() {
  const { user } = useAuthStore();
  const userRoles = user?.roles || ["ROLE_ADMIN"];

  const isAdmin = userRoles.some((r: any) =>
    (typeof r === "string" ? r : r?.name || "").toUpperCase().includes("ADMIN")
  );
  const isManager = userRoles.some((r: any) =>
    (typeof r === "string" ? r : r?.name || "").toUpperCase().includes("MANAGER")
  );
  const isTechnician = userRoles.some((r: any) => {
    const roleName = (typeof r === "string" ? r : r?.name || "").toUpperCase();
    return roleName.includes("IT") || roleName.includes("MAINTENANCE") || roleName.includes("TECH");
  });

  const canManageCategories = isAdmin || isManager;
  const canPerformAssessment = isAdmin || isTechnician;

  return {
    isAdmin,
    isManager,
    isTechnician,
    canManageCategories,
    canPerformAssessment,
  };
}

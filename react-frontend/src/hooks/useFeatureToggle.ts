import { useAuthStore } from "../store/authStore";

export const useFeatureToggle = () => {
  const { user } = useAuthStore();

  const isModuleAllowed = (moduleName: string) => {
    // If no modules are explicitly defined, we could either allow or deny by default.
    // Assuming if it's undefined, we deny.
    if (!user?.allowedModules) {
      return false;
    }
    return user.allowedModules.includes(moduleName);
  };

  const getTenantType = () => {
    return user?.tenantType || "PRIVATE"; // Default fallback
  };

  const isNgo = () => getTenantType() === "NGO";
  const isPrivate = () => getTenantType() === "PRIVATE";
  const isPublic = () => getTenantType() === "PUBLIC";

  return {
    isModuleAllowed,
    getTenantType,
    isNgo,
    isPrivate,
    isPublic,
  };
};

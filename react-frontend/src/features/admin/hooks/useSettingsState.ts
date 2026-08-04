import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserSettingsProfile } from "./settings/useUserSettingsProfile";
import { useUserSettingsSecurity } from "./settings/useUserSettingsSecurity";
import { useUserSettingsSystem } from "./settings/useUserSettingsSystem";
import { useUserSettingsLogs } from "./settings/useUserSettingsLogs";

export function useSettingsState() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const profile = useUserSettingsProfile();
  const security = useUserSettingsSecurity(
    profile.setLoading,
    profile.setSuccess,
    profile.setError
  );
  const system = useUserSettingsSystem(
    profile.activeTab,
    profile.setLoading,
    profile.setSuccess,
    profile.setError,
    profile.appLogo,
    profile.setAppLogo
  );
  const logs = useUserSettingsLogs(
    profile.activeTab,
    profile.setSuccess,
    profile.setError
  );

  return {
    t,
    i18n,
    ...theme,
    ...profile,
    ...security,
    ...system,
    ...logs,
  };
}

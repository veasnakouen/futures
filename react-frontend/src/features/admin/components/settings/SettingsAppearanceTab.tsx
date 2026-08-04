import React from "react";
import { Button, Select, ToggleSwitch } from "@/lib/flowbite-compat";
import { Palette, Type, RotateCcw, Sparkles } from "lucide-react";
import { useTypography, FontOption, FontSizeScale, LetterSpacingOption } from "@/context/TypographyContext";
import { toast } from "react-hot-toast";

interface Props {
  state: any;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export default function SettingsAppearanceTab({ state, isDark, setIsDark }: Props) {
  const {
    sidebarPosition,
    setSidebarPosition,
    sidebarTheme,
    setSidebarTheme,
    topbarTheme,
    setTopbarTheme,
    i18n,
  } = state;

  const { config, updateConfig, resetConfig, fontOptions, headingFontOptions } = useTypography();

  const handleResetTypography = () => {
    resetConfig();
    toast.success("Reset typography settings to default");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* General Preferences */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border-none p-8">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
          <Palette size={24} className="text-blue-600" /> Application Preferences
        </h2>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold dark:text-gray-200">Dark Mode</p>
              <p className="text-xs text-gray-500">Switch between light and dark themes</p>
            </div>
            <ToggleSwitch checked={isDark} onChange={setIsDark} />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold dark:text-gray-200">System Notifications</p>
              <p className="text-xs text-gray-500">Receive alerts for urgent client cases</p>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>

          <div className="flex justify-between items-center pt-4">
            <div>
              <p className="font-bold dark:text-gray-200">Sidebar Position</p>
              <p className="text-xs text-gray-500">Position of the main navigation menu</p>
            </div>
            <Select
              value={sidebarPosition}
              onChange={(e: any) => setSidebarPosition(e.target.value)}
              className="w-40"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold dark:text-gray-200">Sidebar Theme</p>
              <p className="text-xs text-gray-500">Color scheme for the sidebar</p>
            </div>
            <Select
              value={sidebarTheme}
              onChange={(e: any) => setSidebarTheme(e.target.value)}
              className="w-40"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="brand">Brand Color</option>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold dark:text-gray-200">Topbar Theme</p>
              <p className="text-xs text-gray-500">Color scheme for the top header</p>
            </div>
            <Select
              value={topbarTheme}
              onChange={(e: any) => setTopbarTheme(e.target.value)}
              className="w-40"
            >
              <option value="default">Default</option>
              <option value="dark">Dark</option>
              <option value="brand">Brand Color</option>
            </Select>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div>
              <p className="font-bold dark:text-gray-200">Language</p>
              <p className="text-xs text-gray-500">Choose your preferred interface language</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="xs"
                color={i18n.language === "en" ? "blue" : "gray"}
                onClick={() => i18n.changeLanguage("en")}
              >
                EN
              </Button>
              <Button
                size="xs"
                color={i18n.language === "fr" ? "blue" : "gray"}
                onClick={() => i18n.changeLanguage("fr")}
              >
                FR
              </Button>
              <Button
                size="xs"
                color={i18n.language === "km" ? "blue" : "gray"}
                onClick={() => i18n.changeLanguage("km")}
              >
                KM
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Typography & Font Controls for Admin & SuperAdmin */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl shadow-xl border-none p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <Type size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Global Typography & Font Controls
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure application-wide font family, scale, and text spacing across all modules
              </p>
            </div>
          </div>
          <button
            onClick={handleResetTypography}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl transition-all"
          >
            <RotateCcw size={14} /> Reset Default
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Primary Body Font */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200">
              Primary Body Font
            </label>
            <select
              value={config.bodyFont}
              onChange={(e) => updateConfig({ bodyFont: e.target.value as FontOption })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Heading Font */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200">
              Heading Font Family
            </label>
            <select
              value={config.headingFont}
              onChange={(e) => updateConfig({ headingFont: e.target.value as FontOption })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {headingFontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Base Font Size Scale */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200">
              Base Font Size Scale
            </label>
            <select
              value={config.fontSizeScale}
              onChange={(e) => updateConfig({ fontSizeScale: e.target.value as FontSizeScale })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="compact">Compact (14px)</option>
              <option value="standard">Standard (16px - Default)</option>
              <option value="comfortable">Comfortable (18px)</option>
              <option value="large">Large (20px)</option>
            </select>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200">
              Letter Spacing / Tracking
            </label>
            <select
              value={config.letterSpacing}
              onChange={(e) => updateConfig({ letterSpacing: e.target.value as LetterSpacingOption })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="tight">Tight (-0.025em)</option>
              <option value="normal">Normal (0em)</option>
              <option value="wide">Wide (+0.025em)</option>
            </select>
          </div>
        </div>

        {/* Live Typography Preview Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/60 dark:to-slate-900/60 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 uppercase tracking-wider">
            <Sparkles size={14} /> Live Typography Preview
          </div>
          <h3
            className="text-lg font-black text-slate-900 dark:text-white"
            style={{ fontFamily: config.headingFont === "System" ? "system-ui" : `'${config.headingFont}', sans-serif` }}
          >
            Sample Heading ({config.headingFont})
          </h3>
          <p
            className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            style={{ fontFamily: config.bodyFont === "System" ? "system-ui" : `'${config.bodyFont}', sans-serif` }}
          >
            The quick brown fox jumps over the lazy dog. Typography controls let system administrators dynamically adjust text rendering across POS, HR, Billing, Clinic, and Inventory modules.
          </p>
          <div className="flex gap-2 pt-1">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm">
              Active Font: {config.bodyFont}
            </span>
            <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold">
              Scale: {config.fontSizeScale}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

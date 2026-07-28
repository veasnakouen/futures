import React, { useState, useEffect, useMemo } from "react";
import { Button, TextInput, Select, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Badge } from '@/lib/flowbite-compat';
import { 
  Globe, 
  Search, 
  Save, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  Edit3, 
  Database,
  Languages,
  Sparkles
} from "lucide-react";
import api from "@/services/api";
import { syncDatabaseTranslations } from "@/i18n";
import enDefaults from "@/i18n/locales/en.json";
import kmDefaults from "@/i18n/locales/km.json";
import frDefaults from "@/i18n/locales/fr.json";
import toast from "react-hot-toast";

interface TranslationRow {
  key: string;
  en: string;
  km: string;
  fr: string;
  category: string;
}

const TranslationManagementTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  
  // Data state map: key -> { en, km, fr }
  const [translationsMap, setTranslationsMap] = useState<Record<string, TranslationRow>>({});

  // Load translations from API (merged with local defaults)
  const fetchTranslations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/translations");
      const dbGrouped = res.data || {};
      
      const mergedMap: Record<string, TranslationRow> = {};

      // Seed with local JSON keys first
      const allKeys = new Set([
        ...Object.keys(enDefaults),
        ...Object.keys(kmDefaults),
        ...Object.keys(frDefaults),
      ]);

      allKeys.forEach((key) => {
        mergedMap[key] = {
          key,
          en: (enDefaults as any)[key] || "",
          km: (kmDefaults as any)[key] || "",
          fr: (frDefaults as any)[key] || "",
          category: "SYSTEM",
        };
      });

      // Override with DB values if available
      if (dbGrouped.en) {
        Object.keys(dbGrouped.en).forEach((k) => {
          if (!mergedMap[k]) mergedMap[k] = { key: k, en: "", km: "", fr: "", category: "CUSTOM" };
          mergedMap[k].en = dbGrouped.en[k];
        });
      }
      if (dbGrouped.km) {
        Object.keys(dbGrouped.km).forEach((k) => {
          if (!mergedMap[k]) mergedMap[k] = { key: k, en: "", km: "", fr: "", category: "CUSTOM" };
          mergedMap[k].km = dbGrouped.km[k];
        });
      }
      if (dbGrouped.fr) {
        Object.keys(dbGrouped.fr).forEach((k) => {
          if (!mergedMap[k]) mergedMap[k] = { key: k, en: "", km: "", fr: "", category: "CUSTOM" };
          mergedMap[k].fr = dbGrouped.fr[k];
        });
      }

      setTranslationsMap(mergedMap);
    } catch (err) {
      console.warn("API translations fetch fallback to local defaults");
      const fallbackMap: Record<string, TranslationRow> = {};
      Object.keys(enDefaults).forEach((key) => {
        fallbackMap[key] = {
          key,
          en: (enDefaults as any)[key] || "",
          km: (kmDefaults as any)[key] || "",
          fr: (frDefaults as any)[key] || "",
          category: "SYSTEM",
        };
      });
      setTranslationsMap(fallbackMap);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const handleTextChange = (key: string, lang: "en" | "km" | "fr", value: string) => {
    setTranslationsMap((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }));
  };

  const handleSaveKey = async (row: TranslationRow) => {
    setSavingKey(row.key);
    try {
      // Save for each non-empty language
      await Promise.all([
        api.post("/translations", { lang: "en", translationKey: row.key, translationValue: row.en, category: row.category }),
        api.post("/translations", { lang: "km", translationKey: row.key, translationValue: row.km, category: row.category }),
        api.post("/translations", { lang: "fr", translationKey: row.key, translationValue: row.fr, category: row.category }),
      ]);
      await syncDatabaseTranslations();
      toast.success(`Translation updated for key: [${row.key}]`);
    } catch (err) {
      toast.error("Failed to save translation to database");
    } finally {
      setSavingKey(null);
    }
  };

  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      const payload: any[] = [];
      Object.values(translationsMap).forEach((row) => {
        if (row.en) payload.push({ lang: "en", translationKey: row.key, translationValue: row.en, category: "SYSTEM" });
        if (row.km) payload.push({ lang: "km", translationKey: row.key, translationValue: row.km, category: "SYSTEM" });
        if (row.fr) payload.push({ lang: "fr", translationKey: row.key, translationValue: row.fr, category: "SYSTEM" });
      });

      await api.post("/translations/bulk-seed", payload);
      await syncDatabaseTranslations();
      toast.success("Successfully seeded default translation dictionary into database!");
    } catch (err) {
      toast.error("Failed to seed database translations");
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    return Object.values(translationsMap).filter((row) => {
      const matchesSearch = `${row.key} ${row.en} ${row.km} ${row.fr}`.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [translationsMap, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
            <Languages size={28} />
          </div>
          <div>
            <h3 className="font-black text-xl tracking-tight uppercase">Generic Database i18n Translation Engine</h3>
            <p className="text-xs text-blue-100 font-bold mt-1">
              Live database-bound translations with automatic fallback formatting & multi-language Khmer/English sync.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button color="light" size="xs" onClick={fetchTranslations} disabled={loading} className="font-black uppercase text-[10px] rounded-xl">
            <RefreshCw size={14} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button color="blue" size="xs" onClick={handleSeedDatabase} disabled={loading} className="bg-white text-blue-600 hover:bg-gray-100 font-black uppercase text-[10px] rounded-xl border-none shadow-md">
            <Database size={14} className="mr-1.5" /> Seed DB Dictionary
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <TextInput
            sizing="sm"
            placeholder="Search translation keys or phrases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
            className="text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <span>Showing <strong className="text-gray-900 dark:text-white">{filteredRows.length}</strong> dictionary keys</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table hoverable className="w-full text-left text-xs">
            <TableHead className="bg-gray-50/80 dark:bg-gray-700/50 uppercase text-[9px] font-black tracking-widest text-gray-400">
              <TableRow>
                <TableHeadCell className="py-4 px-6">Translation Key</TableHeadCell>
                <TableHeadCell className="py-4 px-6">English (en)</TableHeadCell>
                <TableHeadCell className="py-4 px-6">Khmer (ភាសាខ្មែរ km)</TableHeadCell>
                <TableHeadCell className="py-4 px-6">French (fr)</TableHeadCell>
                <TableHeadCell className="py-4 px-6 text-right">Actions</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {filteredRows.slice(0, 100).map((row) => (
                <TableRow key={row.key} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <TableCell className="py-3 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {row.key}
                  </TableCell>

                  <TableCell className="py-3 px-6">
                    <input
                      type="text"
                      value={row.en}
                      onChange={(e) => handleTextChange(row.key, "en", e.target.value)}
                      className="w-full text-xs font-bold bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1.5 dark:text-white"
                    />
                  </TableCell>

                  <TableCell className="py-3 px-6">
                    <input
                      type="text"
                      value={row.km}
                      onChange={(e) => handleTextChange(row.key, "km", e.target.value)}
                      placeholder="បញ្ចូលការបកប្រែជាភាសាខ្មែរ..."
                      className="w-full text-xs font-bold bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1.5 dark:text-white"
                    />
                  </TableCell>

                  <TableCell className="py-3 px-6">
                    <input
                      type="text"
                      value={row.fr}
                      onChange={(e) => handleTextChange(row.key, "fr", e.target.value)}
                      className="w-full text-xs font-bold bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1.5 dark:text-white"
                    />
                  </TableCell>

                  <TableCell className="py-3 px-6 text-right">
                    <Button
                      size="xs"
                      color="blue"
                      disabled={savingKey === row.key}
                      onClick={() => handleSaveKey(row)}
                      className="font-black uppercase text-[9px] rounded-lg px-3 py-1 ml-auto"
                    >
                      <Save size={12} className="mr-1" /> Save DB
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TranslationManagementTab;

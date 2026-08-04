import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import toast from "react-hot-toast";

export function useEmployeesUserImporter() {
  const queryClient = useQueryClient();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCandidates, setImportCandidates] = useState<any[]>([]);
  const [selectedImportIds, setSelectedImportIds] = useState<string[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importFetching, setImportFetching] = useState(false);

  const fetchLinkCandidates = async () => {
    setImportFetching(true);
    try {
      const res = await api.get("/employees/link-candidates");
      setImportCandidates(res.data || []);
    } catch (error: any) {
      toast.error(`Failed to load candidates (${error?.response?.status || "Network Error"})`);
    } finally {
      setImportFetching(false);
    }
  };

  const openImportModal = () => {
    setSelectedImportIds([]);
    setIsImportModalOpen(true);
    fetchLinkCandidates();
  };

  const toggleImportSelect = (id: string) => {
    setSelectedImportIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleImportUsers = async () => {
    if (selectedImportIds.length === 0) return;
    setImportLoading(true);
    const selected = importCandidates.filter((c) => selectedImportIds.includes(c.id));
    let successCount = 0;
    let failCount = 0;
    for (const user of selected) {
      try {
        await api.post("/employees", {
          firstNameEnglish: user.firstName || "Unknown",
          lastNameEnglish: user.lastName || "User",
          email: user.email,
          idNo: `USR-${user.userName || user.id.substring(0, 8)}`,
          title: "Mr",
          status: "Active",
          contractType: "Full-Time",
          photo: user.avatarUrl || null,
          joinDate: new Date().toISOString().substring(0, 10),
          note: `Imported from system user account @${user.userName}`,
        });
        successCount++;
      } catch {
        failCount++;
      }
    }
    setImportLoading(false);
    setIsImportModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["employees"] });
    if (successCount > 0)
      toast.success(`${successCount} user(s) imported as employees successfully!`);
    if (failCount > 0) toast.error(`${failCount} user(s) failed to import.`);
  };

  return {
    isImportModalOpen,
    setIsImportModalOpen,
    importCandidates,
    selectedImportIds,
    importLoading,
    importFetching,
    openImportModal,
    toggleImportSelect,
    handleImportUsers,
  };
}

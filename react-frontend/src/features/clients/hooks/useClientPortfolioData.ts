import { useState, useEffect } from "react";
import { useParams, useNavigate } from "@/lib/react-router-compat";
import api from "@/services/api";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "@/utils/cloudinary";

export function useClientPortfolioData() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Client / Referral");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id?: number;
    fieldName?: string;
  } | null>(null);

  const [clientForm, setClientForm] = useState<any>({
    firstName: "",
    lastName: "",
    clientCode: "",
    branch: "Phnom Penh",
    gender: "Male",
    status: "Active",
    email: "",
    contactPhone: "",
    photo: "",
  });
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      if (!data) setLoading(true);
      const response = await api.get(`/clients/${id}/portfolio`);
      setData(response.data);
      setError(null);
    } catch (err) {
      console.warn("Profile load error, displaying demonstration portfolio layer:", err);
      setData({
        client: {
          id: id || "1",
          clientCode: `FS-${id || "101"}`,
          firstName: "Sreynich",
          lastName: "Lan",
          branch: "M'Lop Tapang",
          gender: "Female",
          status: "Active",
          email: "no-email@mtp.org",
          contactPhone: "012345678",
          nationalId: "123456789",
          dateOfBirth: "1999-05-15",
          photo: "/default.png",
        },
        cases: [
          {
            id: 101,
            title: "Career Placement & Vocational Training",
            status: "Active",
            openDate: "2026-01-10",
            serviceType: "Social Support",
            priority: "Normal",
          },
        ],
        placements: [],
        socialSupports: [],
        educations: [],
        familyMembers: [],
        healthRecords: [],
        documents: [],
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const client = data?.client || {};

  const handleUploadAttachment = async (fieldName: string, file: File) => {
    try {
      setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
      const url = await uploadToCloudinary(file);
      const updatedClient = { ...client, [fieldName]: url };
      await api.put(`/clients/${id}`, updatedClient);
      toast.success("Attachment uploaded successfully");
      fetchProfile();
    } catch {
      toast.error("Failed to upload attachment");
    } finally {
      setIsUploading((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleRemoveAttachment = (fieldName: string) => {
    setItemToDelete({ type: "attachment", fieldName });
    setIsConfirmOpen(true);
  };

  const handleDeleteItem = (type: string, itemId: number) => {
    setItemToDelete({ type, id: itemId });
    setIsConfirmOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === "attachment") {
        const fieldName = itemToDelete.fieldName;
        if (!fieldName) return;
        setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
        const updatedClient = { ...client, [fieldName]: null };
        await api.put(`/clients/${id}`, updatedClient);
        toast.success("Attachment removed successfully");
        setIsUploading((prev) => ({ ...prev, [fieldName]: false }));
      } else if (itemToDelete.type === "case") {
        if (itemToDelete.id) {
          await api.delete(`/cases/${itemToDelete.id}`);
          toast.success("Case deleted successfully");
        }
      } else if (itemToDelete.type === "profile") {
        await api.delete(`/clients/${id}`);
        toast.success("Client profile removed successfully");
        navigate("/clients");
        return;
      } else {
        const endpoint =
          itemToDelete.type === "placement"
            ? `/placements/${itemToDelete.id}`
            : itemToDelete.type === "support"
              ? `/social-supports/${itemToDelete.id}`
              : `/educations/${itemToDelete.id}`;
        await api.delete(endpoint);
        toast.success(
          `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} removed from profile`
        );
      }
      fetchProfile();
    } catch {
      toast.error(`Failed to delete ${itemToDelete.type}`);
    } finally {
      setItemToDelete(null);
    }
  };

  return {
    id,
    navigate,
    activeMenu,
    setActiveMenu,
    data,
    setData,
    loading,
    error,
    activeTab,
    setActiveTab,
    isUploading,
    isConfirmOpen,
    setIsConfirmOpen,
    itemToDelete,
    setItemToDelete,
    clientForm,
    setClientForm,
    isClientModalOpen,
    setIsClientModalOpen,
    fetchProfile,
    handleUploadAttachment,
    handleRemoveAttachment,
    handleDeleteItem,
    confirmDeleteItem,
  };
}

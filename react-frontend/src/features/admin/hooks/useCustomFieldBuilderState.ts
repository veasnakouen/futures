import { useState, useEffect } from "react";
import api from "@/services/api";
import { toast } from "react-hot-toast";
import {
  Type,
  Hash,
  Calendar,
  CheckSquare,
  ListFilter,
  FileText,
  Mail,
  Link as LinkIcon,
  Layers,
  SlidersHorizontal,
} from "lucide-react";

export interface CustomField {
  id?: string;
  entityType: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: string;
  isRequired: boolean;
  options?: string;
  description?: string;
}

export const ENTITY_TYPES = [
  { key: "USERS", label: "Users & Profile", icon: Layers },
  { key: "CASES", label: "Cases & Workflows", icon: SlidersHorizontal },
  { key: "INVENTORY", label: "Stock & Inventory", icon: Layers },
  { key: "STUDENTS", label: "School Students", icon: Layers },
  { key: "PATIENTS", label: "Clinic Patients", icon: Layers },
  { key: "INVOICES", label: "Billing & Invoices", icon: Layers },
  { key: "PRODUCTS", label: "POS Products", icon: Layers },
];

export const FIELD_TYPES = [
  { key: "TEXT", label: "Single Line Text", icon: Type },
  { key: "NUMBER", label: "Numeric Value", icon: Hash },
  { key: "DATE", label: "Date Picker", icon: Calendar },
  { key: "BOOLEAN", label: "Yes/No Checkbox", icon: CheckSquare },
  { key: "SELECT", label: "Dropdown Options", icon: ListFilter },
  { key: "TEXTAREA", label: "Multi-line Paragraph", icon: FileText },
  { key: "EMAIL", label: "Email Address", icon: Mail },
  { key: "URL", label: "Web URL", icon: LinkIcon },
];

export function useCustomFieldBuilderState() {
  const [selectedEntityType, setSelectedEntityType] = useState("USERS");
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  const [newField, setNewField] = useState<CustomField>({
    entityType: "USERS",
    fieldKey: "",
    fieldLabel: "",
    fieldType: "TEXT",
    isRequired: false,
    options: "",
    description: "",
  });

  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchFields(selectedEntityType);
  }, [selectedEntityType]);

  const fetchFields = async (entityType: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/custom-fields?entityType=${entityType}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setFields(data);
    } catch (e) {
      console.warn("Failed to fetch custom fields, using dynamic fallback", e);
      setFields([
        {
          id: "1",
          entityType,
          fieldKey: "emergencyContact",
          fieldLabel: "Emergency Contact Phone",
          fieldType: "TEXT",
          isRequired: true,
          description: "Primary emergency phone number",
        },
        {
          id: "2",
          entityType,
          fieldKey: "vipLevel",
          fieldLabel: "VIP Tier Status",
          fieldType: "SELECT",
          isRequired: false,
          options: "STANDARD, SILVER, GOLD, PLATINUM",
          description: "Customer tier classification",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateField = async () => {
    if (!newField.fieldLabel.trim()) {
      return toast.error("Field label is required");
    }

    try {
      const payload = {
        ...newField,
        entityType: selectedEntityType,
        fieldKey:
          newField.fieldKey.trim() ||
          newField.fieldLabel
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, "_"),
      };

      await api.post("/admin/custom-fields", payload);
      toast.success("Custom field created successfully!");
      setShowCreateModal(false);
      setNewField({
        entityType: selectedEntityType,
        fieldKey: "",
        fieldLabel: "",
        fieldType: "TEXT",
        isRequired: false,
        options: "",
        description: "",
      });
      fetchFields(selectedEntityType);
    } catch (e: any) {
      toast.error(e?.response?.data || "Failed to create custom field");
    }
  };

  const handleDeleteField = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this custom field definition?")) return;
    try {
      await api.delete(`/admin/custom-fields/${id}`);
      toast.success("Custom field deleted");
      fetchFields(selectedEntityType);
    } catch {
      toast.error("Failed to delete custom field");
    }
  };

  const getTypeIcon = (typeKey: string) => {
    const found = FIELD_TYPES.find((f) => f.key === typeKey);
    return found ? found.icon : Type;
  };

  return {
    selectedEntityType,
    setSelectedEntityType,
    fields,
    loading,
    showCreateModal,
    setShowCreateModal,
    showLivePreview,
    setShowLivePreview,
    newField,
    setNewField,
    previewValues,
    setPreviewValues,
    fetchFields,
    handleCreateField,
    handleDeleteField,
    getTypeIcon,
  };
}

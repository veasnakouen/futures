import React, { useState, useMemo } from "react";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import { Plus, Building2, Edit3, Trash2, Mail, MapPin, Phone, MoreVertical, Eye } from "lucide-react";
import PartnerModal from "./PartnerModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  useSuppliers,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useRetailers,
  useCreateRetailer,
  useUpdateRetailer,
  useDeleteRetailer,
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../../hooks/usePartnersData";

type PartnerType = "supplier" | "retailer" | "customer";

const PartnersModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PartnerType>("supplier");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<any>(null);

  // Queries
  const { data: suppliers = [], isLoading: loadSuppliers } = useSuppliers();
  const { data: retailers = [], isLoading: loadRetailers } = useRetailers();
  const { data: customers = [], isLoading: loadCustomers } = useCustomers();

  // Mutations
  const { mutateAsync: createSupplier } = useCreateSupplier();
  const { mutateAsync: updateSupplier } = useUpdateSupplier();
  const { mutateAsync: deleteSupplier } = useDeleteSupplier();

  const { mutateAsync: createRetailer } = useCreateRetailer();
  const { mutateAsync: updateRetailer } = useUpdateRetailer();
  const { mutateAsync: deleteRetailer } = useDeleteRetailer();

  const { mutateAsync: createCustomer } = useCreateCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();
  const { mutateAsync: deleteCustomer } = useDeleteCustomer();

  const filteredData = useMemo(() => {
    let list = [];
    if (activeTab === "supplier") list = suppliers;
    if (activeTab === "retailer") list = retailers;
    if (activeTab === "customer") list = customers;

    if (search) {
      list = list.filter((p: any) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [activeTab, suppliers, retailers, customers, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const isLoading =
    (activeTab === "supplier" && loadSuppliers) ||
    (activeTab === "retailer" && loadRetailers) ||
    (activeTab === "customer" && loadCustomers);

  const handleCreate = () => {
    setSelectedPartner(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (partner: any) => {
    setSelectedPartner(partner);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (partner: any) => {
    setPartnerToDelete(partner);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!partnerToDelete) return;
    try {
      if (activeTab === "supplier") await deleteSupplier(partnerToDelete.id);
      if (activeTab === "retailer") await deleteRetailer(partnerToDelete.id);
      if (activeTab === "customer") await deleteCustomer(partnerToDelete.id);
    } finally {
      setIsConfirmOpen(false);
      setPartnerToDelete(null);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (isEditMode && selectedPartner) {
      if (activeTab === "supplier") await updateSupplier({ id: selectedPartner.id, data: formData });
      if (activeTab === "retailer") await updateRetailer({ id: selectedPartner.id, data: formData });
      if (activeTab === "customer") await updateCustomer({ id: selectedPartner.id, data: formData });
    } else {
      if (activeTab === "supplier") await createSupplier(formData);
      if (activeTab === "retailer") await createRetailer(formData);
      if (activeTab === "customer") await createCustomer(formData);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Organization Name",
      accessorKey: "name",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
            <Building2 size={16} />
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            {p.name}
          </span>
        </div>
      ),
    },
    {
      header: "Contact Person",
      accessorKey: "contactPerson",
      cell: (p) => (
        <div>
          <div className="font-bold text-xs text-gray-800 dark:text-gray-200">
            {p.contactPerson || "N/A"}
          </div>
          {p.phone && (
            <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
              <Phone size={10} />
              {p.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Email & Address",
      accessorKey: "email",
      cell: (p) => (
        <div className="space-y-1">
          {p.email && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              <Mail size={12} className="text-blue-400" />
              {p.email}
            </div>
          )}
          {p.address && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 line-clamp-1 max-w-[200px]">
              <MapPin size={12} className="text-rose-400 min-w-[12px]" />
              <span className="truncate">{p.address}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (p) => {
        const s = p.status || "ACTIVE";
        const isAct = s === "ACTIVE";
        const isSusp = s === "SUSPENDED";
        return (
          <span
            className={`px-2 py-1 text-[10px] font-black tracking-wider rounded-md uppercase ${
              isAct
                ? "bg-green-100 text-green-700"
                : isSusp
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {s}
          </span>
        );
      },
    },
  ];

  columns.push({
    header: "",
    accessorKey: "actions",
    cell: (p) => (
      <div className="flex items-center justify-end">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <MoreVertical size={16} />
            </button>
          }
        >
          <DropdownItem icon={Eye} onClick={() => console.log("View", p)}>
            View Details
          </DropdownItem>
          <DropdownItem icon={Edit3} onClick={() => handleEdit(p)}>
            Edit Record
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={Trash2} className="text-red-600 dark:text-red-400" onClick={() => handleDeleteRequest(p)}>
            Delete
          </DropdownItem>
        </Dropdown>
      </div>
    ),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("supplier")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === "supplier"
                ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Asset Suppliers
          </button>
          <button
            onClick={() => setActiveTab("retailer")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === "retailer"
                ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Vendors / Retailers
          </button>
          <button
            onClick={() => setActiveTab("customer")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === "customer"
                ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Customers
          </button>
        </div>

        <Button color="blue" onClick={handleCreate} className="font-bold">
          <Plus size={16} className="mr-2" />
          Add New{" "}
          {activeTab === "supplier"
            ? "Supplier"
            : activeTab === "retailer"
            ? "Retailer"
            : "Customer"}
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl">
        <DataTable
          data={paginatedData}
          columns={columns}
          isLoading={isLoading}
          searchPlaceholder="Search partners by name..."
          searchQuery={search}
          onSearchChange={setSearch}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / pageSize) || 1}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          pageSize={pageSize}
        />
      </div>

      {isModalOpen && (
        <PartnerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isEditMode={isEditMode}
          partnerType={activeTab}
          defaultValues={selectedPartner}
          onSubmit={handleSubmit}
        />
      )}

      {isConfirmOpen && (
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Partner"
          message={`Are you sure you want to remove ${
            partnerToDelete?.name || "this partner"
          }?`}
        />
      )}
    </div>
  );
};

export default PartnersModule;

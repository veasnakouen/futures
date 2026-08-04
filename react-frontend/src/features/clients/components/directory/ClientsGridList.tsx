import React from "react";
import { Badge, Dropdown, DropdownItem, DropdownDivider } from "@/lib/flowbite-compat";
import DataCard from "@/components/ui/DataCard";
import { User, Edit, Trash2, ExternalLink } from "lucide-react";

interface Props {
  state: any;
}

export default function ClientsGridList({ state }: Props) {
  const {
    t,
    navigate,
    clients,
    itemsPerRow,
    handleEdit,
    handleDelete,
  } = state;

  const getGridClass = () => {
    return `grid gap-6 ${
      itemsPerRow === "3"
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : itemsPerRow === "5"
        ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    }`;
  };

  return (
    <div className={getGridClass()}>
      {clients.map((client: any) => (
        <DataCard
          key={client.id}
          title={`${client.firstName} ${client.lastName}`}
          subtitle={`Code: ${client.clientCode}`}
          imageUrl={client.photo}
          fallbackIcon={<User className="text-gray-300 dark:text-gray-600" size={32} />}
          statusLabel={client.status || "Active"}
          statusColorClass={
            client.status === "Active"
              ? "border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10"
              : "border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-900/10"
          }
          customBadges={
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest border-blue-100">
                {client.branch || "Phnom Penh"}
              </span>
              {client.gender && (
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest">
                  {client.gender}
                </span>
              )}
            </div>
          }
          dropdownItems={
            <>
              <DropdownItem
                onClick={() => navigate(`/clients/${client.id}`)}
                className="font-bold text-xs text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink size={14} />
                  <span>View Profile Workspace</span>
                </div>
              </DropdownItem>
              <DropdownItem
                onClick={() => handleEdit(client)}
                className="font-bold text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div className="flex items-center gap-2">
                  <Edit size={14} />
                  <span>Edit Registration</span>
                </div>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem
                onClick={() => handleDelete(client.id)}
                className="font-bold text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                <div className="flex items-center gap-2">
                  <Trash2 size={14} />
                  <span>Delete Profile</span>
                </div>
              </DropdownItem>
            </>
          }
        />
      ))}
    </div>
  );
}

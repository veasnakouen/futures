import React from "react";
import {Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, Avatar, Button, Pagination, Dropdown, DropdownItem, DropdownDivider} from '@/lib/flowbite-compat';
import {
  Mail,
  MapPin,
  Edit2,
  Trash2,
  MoreVertical,
  ExternalLink,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useNavigate } from '@/lib/react-router-compat';

interface Client {
  id: number;
  clientCode: string;
  firstName: string;
  lastName: string;
  branch: string;
  gender: string;
  status: string;
  photo?: string;
  email?: string;
  contactPhone?: string;
}

interface ClientTableProps {
  clients: Client[];
  visibleColumns: string[];
  handleEdit: (client: Client) => void;
  handleDelete: (id: number) => void;
  connections: any[];
  toggleConnection: (client: Client) => void;
  handleMessage: (client: Client) => void;
}

const cleanText = (text: string) => {
  if (!text) return text;
  let decoded = text;
  for (let i = 0; i < 5; i++) {
    decoded = decoded
      .replace(/&[aA][mM][pP];/g, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');
  }
  return decoded;
};

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  visibleColumns,
  handleEdit,
  handleDelete,
  connections,
  toggleConnection,
  handleMessage,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md overflow-hidden shadow-sm w-full">
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar w-full max-h-[65vh]">
        <Table hoverable className="w-full min-w-[700px] relative">
          <TableHead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-20 shadow-sm border-b">
            <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
              Client Identity
            </TableHeadCell>
            {visibleColumns.includes("clientCode") && (
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                Registration Code
              </TableHeadCell>
            )}
            {visibleColumns.includes("branch") && (
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                Branch Office
              </TableHeadCell>
            )}
            {visibleColumns.includes("status") && (
              <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6">
                System Status
              </TableHeadCell>
            )}
            <TableHeadCell className="font-black uppercase text-[10px] tracking-widest py-4 px-6 text-right">
              Actions
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-8 py-24 text-center text-gray-400 font-bold uppercase text-xs italic tracking-widest"
                >
                  No records match your current filters.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((c) => (
                <TableRow
                  key={c.id}
                  className="relative z-10 hover:z-30 focus-within:z-40 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all group"
                >
                  <TableCell className="px-6 py-4 max-w-[250px]">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <Avatar
                        img={c.photo || "/default.png"}
                        rounded
                        size="md"
                        placeholderInitials={`${c.firstName.charAt(0)}${c.lastName.charAt(0)}`}
                        className="shadow-sm transition-transform duration-300 hover:scale-110 shrink-0 cursor-pointer"
                        onClick={() => navigate(`/clients/${c.id}`)}
                      />
                      <div className="min-w-0">
                        <p
                          className="font-black text-gray-900 dark:text-white leading-tight text-lg truncate cursor-pointer hover:text-blue-600 transition-colors"
                          title={`${c.firstName} ${c.lastName}`}
                          onClick={() => navigate(`/clients/${c.id}`)}
                        >
                          {c.firstName} {c.lastName}
                        </p>
                        <p
                          className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1 uppercase tracking-wider truncate"
                          title={c.email || "no-email@mtp.org"}
                        >
                          <Mail size={10} className="text-blue-500 shrink-0" />{" "}
                          <span className="truncate">
                            {c.email || "no-email@mtp.org"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {visibleColumns.includes("clientCode") && (
                    <TableCell className="px-6 py-4 max-w-[150px]">
                      <span
                        className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-md font-mono text-xs font-black tracking-widest shadow-inner truncate block"
                        title={c.clientCode}
                      >
                        {c.clientCode}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.includes("branch") && (
                    <TableCell className="px-6 py-4 max-w-[200px]">
                      <div
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-black uppercase text-[10px] tracking-widest truncate"
                        title={cleanText(c.branch)}
                      >
                        <MapPin size={14} className="text-rose-500 shrink-0" />{" "}
                        <span className="truncate">{cleanText(c.branch)}</span>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-md ${c.status ==="Active"?"bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]":"bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"}`}
                        ></div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${c.status ==="Active"?"text-emerald-600":"text-amber-600"}`}
                        >
                          {c.status || "Active"}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <Dropdown
                        label={
                          <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-gray-400 hover:text-blue-600 cursor-pointer">
                            <MoreVertical size={18} />
                          </div>
                        }
                        arrowIcon={false}
                        inline
                      >
                        <DropdownItem
                          onClick={() =>
                            setTimeout(() => navigate(`/clients/${c.id}`), 0)
                          }
                          className="font-bold text-xs text-blue-600"
                        >
                          <div className="flex items-center gap-2">
                            <ExternalLink size={14} />
                            <span>View Profile</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setTimeout(() => handleMessage(c), 0)}
                          className="font-bold text-xs text-indigo-600"
                        >
                          <div className="flex items-center gap-2">
                            <MessageSquare size={14} />
                            <span>Message</span>
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() =>
                            setTimeout(() => toggleConnection(c), 0)
                          }
                          className="font-bold text-xs text-amber-600"
                        >
                          <div className="flex items-center gap-2">
                            <UserPlus size={14} />
                            <span>
                              {connections.some(
                                (conn) =>
                                  conn.targetType === "CLIENT" &&
                                  conn.targetId === String(c.id),
                              )
                                ? "Remove Connection"
                                : "Add to Network"}
                            </span>
                          </div>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => setTimeout(() => handleEdit(c), 0)}
                          className="font-bold text-xs text-emerald-600"
                        >
                          <div className="flex items-center gap-2">
                            <Edit2 size={14} />
                            <span>Edit Identity</span>
                          </div>
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem
                          onClick={() =>
                            setTimeout(() => handleDelete(c.id), 0)
                          }
                          className="font-bold text-xs text-rose-600"
                        >
                          <div className="flex items-center gap-2">
                            <Trash2 size={14} />
                            <span>Delete Record</span>
                          </div>
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default ClientTable;

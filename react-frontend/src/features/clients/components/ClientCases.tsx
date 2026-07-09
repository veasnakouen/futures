import React, { useState, useEffect } from "react";
import { Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Select, Textarea, Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell } from '@/lib/flowbite-compat';
import { Plus, Edit3, Trash2 } from "lucide-react";
import api from "@/services/api";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface ClientCasesProps {
  clientId: string | number;
}

const ClientCases: React.FC<ClientCasesProps> = ({ clientId }) => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    clientId: clientId.toString(),
    subject: "",
    description: "",
    priority: "Normal",
    serviceType: "Job Placement",
  });

  useEffect(() => {
    fetchCases();
  }, [clientId]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cases/client/${clientId}`);
      setCases(response.data || []);
    } catch (err) {
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (c: any = null) => {
    if (c) {
      setSelectedCase(c);
      setFormData({
        clientId: clientId.toString(),
        subject: c.subject || "",
        description: c.description || "",
        priority: c.priority || "Normal",
        serviceType: c.serviceType || "Job Placement",
      });
    } else {
      setSelectedCase(null);
      setFormData({
        clientId: clientId.toString(),
        subject: "",
        description: "",
        priority: "Normal",
        serviceType: "Job Placement",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCase) {
        await api.put(`/cases/${selectedCase.id}`, formData);
        toast.success("Case updated successfully");
      } else {
        await api.post("/cases", formData);
        toast.success("Case created successfully");
      }
      setIsModalOpen(false);
      fetchCases();
    } catch (err) {
      toast.error("Failed to save case");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
    try {
      await api.delete(`/cases/${id}`);
      toast.success("Case deleted");
      fetchCases();
    } catch (err) {
      toast.error("Failed to delete case");
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "High": return "failure";
      case "Medium": return "warning";
      case "Normal": return "info";
      default: return "gray";
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Case Management</h3>
          <p className="text-xs text-gray-500">Manage support and placement cases</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-lg shadow-sm">
          <Plus size={16} className="mr-2" /> Add Case
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <Table hoverable className="border-none w-full">
          <TableHead className="bg-gray-50/90 dark:bg-gray-700/90 text-xs text-gray-500 uppercase">
            <TableHeadCell>Case Details</TableHeadCell>
            <TableHeadCell>Service Type</TableHeadCell>
            <TableHeadCell>Priority</TableHeadCell>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell className="text-right">Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-400 italic">
                  No cases found for this client.
                </TableCell>
              </TableRow>
            ) : (
              cases.map((c) => (
                <TableRow key={c.id} className="dark:bg-gray-800">
                  <TableCell>
                    <div className="font-bold text-gray-900 dark:text-white">{c.subject}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{c.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge color="gray">{c.serviceType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={getPriorityColor(c.priority)}>{c.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {c.openDate ? format(new Date(c.openDate), "MMM dd, yyyy") : "---"}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(c)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>{selectedCase ? "Edit Case" : "Add New Case"}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody className="space-y-4">
            <div>
              <div className="mb-2 block"><Label htmlFor="subject" value="Subject" /></div>
              <TextInput id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block"><Label htmlFor="priority" value="Priority" /></div>
                <Select id="priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} required>
                  <option>Normal</option>
                  <option>Medium</option>
                  <option>High</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block"><Label htmlFor="serviceType" value="Service Type" /></div>
                <Select id="serviceType" value={formData.serviceType} onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })} required>
                  <option>Job Placement</option>
                  <option>Social Support</option>
                  <option>Counseling</option>
                  <option>Other</option>
                </Select>
              </div>
            </div>
            <div>
              <div className="mb-2 block"><Label htmlFor="description" value="Description" /></div>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit">{selectedCase ? "Update Case" : "Save Case"}</Button>
            <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default ClientCases;

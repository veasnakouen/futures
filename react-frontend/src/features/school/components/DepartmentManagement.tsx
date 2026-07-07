import React, { useState } from "react";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "../../../hooks/useOutreach";
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, TextInput, Label, Modal, Spinner } from "@/lib/flowbite-compat";
import { Building2, Plus, Edit2, Trash2 } from "lucide-react";

const DepartmentManagement = () => {
  const { data: departments = [], isLoading } = useDepartments();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "",
    requiredRole: "",
    headOfDepartment: "",
    contactEmail: "",
    location: ""
  });

  const handleOpenModal = (dept?: any) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({ 
        name: dept.name, 
        description: dept.description || "",
        requiredRole: dept.requiredRole || "",
        headOfDepartment: dept.headOfDepartment || "",
        contactEmail: dept.contactEmail || "",
        location: dept.location || ""
      });
    } else {
      setEditingDept(null);
      setFormData({ 
        name: "", 
        description: "",
        requiredRole: "",
        headOfDepartment: "",
        contactEmail: "",
        location: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      await updateDepartment.mutateAsync({ id: editingDept.id, data: { ...editingDept, ...formData } });
    } else {
      await createDepartment.mutateAsync(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment.mutateAsync(id);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Spinner size="xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="text-blue-500" /> Departments
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage referral departments for case management.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <Table hoverable>
          <TableHead>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Description</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {departments.map((dept: any) => (
              <TableRow key={dept.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {dept.name}
                </TableCell>
                <TableCell>{dept.description || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" color="gray" onClick={() => handleOpenModal(dept)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" color="failure" onClick={() => handleDelete(dept.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>{editingDept ? "Edit Department" : "Add Department"}</Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className="space-y-4">
            <div>
              <div className="mb-2 block"><Label value="Department Name" /></div>
              <TextInput 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
              />
            </div>
            <div>
              <div className="mb-2 block"><Label value="Description" /></div>
              <TextInput 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <div className="mb-2 block"><Label value="Required Access Role (Optional)" /></div>
              <TextInput 
                placeholder="e.g. ROLE_COUNSELOR"
                value={formData.requiredRole}
                onChange={(e) => setFormData({ ...formData, requiredRole: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank for public department visibility</p>
            </div>
            <div>
              <div className="mb-2 block"><Label value="Head of Department" /></div>
              <TextInput 
                value={formData.headOfDepartment}
                onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block"><Label value="Contact Email" /></div>
                <TextInput 
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <div className="mb-2 block"><Label value="Location" /></div>
                <TextInput 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" isProcessing={createDepartment.isPending || updateDepartment.isPending}>Save</Button>
            <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;

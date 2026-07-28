import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, Button, TextInput, Select, Label } from '@/lib/flowbite-compat';
import CustomModalHeader from "@/components/common/CustomModalHeader";
import { Database, Plus, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

interface DataSourceManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (source: any) => void;
}

export default function DataSourceManagerModal({
  isOpen,
  onClose,
  onSelectSource,
}: DataSourceManagerModalProps) {
  const [sourceName, setSourceName] = useState("");
  const [sourceType, setSourceType] = useState("REST_API");
  const [endpointUrl, setEndpointUrl] = useState("");

  const handleSave = () => {
    if (!sourceName) return toast.error("Source name required");
    onSelectSource({ name: sourceName, type: sourceType, url: endpointUrl });
    toast.success("Data source linked successfully");
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <CustomModalHeader title="Data Source Manager" subtitle="Report Query Pipeline" onClose={onClose} />
      <ModalBody className="p-6 space-y-4 text-xs">
        <div>
          <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Source Name</Label>
          <TextInput placeholder="e.g. Sales Ledger Microservice" value={sourceName} onChange={(e) => setSourceName(e.target.value)} sizing="sm" />
        </div>

        <div>
          <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Connection Type</Label>
          <Select value={sourceType} onChange={(e) => setSourceType(e.target.value)} sizing="sm">
            <option value="REST_API">REST API Endpoint (/api/v1/...)</option>
            <option value="DATABASE_VIEW">PostgreSQL View / Table</option>
            <option value="GRAPHQL">GraphQL Query Schema</option>
          </Select>
        </div>

        <div>
          <Label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Endpoint Path / Query Target</Label>
          <TextInput placeholder="/api/v1/reports/sales" value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} sizing="sm" />
        </div>
      </ModalBody>
      <ModalFooter className="bg-gray-50 border-t justify-end">
        <Button color="gray" onClick={onClose} className="font-black uppercase text-[10px]">Cancel</Button>
        <Button color="blue" onClick={handleSave} className="font-black uppercase text-[10px]">Link Data Source</Button>
      </ModalFooter>
    </Modal>
  );
}

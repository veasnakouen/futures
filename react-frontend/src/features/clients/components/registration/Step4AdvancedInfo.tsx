import React from "react";
import ClientAdvancedFeatures from "../ClientAdvancedFeatures";

interface Props {
  clientId?: number | string;
  formData: any;
  setFormData: (data: any) => void;
}

export default function Step4AdvancedInfo({ clientId, formData }: Props) {
  if (!clientId) {
    return (
      <div className="py-12 text-center text-gray-400 space-y-2">
        <p className="font-bold text-sm">Please save basic client information before accessing advanced features.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <ClientAdvancedFeatures clientId={clientId} formData={formData} />
    </div>
  );
}

import React from "react";
import { Button } from "@/lib/flowbite-compat";
import { Plus } from "lucide-react";

interface Props {
  state: any;
}

export default function LogbookHeaderBar({ state }: Props) {
  const { t, resetForm } = state;

  return (
    <header className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold dark:text-white">
          {t("attendanceActivityLog")}
        </h2>
        <p className="text-sm text-gray-500">
          Track daily walk-in services and facility usage
        </p>
      </div>
      <Button
        color="blue"
        onClick={resetForm}
        className="rounded-md shadow-lg shadow-blue-500/20 cursor-pointer"
      >
        <Plus size={18} className="mr-2" /> {t("quickEntry")}
      </Button>
    </header>
  );
}

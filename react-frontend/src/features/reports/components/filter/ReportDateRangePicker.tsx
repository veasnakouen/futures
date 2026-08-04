import React from "react";
import { Label } from "@/lib/flowbite-compat";
import DatePicker from "@/components/common/DatePicker";
import { format } from "date-fns";

interface Props {
  props: any;
}

export default function ReportDateRangePicker({ props }: Props) {
  const { startDate, setStartDate, endDate, setEndDate } = props;

  return (
    <div className="grid grid-cols-2 lg:flex gap-4">
      <div className="w-full lg:w-48">
        <Label className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
          Filter Start
        </Label>
        <DatePicker
          value={startDate ? new Date(startDate) : null}
          onChange={(date) => setStartDate(format(date, "yyyy-MM-dd"))}
          placeholder="Start Date..."
        />
      </div>

      <div className="w-full lg:w-48">
        <Label className="mb-2 block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">
          Filter End
        </Label>
        <DatePicker
          value={endDate ? new Date(endDate) : null}
          onChange={(date) => setEndDate(format(date, "yyyy-MM-dd"))}
          placeholder="End Date..."
        />
      </div>
    </div>
  );
}

import React from "react";
import { CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Box } from "lucide-react";

interface LocationNodeSelectorProps {
  locations: any[];
  locLoading: boolean;
  selectedLocation: number | null;
  onSelectLocation: (id: number) => void;
}

const LocationNodeSelector: React.FC<LocationNodeSelectorProps> = ({
  locations,
  locLoading,
  selectedLocation,
  onSelectLocation,
}) => {
  return (
    <div className="border-none shadow-sm dark:bg-gray-800 rounded-md">
      <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
            <Box size={16} /> Select Controller Node
          </h4>
          <p className="text-xs text-gray-400 mt-1">Choose a specific storage node to view and manage its local stock.</p>
        </div>

        <div className="w-full sm:w-80">
          {locLoading ? (
            <div className="flex items-center gap-3 text-sm text-gray-500"><Spinner size="sm" /> Syncing Nodes...</div>
          ) : (
            <Select
              value={selectedLocation ? selectedLocation.toString() : undefined}
              onValueChange={(val) => onSelectLocation(parseInt(val))}
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-700">
                <SelectValue placeholder="Select a node..." />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc: any) => (
                  <SelectItem key={loc.id} value={loc.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${loc.status === "ONLINE" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                      {loc.name} <span className="text-[9px] text-gray-400 ml-2 uppercase">({loc.type})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default LocationNodeSelector;

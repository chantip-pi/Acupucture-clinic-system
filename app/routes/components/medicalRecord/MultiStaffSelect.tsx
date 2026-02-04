import React, { useState } from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button as CNButton } from "~/components/ui/button";
import {
  Command as CNCommand,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface Staff {
  staffId: number;
  nameSurname: string;
}

interface MultiStaffSelectProps {
  staffList: Staff[];
  selectedStaffIds: number[];
  onStaffChange: (staffIds: number[]) => void;
}

const MultiStaffSelect: React.FC<MultiStaffSelectProps> = ({
  staffList,
  selectedStaffIds,
  onStaffChange,
}) => {
  const [staffOpen, setStaffOpen] = useState(false);

  const selectedStaff = staffList.filter((staff) =>
    selectedStaffIds.includes(staff.staffId)
  );

  const handleSelectStaff = (staffId: number) => {
    if (selectedStaffIds.includes(staffId)) {
      // Remove if already selected
      onStaffChange(selectedStaffIds.filter((id) => id !== staffId));
    } else {
      // Add if not selected
      onStaffChange([...selectedStaffIds, staffId]);
    }
  };

  const handleRemoveStaff = (staffId: number) => {
    onStaffChange(selectedStaffIds.filter((id) => id !== staffId));
  };

  return (
    <div>
      {/* Selected Staff Tags */}
      {selectedStaff.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedStaff.map((staff) => (
            <div
              key={staff.staffId}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#2F919C] text-white rounded-md text-sm"
            >
              <span>{staff.nameSurname}</span>
              <button
                onClick={() => handleRemoveStaff(staff.staffId)}
                className="hover:bg-[#257882] rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${staff.nameSurname}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Staff Selection Dropdown */}
      <Popover open={staffOpen} onOpenChange={setStaffOpen}>
        <PopoverTrigger asChild>
          <CNButton
            variant="outline"
            role="combobox"
            aria-expanded={staffOpen}
            className="w-full justify-between"
          >
            {selectedStaff.length > 0
              ? `${selectedStaff.length} staff${selectedStaff.length > 1 ? "s" : ""} selected`
              : "Select staffs"}
            <ChevronsUpDown className="opacity-50" />
          </CNButton>
        </PopoverTrigger>
        <PopoverContent className="w-[452px] p-0">
          <CNCommand>
            <CommandInput placeholder="Search staffs..." className="h-9" />
            <CommandList>
              <CommandEmpty>No staff found.</CommandEmpty>
              <CommandGroup>
                {staffList.map((staff) => {
                  const isSelected = selectedStaffIds.includes(staff.staffId);
                  return (
                    <CommandItem
                      key={staff.staffId}
                      value={staff.nameSurname}
                      onSelect={() => handleSelectStaff(staff.staffId)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded border border-gray-300",
                          isSelected && "bg-[#2F919C] border-[#2F919C]"
                        )}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {staff.nameSurname}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </CNCommand>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiStaffSelect;
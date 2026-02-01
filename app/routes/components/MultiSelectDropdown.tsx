import React, { useState, useRef, useEffect } from "react";

interface MultiSelectDropdown {
  choices: any[];
  selectedChoices: string[];
  onToggleChoice: (choice: string) => void;
  getChoiceName: (choiceObj: any) => string | null;
  dropdownPlaceholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdown> = ({
  choices,
  selectedChoices,
  onToggleChoice,
  getChoiceName,
dropdownPlaceholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredChoices = choices.filter((choiceObj) => {
    const choiceName = getChoiceName(choiceObj);
    if (!choiceName) return false;
    return choiceName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getDisplayText = () => {
    if (selectedChoices.length === 0) {
      return `Select ${dropdownPlaceholder}...` || "Select options...";
    }
    if (selectedChoices.length === 1) {
      return (
        selectedChoices[0].charAt(0).toUpperCase() + selectedChoices[0].slice(1)
      );
    }
    return `${selectedChoices.length} ${dropdownPlaceholder || "options"} selected`;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  const handleCheckboxChange = (choiceName: string) => {
    onToggleChoice(choiceName);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 text-left text-slate-700 hover:border-slate-400 focus:border-[#2F919C] focus:outline-none focus:ring-2 focus:ring-[#2F919C]/20"
      >
        <span className="text-sm font-medium">{getDisplayText()}</span>
        <svg
          className={`h-5 w-5 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
          {selectedChoices.length > 0 && (
            <div className="flex flex-wrap gap-2 border-b border-slate-200 p-3">
              {selectedChoices.map((choice) => (
                <div
                  key={choice}
                  className="flex items-center gap-1 rounded-md bg-[#DCE8E9] px-3 py-1 text-sm font-medium text-[#2F919C]"
                >
                  <span>
                    {choice.charAt(0).toUpperCase() + choice.slice(1)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(choice);
                    }}
                    className="ml-1 hover:text-[#236870]"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search input */}
          <div className="border-b border-slate-200 p-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-[#2F919C] focus:outline-none focus:ring-2 focus:ring-[#2F919C]/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-3">
            <div className="space-y-2">
              {filteredChoices.map((choiceObj, index) => {
                const choiceName = getChoiceName(choiceObj);
                if (!choiceName) return null;

                  const normalized = choiceName.toLowerCase();
                  const isSelected = selectedChoices.includes(normalized);
                return (
                  <label
                    key={`${choiceName}-${index}`}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(choiceName)}
                      className="h-5 w-5 rounded border-slate-300 text-[#2F919C] focus:ring-2 focus:ring-[#2F919C]/20"
                    />
                    <span className="text-sm text-slate-700">
                      {choiceName.charAt(0).toUpperCase() + choiceName.slice(1)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* No results message */}
          {filteredChoices.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500">
              No choices found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
import React, { useState, useEffect, useMemo } from "react";
import {
  PageShell,
  Card,
  SectionHeading,
  Button,
  Table,
} from "~/presentation/designSystem";
import { Illness } from "~/domain/entities/Illness";
import { useGetIllnessList } from "~/presentation/hooks/illness/useGetIllnessList";

function AcupunctureLibrary() {
  const { illnesses, loading: illnessesLoading } = useGetIllnessList();
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [illnessData, setIllnessData] = useState<Record<string, Illness[]>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    const groupIllnessByLetter = () => {
      try {
        const grouped: Record<string, Illness[]> = {};

        illnesses.forEach((illness: Illness) => {
          const firstLetter = illness.illnessName[0].toUpperCase();
          if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
          }
          grouped[firstLetter].push(illness);
        });

        // Sort illnesses within each letter group
        Object.keys(grouped).forEach((letter) => {
          grouped[letter] = grouped[letter].sort((a, b) =>
            a.illnessName.localeCompare(b.illnessName),
          );
        });

        setIllnessData(grouped);

        // Set first available letter as selected
        const firstAvailableLetter = alphabetLetters.find(
          (letter) => grouped[letter],
        );
        if (firstAvailableLetter) {
          setSelectedLetter(firstAvailableLetter);
        }
      } catch (err) {
        console.error("Error grouping illnesses:", err);
      }
    };

    if (illnesses.length > 0) {
      groupIllnessByLetter();
    }
  }, [illnesses]);

  // Filter illnesses based on search term
  const filteredIllnesses = useMemo(() => {
    if (!searchTerm.trim()) {
      return illnessData[selectedLetter] || [];
    }

    const searchLower = searchTerm.toLowerCase();
    const allIllnesses = Object.values(illnessData).flat();
    return allIllnesses.filter((illness) =>
      illness.illnessName.toLowerCase().includes(searchLower),
    );
  }, [illnessData, selectedLetter, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (illnessesLoading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg text-slate-600">Loading illnesses...</div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="p-8">
      <Card>
        <SectionHeading title="Acupuncture Point Library" />
        {/* Search and Filter Section */}
        <div className="flex gap-3 mb-6">
          <Button variant="secondary" size="md" className="px-6">
            Filter
          </Button>
          <input
            type="text"
            placeholder="Search the illness"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Alphabet Filter Title */}
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          Filter by the first letter
        </h3>

        {/* Alphabet Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {alphabetLetters.map((letter) => {
              const hasIllnesses =
                illnessData[letter] && illnessData[letter].length > 0;
              const isSelected = selectedLetter === letter;

              return (
                <button
                  key={letter}
                  onClick={() => {
                    if (hasIllnesses) {
                      setSelectedLetter(letter);
                      setSearchTerm(""); // Clear search when selecting a letter

                      // Scroll to the letter section
                      setTimeout(() => {
                        const element = document.getElementById(
                          `letter-${letter}`,
                        );
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }, 100);
                    }
                  }}
                  disabled={!hasIllnesses}
                  className={`w-8 h-8 rounded-full font-semibold text-sm transition-all duration-150 ${
                    isSelected
                      ? "bg-teal-600 text-white shadow-sm"
                      : hasIllnesses
                      ? "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm ? (
          <>
            <div className="mb-4">
              <div className="text-sm bg-[#DCE8E9] text-[#2F919C] p-3 rounded-md">
                Found {filteredIllnesses.length} result
                {filteredIllnesses.length !== 1 ? "s" : ""} for "{searchTerm}"
              </div>
            </div>

            <div className="space-y-1">
              {filteredIllnesses.length > 0 ? (
                filteredIllnesses.map((illness, index) => (
                  <div
                    key={illness.illnessId || index}
                    className="py-6 px-4 hover:bg-slate-50 cursor-pointer transition-colors duration-150 border-b border-slate-200 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        {illness.illnessName}
                      </span>
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500">
                  No illnesses found matching your search
                </div>
              )}
            </div>
          </>
        ) : (
          /* Show all letters with their illnesses */
          <div className="space-y-6">
            {alphabetLetters.map((letter) => {
              const illnessesForLetter = illnessData[letter] || [];

              // Only show letters that have illnesses
              if (illnessesForLetter.length === 0) return null;

              return (
                <div key={letter} id={`letter-${letter}`}>
                  {/* Letter Badge */}
                  <div className="mb-3">
                    <div className="inline-block px-4 py-2 bg-[#DCE8E9] text-[#2F919C] font-semibold rounded-md w-full">
                      {letter}
                    </div>
                  </div>

                  {/* Illness List for this letter */}
                  <div className="space-y-1 mb-6">
                    {illnessesForLetter.map((illness, index) => (
                      <div
                        key={illness.illnessId || `${letter}-${index}`}
                        className="py-6 px-4 hover:bg-slate-50 cursor-pointer transition-colors duration-150 border-b border-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">
                            {illness.illnessName}
                          </span>
                          <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {Object.keys(illnessData).length === 0 && (
              <div className="py-8 text-center text-slate-500">
                No illnesses available
              </div>
            )}
          </div>
        )}
      </Card>
    </PageShell>
  );
}

export default AcupunctureLibrary;

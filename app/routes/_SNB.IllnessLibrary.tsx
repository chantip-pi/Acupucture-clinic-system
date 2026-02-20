import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PageShell,
  Card,
  SectionHeading,
  Button,
  Select,
} from "~/presentation/designSystem";
import { Illness } from "~/domain/entities/Illness";
import { useGetIllnessList } from "~/presentation/hooks/illness/useGetIllnessList";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserSession } from "~/presentation/session/userSession";
import LoadingPage from "./components/common/LoadingPage";
import { illnessCategoryOptions } from "~/domain/entities/IlllnessCategoryEnum";

function IllnessLibrary() {
  const { illnesses, loading: illnessesLoading } = useGetIllnessList();
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [illnessData, setIllnessData] = useState<Record<string, Illness[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isManager, setIsManager] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const navigate = useNavigate();

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

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      setIsManager(false);
      return;
    }

    setIsManager(session.title?.toLowerCase() === "manager");
  }, []);

  // Filter illnesses based on search term and category
  const filteredIllnesses = useMemo(() => {
    let illnesses = searchTerm.trim() 
      ? Object.values(illnessData).flat()
      : (illnessData[selectedLetter] || []);
  
    const searchLower = searchTerm.toLowerCase();
    
    return illnesses.filter((illness) => {
      const matchesSearch = !searchTerm.trim() || 
        illness.illnessName.toLowerCase().includes(searchLower);
      const matchesCategory = 
        categoryFilter === "" || 
        illness.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [illnessData, selectedLetter, searchTerm, categoryFilter]);

  // Filter illnesses by category for letter-grouped view
  const filteredIllnessData = useMemo(() => {
    if (categoryFilter === "") {
      return illnessData;
    }

    const filtered: Record<string, Illness[]> = {};
    Object.keys(illnessData).forEach((letter) => {
      const filteredForLetter = illnessData[letter].filter(
        (illness) => illness.category === categoryFilter
      );
      if (filteredForLetter.length > 0) {
        filtered[letter] = filteredForLetter;
      }
    });
    return filtered;
  }, [illnessData, categoryFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (illnessesLoading) {
    return <LoadingPage />;
  }

  const checkAccess = (action: () => void) => {
    if (!isManager) {
      alert("You don't have access to this action.");
      return;
    }

    action();
  };

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
  };

  return (
    <PageShell className="p-8">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeading title="Acupuncture Library" />
          {(isManager) && (<Button
            variant="secondary"
            size="sm"
            onClick={() => checkAccess(() => navigate('/createIllness'))}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <FontAwesomeIcon icon={faPenToSquare} />
            </span>
            Add Illness
          </Button>)}
        </div>
        {/* Search and Filter Section */}
        <div className="flex gap-3 mb-6">
          <div className="w-48">
            <Select
              name="category"
              value={categoryFilter}
              onChange={handleCategoryFilter}
            >
              <option value="">All Categories</option>
              {illnessCategoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
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
                filteredIllnessData[letter] && filteredIllnessData[letter].length > 0;
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
                  className={`w-8 h-8 rounded-full font-semibold text-sm transition-all duration-150 ${isSelected
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
                {categoryFilter && ` in category "${categoryFilter}"`}
              </div>
            </div>

            <div className="space-y-1">
              {filteredIllnesses.length > 0 ? (
                filteredIllnesses.map((illness, index) => (
                  <div
                    key={illness.illnessId || index}
                    onClick={() =>
                      navigate("/illnessAcupunctureShow", {
                        state: { illnessId: illness.illnessId },
                      })
                    }
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
          /* Show all letters with their illnesses (filtered by category) */
          <div className="space-y-6 fade-in">
            {alphabetLetters.map((letter) => {
              const illnessesForLetter = filteredIllnessData[letter] || [];

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
                        onClick={() =>
                          navigate("/illnessAcupunctureShow", {
                            state: { illnessId: illness.illnessId },
                          })
                        }
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

            {Object.keys(filteredIllnessData).length === 0 && (
              <div className="py-8 text-center text-slate-500">
                {categoryFilter 
                  ? `No illnesses found in category "${categoryFilter}"`
                  : "No illnesses available"}
              </div>
            )}
          </div>
        )}
      </Card>
    </PageShell>
  );
}

export default IllnessLibrary;
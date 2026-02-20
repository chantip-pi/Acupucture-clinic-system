import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PageShell,
  Card,
  SectionHeading,
  Button,
  Select,
} from "~/presentation/designSystem";
import { Meridian } from "~/domain/entities/Meridian";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserSession } from "~/presentation/session/userSession";
import LoadingPage from "./components/common/LoadingPage";
import { useGetMeridianNames } from "~/presentation/hooks/meridian/useGetMeridianNames";

function MeridianLibrary() {
  const { meridians, loading: meridiansLoading } = useGetMeridianNames();
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [meridianData, setMeridianData] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isManager, setIsManager] = useState<boolean>(false);

  const navigate = useNavigate();

  const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    const groupMeridianByLetter = () => {
      try {
        const grouped: Record<string, string[]> = {};

        meridians.forEach((meridian: string) => {
          const firstLetter = meridian[0].toUpperCase();
          if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
          }
          grouped[firstLetter].push(meridian);
        });

        // Sort meridians within each letter group
        Object.keys(grouped).forEach((letter) => {
          grouped[letter] = grouped[letter].sort((a, b) =>
            a.localeCompare(b),
          );
        });

        setMeridianData(grouped);

        // Set first available letter as selected
        const firstAvailableLetter = alphabetLetters.find(
          (letter) => grouped[letter],
        );
        if (firstAvailableLetter) {
          setSelectedLetter(firstAvailableLetter);
        }
      } catch (err) {
        console.error("Error grouping meridians:", err);
      }
    };

    if (meridians.length > 0) {
      groupMeridianByLetter();
    }
  }, [meridians]);

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      setIsManager(false);
      return;
    }

    setIsManager(session.title?.toLowerCase() === "manager");
  }, []);

  // Filter meridians based on search term and category
  const filteredMeridianes = useMemo(() => {
    let meridians = searchTerm.trim() 
      ? Object.values(meridianData).flat()
      : (meridianData[selectedLetter] || []);
  
    const searchLower = searchTerm.toLowerCase();
    
    return meridians.filter((meridian) => {
      const matchesSearch = !searchTerm.trim() || 
        meridian.toLowerCase().includes(searchLower);
     
      return matchesSearch;
    });
  }, [meridianData, selectedLetter, searchTerm, ]);

  // Filter meridians by category for letter-grouped view
  const filteredMeridianData = useMemo(() => {
    

    const filtered: Record<string, string[]> = {};
    Object.keys(meridianData).forEach((letter) => {
      const filteredForLetter = meridianData[letter]
      if (filteredForLetter.length > 0) {
        filtered[letter] = filteredForLetter;
      }
    });
    return filtered;
  }, [meridianData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (meridiansLoading) {
    return <LoadingPage />;
  }

  const checkAccess = (action: () => void) => {
    if (!isManager) {
      alert("You don't have access to this action.");
      return;
    }

    action();
  };

  return (
    <PageShell className="p-8">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeading title="Meridian Library" />
          {(isManager) && (<Button
            variant="secondary"
            size="sm"
            onClick={() => checkAccess(() => navigate('/acupunctureCreate'))}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
              <FontAwesomeIcon icon={faPenToSquare} />
            </span>
            Add Meridian
          </Button>)}
        </div>
        {/* Search and Filter Section */}
        <div className="flex gap-3 mb-6">
         
          <input
            type="text"
            placeholder="Search the meridian"
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
              const hasMeridianes =
                filteredMeridianData[letter] && filteredMeridianData[letter].length > 0;
              const isSelected = selectedLetter === letter;

              return (
                <button
                  key={letter}
                  onClick={() => {
                    if (hasMeridianes) {
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
                  disabled={!hasMeridianes}
                  className={`w-8 h-8 rounded-full font-semibold text-sm transition-all duration-150 ${isSelected
                    ? "bg-teal-600 text-white shadow-sm"
                    : hasMeridianes
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
                Found {filteredMeridianes.length} result
                {filteredMeridianes.length !== 1 ? "s" : ""} for "{searchTerm}"

              </div>
            </div>

            <div className="space-y-1">
              {filteredMeridianes.length > 0 ? (
                filteredMeridianes.map((meridian, index) => (
                  <div
                    key={meridian || index}
                    onClick={() =>
                        //TODO: implemet meridianAcupunctureShow page
                      navigate("/meridianAcupunctureShow", {
                        state: { meridianName: meridian },
                      })
                    }
                    className="py-6 px-4 hover:bg-slate-50 cursor-pointer transition-colors duration-150 border-b border-slate-200 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">
                        {meridian}
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
                  No meridians found matching your search
                </div>
              )}
            </div>
          </>
        ) : (
          /* Show all letters with their meridians (filtered by category) */
          <div className="space-y-6 fade-in">
            {alphabetLetters.map((letter) => {
              const meridiansForLetter = filteredMeridianData[letter] || [];

              // Only show letters that have meridians
              if (meridiansForLetter.length === 0) return null;

              return (
                <div key={letter} id={`letter-${letter}`}>
                  {/* Letter Badge */}
                  <div className="mb-3">
                    <div className="inline-block px-4 py-2 bg-[#DCE8E9] text-[#2F919C] font-semibold rounded-md w-full">
                      {letter}
                    </div>
                  </div>

                  {/* Meridian Names for this letter */}
                  <div className="space-y-1 mb-6">
                    {meridiansForLetter.map((meridian, index) => (
                      <div
                        key={meridian || `${letter}-${index}`}
                        onClick={() =>
                          navigate("/meridianAcupunctureShow", {
                            state: { meridianName: meridian },
                          })
                        }
                        className="py-6 px-4 hover:bg-slate-50 cursor-pointer transition-colors duration-150 border-b border-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">
                            {meridian}
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

            {Object.keys(filteredMeridianData).length === 0 && (
              <div className="py-8 text-center text-slate-500">
                {"No meridians available"}
              </div>
            )}
          </div>
        )}
      </Card>
    </PageShell>
  );
}

export default MeridianLibrary;
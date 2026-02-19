import { useState, useEffect, useMemo } from "react";
import {
  SectionHeading,
  Button,
  Table,
} from "~/presentation/designSystem";
import { useGetIllnessList } from "~/presentation/hooks/illness/useGetIllnessList";
import AcupunctureShowCard from "./AcupunctureShowCard";
import MultiSelectDropdown from "./MultiSelectDropdown";
import LoadingPage from "./common/LoadingPage";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";
import { useGetMedicalRecordAcupunctureList } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useGetMedicalRecordAcupunctureList";

interface CreateMedicalRecordIllnessProps {
  selectedIllnessIds: number[];
  onSelectedIllnessIdsChange: (illnessIds: number[]) => void;
}

export default function CreateMedicalRecordIllness({
  selectedIllnessIds,
  onSelectedIllnessIdsChange,
}: CreateMedicalRecordIllnessProps) {
  const { illnesses, loading: illnessesLoading } = useGetIllnessList();
  const { acupunctures, loading: acupuncturesLoading } = useGetAcupunctureList();
  const { acupunctureRecords, loading: acupunctureRecordsLoading } = useGetMedicalRecordAcupunctureList();

  const [selectedIllnessNames, setSelectedIllnessNames] = useState<string[]>([]);
  const [toggledMeridians, setToggledMeridians] = useState<
    Record<string, Set<number>>
  >({});

  const toggleIllness = (illnessName: string) => {
    const normalized = illnessName.toLowerCase();

    setSelectedIllnessNames((prev) =>
      prev.includes(normalized)
        ? prev.filter((name) => name !== normalized)
        : [...prev, normalized],
    );
  };

  const getIllnessName = (illness: any) => illness.illnessName;

  // Update parent component when selected illness IDs change
  useEffect(() => {
    if (!illnesses) return;

    const ids = illnesses
      .filter((illness) =>
        selectedIllnessNames.includes(illness.illnessName.toLowerCase()),
      )
      .map((illness) => illness.illnessId);

    onSelectedIllnessIdsChange(ids);
  }, [selectedIllnessNames, illnesses, onSelectedIllnessIdsChange]);

  const visibleMeridians = useMemo(() => {
    if (!acupunctureRecords || !acupunctures) return {};

    const recordedIds = new Set<number>();
    acupunctureRecords.forEach((r) => recordedIds.add(r.acupunctureId));

    const initial: Record<string, Set<number>> = {};
    acupunctures.forEach((acu) => {
      if (recordedIds.has(acu.acupunctureId)) {
        const key = `${acu.region.toLowerCase()}-${acu.side.toLowerCase()}`;
        if (!initial[key]) {
          initial[key] = new Set();
        }
        initial[key].add(acu.meridianId);
      }
    });

    return initial;
  }, [acupunctureRecords, acupunctures]);

  useEffect(() => {
    setToggledMeridians(
      Object.entries(visibleMeridians).reduce((acc, [key, meridianIds]) => {
        acc[key] = new Set(meridianIds);
        return acc;
      }, {} as Record<string, Set<number>>),
    );
  }, [visibleMeridians]);

  const toggleMeridianVisibility = (
    region: string,
    side: string,
    meridianId: number,
  ) => {
    const key = `${region.toLowerCase()}-${side.toLowerCase()}`;
    setToggledMeridians((prev) => {
      const newSet = new Set(prev[key] || []);
      if (newSet.has(meridianId)) {
        newSet.delete(meridianId);
      } else {
        newSet.add(meridianId);
      }
      return { ...prev, [key]: newSet };
    });
  };

  const illnessMap = useMemo(() => {
    if (!illnesses) return new Map();
    return new Map(illnesses.map((i) => [i.illnessId, i]));
  }, [illnesses]);

  if (illnessesLoading) return <LoadingPage />;

  return (
    <div>
      <SectionHeading title="Assign Illnesses" />

      <div className="space-y-4">
        <MultiSelectDropdown
          choices={illnesses}
          selectedChoices={selectedIllnessNames}
          onToggleChoice={toggleIllness}
          getChoiceName={getIllnessName}
          dropdownPlaceholder="illnesses"
        />
        {selectedIllnessIds.map((illnessId) => {
          const illness = illnessMap.get(illnessId);

          return (
            <div key={illnessId}>
              <div className="inline-block px-4 py-2 mb-2 bg-[#DCE8E9] text-[#2F919C] font-semibold rounded-md w-full">
                {illness?.illnessName}
              </div>

              <AcupunctureShowCard
                illnessId={illnessId}
                visibleMeridians={toggledMeridians}
                onMeridianToggle={toggleMeridianVisibility}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
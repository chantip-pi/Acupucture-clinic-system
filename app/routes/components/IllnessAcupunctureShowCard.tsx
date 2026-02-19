import { useState, useMemo, useEffect } from "react";
import { SectionHeading, Card, Table } from "~/presentation/designSystem";
import AcupunctureShowCard from "./AcupunctureShowCard";
import { useGetMedicalRecordIllnessById } from "~/presentation/hooks/medicalRecordIllness/useGetMedicalRecordIllnessById";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";
import { useGetIllnessList } from "~/presentation/hooks/illness/useGetIllnessList";
import { useGetIllnessAcupunctureList } from "~/presentation/hooks/illnessAcupuncture/useGetIllnessAcupunctureList";
import LoadingPage from "./common/LoadingPage";

interface IllnessAcupunctureShowCardProps {
  recordId: number;
}

function IllnessAcupunctureShowCard({ recordId }: IllnessAcupunctureShowCardProps) {
  const { illnessRecords, loading: loadingIllnessRecords } = useGetMedicalRecordIllnessById(recordId);
  const { acupunctures } = useGetAcupunctureList();
  const { illnesses } = useGetIllnessList();
  const { illnessAcupunctures } = useGetIllnessAcupunctureList();
  const [allIllnessAcupunctures, setAllIllnessAcupunctures] = useState<any[]>([]);
  const [loadingAcupunctures, setLoadingAcupunctures] = useState(false);

  const illnessMap = useMemo(() => {
    if (!illnesses) return new Map<number, string>();

    return new Map(illnesses.map((i) => [i.illnessId, i.illnessName]));
  }, [illnesses]);

  const illnessAcupunctureMap = useMemo(() => {
    const map = new Map<number, number[]>();

    if (!illnessAcupunctures) return map;

    illnessAcupunctures.forEach((row) => {
      if (!map.has(row.illnessId)) {
        map.set(row.illnessId, []);
      }

      map.get(row.illnessId)!.push(row.acupunctureId);
    });

    return map;
  }, [illnessAcupunctures]);

  useEffect(() => {
    if (!illnessRecords || illnessRecords.length === 0) {
      setAllIllnessAcupunctures([]);
      return;
    }

    const fetchAllIllnessAcupunctures = async () => {
      setLoadingAcupunctures(true);
      try {
        const promises = illnessRecords.map(async (illness) => {
          const acupunctureIds = illnessAcupunctureMap.get(illness.illnessId) ?? [];

          return acupunctureIds.map((acupunctureId) => ({
            illnessId: illness.illnessId,
            acupunctureId,
          }));
        });

        const results = await Promise.all(promises);
        const allAcupunctures = results.flat();
        setAllIllnessAcupunctures(allAcupunctures);
      } catch (error) {
        console.error("Error fetching illness acupunctures:", error);
        setAllIllnessAcupunctures([]);
      } finally {
        setLoadingAcupunctures(false);
      }
    };

    fetchAllIllnessAcupunctures();
  }, [illnessRecords]);

  const acupunctureIllnessMap = useMemo(() => {
    const map = new Map<number, number[]>();

    allIllnessAcupunctures.forEach((record) => {
      if (!map.has(record.acupunctureId)) {
        map.set(record.acupunctureId, []);
      }

      map.get(record.acupunctureId)!.push(record.illnessId);
    });

    return map;
  }, [allIllnessAcupunctures]);

  const visibleMeridians = useMemo(() => {
    if (!allIllnessAcupunctures || !acupunctures) return {};

    const recordedIds = new Set<number>();
    allIllnessAcupunctures.forEach((r) => recordedIds.add(r.acupunctureId));

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
  }, [allIllnessAcupunctures, acupunctures]);

  const [toggledMeridians, setToggledMeridians] = useState<
    Record<string, Set<number>>
  >({});

  const selectedAcupunctures = useMemo(() => {
    if (!allIllnessAcupunctures || !acupunctures) return [];

    const recordedIds = new Set(
      allIllnessAcupunctures.map((r) => r.acupunctureId),
    );
    return acupunctures.filter((acu) => recordedIds.has(acu.acupunctureId));
  }, [allIllnessAcupunctures, acupunctures]);

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

  const loading = loadingIllnessRecords || loadingAcupunctures;

  if (loading) {
    return (
      <LoadingPage/>
    );
  }

  if (!illnessRecords || illnessRecords.length === 0) {
    return (
      <Card>
        <SectionHeading title="Illness Acupuncture Points" />
        <div className="p-4 text-slate-600">
          No illnesses found for this medical record.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeading
        title="Illness Acupuncture Points"
        description={`Showing acupuncture points for ${
          illnessRecords.length
        } illness${illnessRecords.length !== 1 ? "es" : ""}`}
      />

      {/* Show illness names */}
      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
        <h4 className="text-sm font-semibold text-slate-900 mb-2">
          Illnesses:
        </h4>
        <div className="flex flex-wrap gap-2">
          {illnessRecords.map((illness) => (
            <span
              key={illness.illnessId}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {illnessMap.get(illness.illnessId) ??
                `Illness ${illness.illnessId}`}
            </span>
          ))}
        </div>
      </div>

      {/* Show acupuncture cards for each illness */}
      {illnessRecords.map((illness) => (
        <div key={illness.illnessId} className="mb-6">
          <div className="inline-block px-4 py-2 mb-2 bg-[#DCE8E9] text-[#2F919C] font-semibold rounded-md w-full">
            {illnessMap.get(illness.illnessId) ??
              `Illness ${illness.illnessId}`}
          </div>
          <AcupunctureShowCard
            illnessId={illness.illnessId}
            visibleMeridians={toggledMeridians}
            onMeridianToggle={toggleMeridianVisibility}
          />
        </div>
      ))}

      {/* All selected points summary table */}
      {selectedAcupunctures.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            All Illness Acupuncture Points
          </h3>
          <Table
            headers={[
              "Acupuncture Code",
              "Acupuncture Name",
              "Meridian",
              "Region",
              "Side",
              "Illness",
            ]}
          >
            {selectedAcupunctures.map((point) => (
              <tr
                key={`${point.region}-${point.side}-${point.acupunctureId}`}
                className="hover:bg-slate-50"
              >
                <td className="px-4 py-2 text-sm font-medium text-slate-900">
                  {point.acupointCode}
                </td>
                <td className="px-4 py-2 text-sm text-slate-600">
                  {point.acupointName}
                </td>
                <td className="px-4 py-2 text-sm text-slate-600">
                  {point.meridianName}
                </td>
                <td className="px-4 py-2 text-sm text-slate-900">
                  {point.region && typeof point.region === "string"
                    ? point.region.charAt(0).toUpperCase() +
                      point.region.slice(1)
                    : ""}
                </td>
                <td className="px-4 py-2 text-sm text-slate-600 capitalize">
                  {point.side && typeof point.side === "string"
                    ? point.side.charAt(0).toUpperCase() + point.side.slice(1)
                    : ""}
                </td>
                <td className="px-4 py-2 text-sm text-slate-900">
                  {acupunctureIllnessMap
                    .get(point.acupunctureId)
                    ?.map((illnessId) => illnessMap.get(illnessId))
                    .join(", ") ?? "-"}
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}
    </Card>
  );
}

export default IllnessAcupunctureShowCard;
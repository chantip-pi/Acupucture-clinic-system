import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PageShell,
  SectionHeading,
  Card,
  Table,
  Button,
} from "~/presentation/designSystem";
import AcupunctureShowCard from "./components/AcupunctureShowCard";
import { useGetMedicalRecordAcupunctureById } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useGetMedicalRecordAcupunctureById";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingPage from "./components/common/LoadingPage";

function AcupunctureShowPage() {
  //show acupuncture points for a medical record
  const { state } = useLocation();
  const recordId = state?.recordId;
  const navigate = useNavigate();

  const { acupunctureRecords, loading: acupunctureRecordsLoading } = useGetMedicalRecordAcupunctureById(recordId);
  const { acupunctures, loading: acupuncturesLoading } = useGetAcupunctureList();

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

  const [toggledMeridians, setToggledMeridians] = useState<
    Record<string, Set<number>>
  >({});

  const selectedAcupunctures = useMemo(() => {
    if (!acupunctureRecords || !acupunctures) return [];

    const recordedIds = new Set(acupunctureRecords.map((r) => r.acupunctureId));
    return acupunctures.filter((acu) => recordedIds.has(acu.acupunctureId));
  }, [acupunctureRecords, acupunctures]);

  const sortedSelectedAcupunctures = useMemo(() => {
    return [...selectedAcupunctures].sort((a, b) => {
      const codeA = a.acupointCode ?? "";
      const codeB = b.acupointCode ?? "";

      return codeA.localeCompare(codeB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [selectedAcupunctures]);

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

  if (acupunctureRecordsLoading || acupuncturesLoading) {
    return <LoadingPage />;
  }

  return (
    <PageShell className="p-8">
      <div className="flex items-center gap-3 py-4">
        <Button size="sm" variant="back" onClick={() => navigate(-1)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          Back
        </Button>
      </div>

      <Card>
        <SectionHeading title="Show Acupuncture Points" />
        <AcupunctureShowCard
          recordId={recordId}
          visibleMeridians={toggledMeridians}
          onMeridianToggle={toggleMeridianVisibility}
        />

        {/* All selected points summary table */}
        {acupunctureRecords.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              All Selected Points
            </h3>
            <Table
              headers={[
                "Acupuncture Code",
                "Acupuncture Name",
                "Meridian",
                "Region",
                "Side",
              ]}
            >
              {sortedSelectedAcupunctures.map((point) => (
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
                </tr>
              ))}
            </Table>
          </div>
        )}
      </Card>
    </PageShell>
  );
}

export default AcupunctureShowPage;

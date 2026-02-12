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
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";
import { useGetIllnessAcupunctureById } from "~/presentation/hooks/illnessAcupuncture/useGetIllnessAcupunctureById";
import { useGetIllnessById } from "~/presentation/hooks/illness/useGetIllnessById";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function IllnessAcupunctureShow() {
  //show acupuncture points for an illness
  const { state } = useLocation();
  const illnessId = state?.illnessId;
  const navigate = useNavigate();

  const { acupunctures } = useGetAcupunctureList();
  const { illnessAcupunctures } = useGetIllnessAcupunctureById(illnessId);
  const { illness } = useGetIllnessById(illnessId);

  const visibleMeridians = useMemo(() => {
    if (!acupunctures) return {};

    const recordedIds = new Set<number>();
    illnessAcupunctures.forEach((r) => recordedIds.add(r.acupunctureId));

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
  }, [illnessAcupunctures, acupunctures]);

  const [toggledMeridians, setToggledMeridians] = useState<
    Record<string, Set<number>>
  >({});

  const selectedAcupunctures = useMemo(() => {
    if (!illnessAcupunctures || !acupunctures) return [];

    const recordedIds = new Set(
      illnessAcupunctures.map((r) => r.acupunctureId),
    );
    return acupunctures.filter((acu) => recordedIds.has(acu.acupunctureId));
  }, [illnessAcupunctures, acupunctures]);

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
        <SectionHeading title="Acupuncture Point Library" />
        <h1 className="font-semibold">Illness: {illness?.illnessName}</h1>
        <p className="pb-4">{illness?.description}</p>
        <AcupunctureShowCard
          illnessId={illnessId}
          visibleMeridians={toggledMeridians}
          onMeridianToggle={toggleMeridianVisibility}
        />

        {/* All points summary table */}
        {illnessAcupunctures.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              Acupuncture Points
            </h3>
            <Table
              headers={[
                "Region",
                "Side",
                "Acupuncture Code",
                "Acupuncture Name",
                "Meridian",
              ]}
            >
              {selectedAcupunctures.map((point) => (
                <tr
                  key={`${point.region}-${point.side}-${point.acupunctureId}`}
                  className="hover:bg-slate-50"
                >
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
                  <td className="px-4 py-2 text-sm font-medium text-slate-900">
                    {point.acupointCode}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {point.acupointName}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {point.meridianName}
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

export default IllnessAcupunctureShow;

import React, { useState, useMemo, useEffect } from "react";
import { PageShell, SectionHeading, Card } from "~/presentation/designSystem";
import AcupunctureShowCard from "./components/AcupunctureShowCard";
import { useGetMedicalRecordAcupunctureById } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useGetMedicalRecordAcupunctureById";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";

function AcupunctureShowPage() {
  const recordId = 1;

  const { acupunctureRecords } = useGetMedicalRecordAcupunctureById(recordId);
  const { acupunctures } = useGetAcupunctureList();

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

  const [toggledMeridians, setToggledMeridians] = useState<Record<string, Set<number>>>({});

  useEffect(() => {
    setToggledMeridians(
      Object.entries(visibleMeridians).reduce((acc, [key, meridianIds]) => {
        acc[key] = new Set(meridianIds);
        return acc;
      }, {} as Record<string, Set<number>>)
    );
  }, [visibleMeridians]);

  const toggleMeridianVisibility = (
    region: string,
    side: string,
    meridianId: number
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
      <Card>
        <SectionHeading title="Show Acupuncture Points" />
        <AcupunctureShowCard
          recordId={recordId}
          visibleMeridians={toggledMeridians}
          onMeridianToggle={toggleMeridianVisibility}
        />
      </Card>
    </PageShell>
  );
}

export default AcupunctureShowPage;
import React, { useState, useEffect } from "react";
import { PageShell, SectionHeading, Card } from "~/presentation/designSystem";
import AcupunctureShowCard from "./components/AcupunctureShowCard";
import { useGetMeridianList } from "~/presentation/hooks/meridian/useGetMeridianList";
import { useGetMedicalRecordAcupunctureById } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useGetMedicalRecordAcupunctureById";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";

function AcupunctureShowPage() {
  const recordId = 1;

  const { meridians } = useGetMeridianList();
  const { acupunctureRecords } = useGetMedicalRecordAcupunctureById(recordId);
  const { acupunctures } = useGetAcupunctureList();
  const [visibleMeridians, setVisibleMeridians] = useState<Record<string, Set<number>>>({});

  useEffect(() => {
    if (!meridians || !acupunctureRecords || !acupunctures) return;

    const recordedIds = new Set<number>();
    if (Array.isArray(acupunctureRecords)) {
      acupunctureRecords.forEach((r) => recordedIds.add(r.acupunctureId));
    } else if (acupunctureRecords?.acupunctureId) {
      recordedIds.add(acupunctureRecords.acupunctureId);
    }

    const recordedMeridianIds = new Set<number>();
    acupunctures.forEach((acu) => {
      if (recordedIds.has(acu.acupunctureId)) {
        recordedMeridianIds.add(acu.meridianId);
      }
    });

    const initial: Record<string, Set<number>> = {};
    meridians.forEach((meridian) => {
      if (recordedMeridianIds.has(meridian.meridianId)) {
        const key = `${meridian.region.toLowerCase()}-${meridian.side.toLowerCase()}`;
        if (!initial[key]) {
          initial[key] = new Set();
        }
        initial[key].add(meridian.meridianId);
      }
    });

    setVisibleMeridians(initial);
  }, [meridians, acupunctureRecords, acupunctures]);

  const toggleMeridianVisibility = (
    region: string,
    side: string,
    meridianId: number
  ) => {
    const key = `${region.toLowerCase()}-${side.toLowerCase()}`;
    setVisibleMeridians((prev) => {
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
          visibleMeridians={visibleMeridians}
          onMeridianToggle={toggleMeridianVisibility}
        />
      </Card>
    </PageShell>
  );
}

export default AcupunctureShowPage;
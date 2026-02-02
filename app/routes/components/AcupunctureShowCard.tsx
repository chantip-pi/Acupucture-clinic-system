import React, { useMemo, useState, useEffect } from "react";
import { Card } from "~/presentation/designSystem";
import { useGetMedicalRecordAcupunctureById } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useGetMedicalRecordAcupunctureById";
import { useGetAcupointLocationList } from "~/presentation/hooks/acupointLocation/useGetAcupointLocationList";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";
import { useGetMeridianById } from "~/presentation/hooks/meridian/useGetMeridianById";
import { useGetMeridianList } from "~/presentation/hooks/meridian/useGetMeridianList";
import type { MedicalRecordAcupuncture } from "~/domain/entities/MedicalRecordAcupuncture";

interface RecordedAcupuncturePoint {
  acupunctureId: number;
  acupointCode: string;
  acupointName: string;
  x: number;
  y: number;
  meridianId: number;
  meridianName: string;
  locationId: number;
}

interface AcupunctureShowCardProps {
  recordId?: number;
  illnessId?: number;
  visibleMeridians: Record<string, Set<number>>;
  onMeridianToggle: (region: string, side: string, meridianId: number) => void;
}

// Single region/side view component
interface RegionViewProps {
  regionSideKey: string;
  region: string;
  side: string;
  allPoints: RecordedAcupuncturePoint[];
  visibleMeridianIds: Set<number>;
  onMeridianToggle: (region: string, side: string, meridianId: number) => void;
}

function RegionView({
  region,
  side,
  allPoints,
  visibleMeridianIds,
  onMeridianToggle,
}: RegionViewProps) {
  // Get the first meridian for the image
  const firstMeridianId = allPoints[0]?.meridianId;
  const { meridian } = useGetMeridianById(firstMeridianId);

  const handleMeridianToggle = (toggledMeridianId: number) => {
    onMeridianToggle(region, side, toggledMeridianId);
  };

  // Filter points based on visible meridians
  const visiblePoints = allPoints.filter((point) =>
    visibleMeridianIds.has(point.meridianId)
  );

  // Group all unique meridians in this view
  const meridiansInView = useMemo(() => {
    const meridianMap = new Map<number, { meridianId: number; meridianName: string }>();
    allPoints.forEach((point) => {
      if (!meridianMap.has(point.meridianId)) {
        meridianMap.set(point.meridianId, {
          meridianId: point.meridianId,
          meridianName: point.meridianName,
        });
      }
    });
    return Array.from(meridianMap.values());
  }, [allPoints]);

  return (
    <Card padding="sm">
      <p className="mb-2 text-sm font-medium text-slate-600">
        {meridian?.region} {meridian?.side} view
      </p>

      <div className="flex flex-row gap-4">
        <div className="relative h-96 w-full rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
          {meridian?.image ? (
            <div className="relative h-full">
              <img
                src={meridian.image}
                alt={`${meridian?.region} ${meridian?.side} view`}
                className="h-full object-contain"
              />

              {/* MARKERS */}
              <div className="absolute inset-0">
                {visiblePoints.map((point) => (
                  <div
                    key={point.acupunctureId}
                    className={`absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 bg-teal-500 ring-2 ring-teal-600`}
                    style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    title={`${point.acupointCode} - ${point.acupointName} (${point.meridianName})`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              No image available for this view
            </div>
          )}
        </div>

        {/* Meridian selection sidebar - only show if there are multiple meridians */}
        {meridiansInView.length > 0 && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 w-1/5">
            <p className="mb-2 text-md font-semibold text-center">Meridian</p>
            <div className="flex flex-col gap-2">
              {meridiansInView.map((m) => {
                const isVisible = visibleMeridianIds.has(m.meridianId);
                const pointCount = allPoints.filter(
                  (p) => p.meridianId === m.meridianId
                ).length;

                return (
                  <label
                    key={m.meridianId}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => handleMeridianToggle(m.meridianId)}
                      title={`${pointCount} points`}
                    />
                    {m.meridianName}
                    <span className="text-sm">
                      {!isVisible && (
                        <span className="ml-1 text-red-600">
                          ({pointCount})
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function AcupunctureShowCard({
  recordId,
  visibleMeridians,
  onMeridianToggle,
}: AcupunctureShowCardProps) {
  const [pointsByRegionSide, setPointsByRegionSide] = useState<Map<string, RecordedAcupuncturePoint[]>>(new Map());

  const { acupunctureRecords } = useGetMedicalRecordAcupunctureById(recordId || 0);
  const { acupunctures } = useGetAcupunctureList();
  const { acupointLocations } = useGetAcupointLocationList();
  const { meridians } = useGetMeridianList();

  const acupunctureById = useMemo(() => {
    const map = new Map<number, any>();
    (acupunctures || []).forEach((a) => map.set(a.acupunctureId, a));
    return map;
  }, [acupunctures]);

  const locationByCode = useMemo(() => {
    const map = new Map<string, any>();
    (acupointLocations || []).forEach((l) => map.set(l.acupointCode, l));
    return map;
  }, [acupointLocations]);

  const meridianInfoMap = useMemo(() => {
    const infoMap = new Map<number, { region: string; side: string; meridianName: string }>();
    meridians.forEach((meridian) => {
      infoMap.set(meridian.meridianId, {
        region: meridian.region,
        side: meridian.side,
        meridianName: meridian.meridianName,
      });
    });
    return infoMap;
  }, [meridians]);

  const recordedIds = useMemo(() => {
    const set = new Set<number>();
    if (!acupunctureRecords) return set;
    if (Array.isArray(acupunctureRecords)) {
      acupunctureRecords.forEach((r: MedicalRecordAcupuncture) =>
        set.add(r.acupunctureId)
      );
    } else if ((acupunctureRecords as any).acupunctureId) {
      set.add((acupunctureRecords as any).acupunctureId);
    }
    return set;
  }, [acupunctureRecords]);

  useEffect(() => {
    if (!recordId || !acupunctures || !acupointLocations || !meridians) {
      setPointsByRegionSide(new Map());
      return;
    }

    // Convert all recorded points to full data
    const allPoints: RecordedAcupuncturePoint[] = Array.from(recordedIds)
      .map((id) => {
        const acupuncture = acupunctureById.get(id);
        if (!acupuncture) return null;

        const location = locationByCode.get(acupuncture.acupointCode);
        if (!location) return null;

        return {
          acupunctureId: acupuncture.acupunctureId,
          acupointCode: acupuncture.acupointCode,
          acupointName: acupuncture.acupointName ?? "",
          x: location.pointLeft,
          y: location.pointTop,
          meridianId: acupuncture.meridianId,
          meridianName:
            meridianInfoMap.get(acupuncture.meridianId)?.meridianName ??
            acupuncture.meridianName ??
            "",
          locationId: location.locationId,
        } as RecordedAcupuncturePoint;
      })
      .filter((p): p is RecordedAcupuncturePoint => p != null);

    // Group points by region/side
    const grouped = new Map<string, RecordedAcupuncturePoint[]>();
    allPoints.forEach((point) => {
      const meridianInfo = meridianInfoMap.get(point.meridianId);
      if (!meridianInfo) return;

      const key = `${meridianInfo.region.toLowerCase()}-${meridianInfo.side.toLowerCase()}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(point);
    });

    setPointsByRegionSide(grouped);
  }, [
    recordId,
    acupunctureRecords,
    acupunctures,
    acupointLocations,
    meridians,
    acupunctureById,
    locationByCode,
    recordedIds,
    meridianInfoMap,
  ]);

  const regionSideKeys = Array.from(pointsByRegionSide.keys());

  if (regionSideKeys.length === 0) {
    return (
      <Card padding="sm">
        <div className="text-slate-400 text-sm text-center py-8">
          No acupuncture points recorded
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {regionSideKeys.map((regionSideKey) => {
        const [region, side] = regionSideKey.split("-");
        const allPoints = pointsByRegionSide.get(regionSideKey) || [];
        const visibleMeridianIds = visibleMeridians[regionSideKey] || new Set();

        return (
          <RegionView
            key={regionSideKey}
            regionSideKey={regionSideKey}
            region={region}
            side={side}
            allPoints={allPoints}
            visibleMeridianIds={visibleMeridianIds}
            onMeridianToggle={onMeridianToggle}
          />
        );
      })}
    </div>
  );
}

export default AcupunctureShowCard;
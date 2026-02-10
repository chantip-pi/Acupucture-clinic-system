import { useMemo, useState, useEffect } from "react";
import { Card, Table } from "~/presentation/designSystem";
import { useGetMedicalRecordAcupunctureById } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useGetMedicalRecordAcupunctureById";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";

interface RecordedAcupuncturePoint {
  acupunctureId: number;
  acupointCode: string;
  acupointName: string;
  x: number;
  y: number;
  meridianId: number;
  meridianName: string;
  locationId: number;
  region: string;
  side: string;
  image: string | null;
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
  // Get the image from first point (all points in same region/side view have same image)
  const imageUrl = allPoints[0]?.image || null;

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
    <div className="space-y-4">
      <Card padding="sm">
        <p className="mb-2 text-sm font-medium text-slate-600">
          {region.charAt(0).toUpperCase() + region.slice(1)} {side.toLowerCase()} view
        </p>

        <div className="flex flex-row gap-4">
          <div className="relative h-96 w-full rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
            {imageUrl ? (
              <div className="relative h-full">
                <img
                  src={imageUrl}
                  alt={`${region} ${side} view`}
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

      {/* Selected points table for this view */}
      {visiblePoints.length > 0 && (
        <div>
          <Table headers={["Acupuncture Code", "Acupuncture Name", "Meridian"]}>
            {visiblePoints.map((point) => (
              <tr key={point.acupunctureId} className="hover:bg-slate-50">
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
    </div>
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

  useEffect(() => {
    if (!recordId || !acupunctures || !acupunctureRecords) {
      setPointsByRegionSide(new Map());
      return;
    }

    const recordedIds = new Set<number>();
    acupunctureRecords.forEach((r) => recordedIds.add(r.acupunctureId));

    // Filter acupunctures that were recorded
    const recordedAcupunctures = acupunctures.filter((acu) =>
      recordedIds.has(acu.acupunctureId)
    );

    // Convert to RecordedAcupuncturePoint using all fields from Acupuncture entity
    const allPoints: RecordedAcupuncturePoint[] = recordedAcupunctures.map((acu) => ({
      acupunctureId: acu.acupunctureId,
      acupointCode: acu.acupointCode,
      acupointName: acu.acupointName,
      x: acu.pointLeft,
      y: acu.pointTop,
      meridianId: acu.meridianId,
      meridianName: acu.meridianName,
      locationId: acu.locationId,
      region: acu.region,
      side: acu.side,
      image: acu.image,
    } as RecordedAcupuncturePoint));

    // Group points by region/side
    const grouped = new Map<string, RecordedAcupuncturePoint[]>();
    allPoints.forEach((point) => {
      const key = `${point.region.toLowerCase()}-${point.side.toLowerCase()}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(point);
    });

    setPointsByRegionSide(grouped);
  }, [recordId, acupunctureRecords, acupunctures]);

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
import { useMemo, useState, useEffect } from "react";
import { Card, Table } from "~/presentation/designSystem";
import { useGetMedicalRecordAcupunctureById } from "~/presentation/hooks/medicalRecordAcupuncture.ts/useGetMedicalRecordAcupunctureById";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";
import { AcupuncturePoint, AcupunctureShowCardProps, ShowCardRegionViewProps } from "~/domain/entities/AcupuncturePoint";
import { useGetIllnessAcupunctureById } from "~/presentation/hooks/illnessAcupuncture/useGetIllnessAcupunctureById";
import { IMAGE_BASE_URL } from "~/constants/api";

const LATERAL_CONFIG = {
  LEFT:  { label: "Left",  short: "L", ring: "ring-[#FF0000]",   bg: "bg-red-50",   text: "text-red-700",   dot: "bg-teal-500" },
  RIGHT: { label: "Right", short: "R", ring: "ring-[#0000FF]",  bg: "bg-blue-50",  text: "text-blue-700",  dot: "bg-teal-500" },
  BOTH:  { label: "Both",  short: "B", ring: "ring-[#00FF00]", bg: "bg-green-50", text: "text-green-700", dot: "bg-teal-500" },
} as const;

type LateralSide = keyof typeof LATERAL_CONFIG;

function LateralBadge({ side }: { side: string | undefined }) {
  if (!side || !(side in LATERAL_CONFIG)) {
    return <span className="text-slate-400 text-sm">—</span>;
  }
  const cfg = LATERAL_CONFIG[side as LateralSide];
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold
        ${cfg.bg} ${cfg.text} border border-current border-opacity-20
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          side === "LEFT" ? "bg-red-500" : side === "RIGHT" ? "bg-blue-500" : "bg-green-500"
        }`}
      />
      {cfg.label}
    </span>
  );
}

function RegionView({
  region,
  side,
  allPoints,
  visibleMeridianIds,
  onMeridianToggle,
}: ShowCardRegionViewProps) {
  const fullImageUrl = `${IMAGE_BASE_URL}/${allPoints[0]?.image}`;

  const visiblePoints = useMemo(() => {
    return allPoints
      .filter((point) => visibleMeridianIds.has(point.meridianId))
      .sort((a, b) =>
        a.acupointCode.localeCompare(b.acupointCode, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );
  }, [allPoints, visibleMeridianIds]);

  return (
    <div className="space-y-4 fade-in">
      <Card padding="sm">
        <p className="mb-2 text-sm font-medium text-slate-600">
          {region.charAt(0).toUpperCase() + region.slice(1)}{" "}
          {side.toLowerCase()} view
        </p>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-3">
          {(["LEFT", "RIGHT", "BOTH"] as LateralSide[]).map((s) => {
            const cfg = LATERAL_CONFIG[s];
            return (
              <div key={s} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`
                  w-3 h-3 rounded-full bg-teal-500
                  ring-2 ${cfg.ring}
                `} />
                {cfg.label}
              </div>
            );
          })}
        </div>

        <div className="flex flex-row gap-4">
          <div className="relative h-96 w-full rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
            {fullImageUrl ? (
              <div className="relative h-full z-10">
                <img
                  src={fullImageUrl}
                  alt={`${region} ${side} view`}
                  className="h-full object-contain"
                />

                {/* MARKERS */}
                <div className="absolute inset-0">
                  {visiblePoints.map((point) => {
                    const lateralCfg = point.lateralSide
                      ? LATERAL_CONFIG[point.lateralSide as LateralSide]
                      : null;

                    // Ring color: colored if lateralSide is set, default teal otherwise
                    const ringClass = lateralCfg
                      ? `ring-2 ${lateralCfg.ring}`
                      : "ring-2 ring-teal-600";

                    return (
                      <div
                        key={point.acupunctureId}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${point.pointLeft}%`,
                          top: `${point.pointTop}%`,
                        }}
                        title={`${point.acupointCode} – ${point.acupointName} (${point.meridianName})${point.lateralSide ? ` · ${LATERAL_CONFIG[point.lateralSide as LateralSide]?.label}` : ""}`}
                      >
                        {/* DOT with colored ring */}
                        <div className={`w-2.5 h-2.5 rounded-full bg-teal-500 ${ringClass}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-sm">
                No image available for this view
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Selected points table */}
      {visiblePoints.length > 0 && (
        <Table
          headers={[
            "Acupuncture Code",
            "Acupuncture Name",
            "Meridian",
            "Lateral Side",
          ]}
        >
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
              <td className="px-4 py-2">
                <LateralBadge side={point.lateralSide} />
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}

function AcupunctureShowCard({
  recordId,
  illnessId,
  visibleMeridians,
  onMeridianToggle,
}: AcupunctureShowCardProps) {
  const [pointsByRegionSide, setPointsByRegionSide] = useState<Map<string, AcupuncturePoint[]>>(new Map());

  const { acupunctureRecords } = useGetMedicalRecordAcupunctureById(recordId || 0);
  const { acupunctures } = useGetAcupunctureList();
  const { illnessAcupunctures } = useGetIllnessAcupunctureById(illnessId || 0);

  useEffect(() => {
    if (!acupunctures) return;
    if (recordId && !acupunctureRecords) return;
    if (illnessId && !illnessAcupunctures) return;

    if (!(recordId || illnessId)) {
      setPointsByRegionSide(new Map());
      return;
    }

    const recordedIds = new Set<number>();
    const lateralSideMap = new Map<number, string>();

    if (recordId) {
      acupunctureRecords.forEach((r) => {
        recordedIds.add(r.acupunctureId);
        lateralSideMap.set(r.acupunctureId, r.lateralSide);
      });
    } else if (illnessId) {
      illnessAcupunctures.forEach((r) => {
        recordedIds.add(r.acupunctureId);
      });
    }

    const recordedAcupunctures = acupunctures.filter((acu) =>
      recordedIds.has(acu.acupunctureId)
    );

    const allPoints: AcupuncturePoint[] = recordedAcupunctures.map((acu) => ({
      acupunctureId: acu.acupunctureId,
      acupointCode: acu.acupointCode,
      acupointName: acu.acupointName,
      pointLeft: acu.pointLeft,
      pointTop: acu.pointTop,
      meridianId: acu.meridianId,
      meridianName: acu.meridianName,
      locationId: acu.locationId,
      region: acu.region,
      side: acu.side,
      image: acu.image,
      lateralSide: lateralSideMap.get(acu.acupunctureId),
    }));

    const grouped = new Map<string, AcupuncturePoint[]>();
    allPoints.forEach((point) => {
      const key = `${point.region.toLowerCase()}-${point.side.toLowerCase()}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(point);
    });

    setPointsByRegionSide(grouped);
  }, [recordId, illnessId, acupunctureRecords, illnessAcupunctures, acupunctures]);

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
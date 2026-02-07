import React, { useMemo } from "react";
import { Table } from "~/presentation/designSystem";
import AcupunctureCard from "./AcupunctureCard";
import { useGetAcupunctureByRegionAndSide } from "~/presentation/hooks/acupuncture/useGetAcupunctureByRegionAndSide";
import type { Meridian } from "~/domain/entities/Meridian";

type ViewSide = string;

interface AcupuncturePoint {
  acupunctureId: number;
  acupointCode: string;
  acupointName: string;
  locationId: number;
  pointLeft: number;
  pointTop: number;
  meridianId: number;
  meridianName: string;
  region: string;
  side: string;
  image: string;
}

interface SelectedPoint extends AcupuncturePoint {
  region: string;
  side: ViewSide;
  key: string;
}

interface Props {
  region: string;
  side: string;
  selectedPoints: SelectedPoint[];
  visibleMeridians: Record<string, Set<number>>;
  handlePointClick: (point: AcupuncturePoint, region: string, side: string) => void;
  toggleMeridianVisibility: (region: string, side: string, meridianId: number) => void;
  setSelectedPoints: React.Dispatch<React.SetStateAction<SelectedPoint[]>>;
}

export default function RegionSideView({
  region,
  side,
  selectedPoints,
  visibleMeridians,
  handlePointClick,
  toggleMeridianVisibility,
  setSelectedPoints,
}: Props) {
  const { acupunctures: acupsForView } = useGetAcupunctureByRegionAndSide(
    region,
    side,
  );

  const meridiansForView = useMemo(() => {
    const map = new Map<number, Meridian>();
    (acupsForView || []).forEach((a) => {
      if (!map.has(a.meridianId)) {
        map.set(a.meridianId, {
          meridianId: a.meridianId,
          meridianName: a.meridianName,
          image: a.image,
          region: a.region,
          side: a.side,
        } as Meridian);
      }
    });
    return Array.from(map.values());
  }, [acupsForView]);

  // group points by meridianId
  const pointsByMeridian = useMemo(() => {
    const map = new Map<number, AcupuncturePoint[]>();
    (acupsForView || []).forEach((a) => {
      const p: AcupuncturePoint = {
        acupunctureId: a.acupunctureId,
        acupointCode: a.acupointCode,
        acupointName: a.acupointName,
        locationId: a.locationId,
        pointLeft: a.pointLeft,
        pointTop: a.pointTop,
        meridianId: a.meridianId,
        meridianName: a.meridianName,
        region: a.region,
        side: a.side,
        image: a.image,
      };
      if (!map.has(p.meridianId)) map.set(p.meridianId, []);
      map.get(p.meridianId)!.push(p);
    });
    return map;
  }, [acupsForView]);

  const regionKey = `${region.toLowerCase()}-${side.toLowerCase()}`;
  const visibleMeridianIds = visibleMeridians[regionKey] || new Set<number>();

  const allPoints: AcupuncturePoint[] = [];
  pointsByMeridian.forEach((pts) => allPoints.push(...pts));

  const visiblePoints: AcupuncturePoint[] = [];
  pointsByMeridian.forEach((pts, mid) => {
    if (visibleMeridianIds.has(mid)) visiblePoints.push(...pts);
  });

  const imageUrl = meridiansForView[0]?.image || null;

  return (
    <div className="space-y-4">
      <AcupunctureCard
        bodyPart={region}
        side={side}
        label={side && typeof side === "string" ? side : ""}
        meridiansForView={meridiansForView}
        visiblePoints={visiblePoints}
        allPoints={allPoints}
        selectedPoints={selectedPoints}
        visibleMeridianIds={visibleMeridianIds}
        imageUrl={imageUrl}
        onPointClick={(point: AcupuncturePoint) =>
          handlePointClick(point, region, side)
        }
        onMeridianToggle={(meridianId: number) =>
          toggleMeridianVisibility(region, side, meridianId)
        }
      />

      {/* Selected points table for this view */}
      {selectedPoints.filter((p) => p.region === region && p.side === side)
        .length > 0 && (
        <div className="mt-3">
          <Table headers={["Acupoint Code", "Name", "Meridian", "Actions"]}>
            {selectedPoints
              .filter((p) => p.region === region && p.side === side)
              .map((point) => (
                <tr key={point.key} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-sm font-medium text-slate-900">
                    {point.acupointCode}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {point.acupointName}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600">
                    {point.meridianName}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() =>
                        setSelectedPoints(
                          (prev) => prev.filter((p) => p.key !== point.key),
                        )
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </Table>
        </div>
      )}
    </div>
  );
}

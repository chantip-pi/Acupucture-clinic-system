import React from "react";
import { Table } from "~/presentation/designSystem";
import AcupunctureCard from "./AcupunctureCard";
import {
  AcupuncturePoint,
  RegionSideViewProps,
} from "~/domain/entities/AcupuncturePoint";
import { IMAGE_BASE_URL } from "~/constants/api";

export default function RegionSideView({
  region,
  side,
  meridianId,
  meridianName,
  points,
  selectedPoints,
  handlePointClick,
}: RegionSideViewProps) {
  if (!points.length) return null;

  const imageUrl = `${IMAGE_BASE_URL}/${points[0].image}`;

  const meridianSelectedPoints = selectedPoints.filter(
    (p) => p.meridianId === meridianId,
  );

  const visibleMeridianIds = new Set<number>([meridianId]);

  return (
    <div className="space-y-3 grid grid-cols-2 gap-2">
      <AcupunctureCard
        bodyPart={region}
        side={side}
        label={`${meridianName} – ${region} ${side}`}
        meridiansForView={[
          {
            meridianId,
            meridianName,
            region,
            side,
            image: points[0].image,
          },
        ]}
        visiblePoints={points}
        allPoints={points}
        selectedPoints={selectedPoints}
        visibleMeridianIds={visibleMeridianIds}
        imageUrl={imageUrl}
        onPointClick={(point: AcupuncturePoint) =>
          handlePointClick(point, region, side)
        }
      />

      {meridianSelectedPoints.length > 0 && (
        <div className="mt-3">
          <Table headers={["Acupuncture Code", "Acupuncture Name", "Actions"]}>
            {meridianSelectedPoints.map((point) => (
              <tr key={point.key} className="hover:bg-slate-50">
                <td className="px-4 py-2">{point.acupointCode}</td>
                <td className="px-4 py-2">{point.acupointName}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handlePointClick(point, region, side)}
                    className="text-red-600"
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

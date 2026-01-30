import React, { useState, useEffect, useMemo } from "react";
import { Card, SectionHeading, Button, Table } from "~/presentation/designSystem";
import { useGetAcupointList } from "~/presentation/hooks/acupoint/useGetAcupointList";
import { useGetAcupointLocationList } from "~/presentation/hooks/acupointLocation/useGetAcupointLocationList";
import { useGetMeridianList } from "~/presentation/hooks/meridian/useGetMeridianList";
import type { Acupoint } from "~/domain/entities/Acupoint";
import type { AcupointLocation } from "~/domain/entities/AcupointLocation";
import type { Meridian } from "~/domain/entities/Meridian";

type BodyPart = "Head" | "Neck" | "Arms" | "Torso" | "Legs";
type ViewSide = "front" | "back" | "left" | "right";

interface AcupuncturePoint {
  acupointCode: string;
  acupointName: string;
  x: number; // pointLeft as percentage
  y: number; // pointTop as percentage
  meridianId: number;
  meridianName: string;
  locationId: number;
}

interface SelectedPoint extends AcupuncturePoint {
  bodyPart: BodyPart;
  side: ViewSide;
  key: string;
}

const BODY_PARTS: BodyPart[] = ["Head", "Neck", "Arms", "Torso", "Legs"];

const VIEW_SIDES: { key: ViewSide; label: string }[] = [
  { key: "front", label: "Front" },
  { key: "back", label: "Back" },
  { key: "left", label: "Left" },
  { key: "right", label: "Right" },
];

const defaultViews: Record<ViewSide, boolean> = {
  front: false,
  back: false,
  left: false,
  right: false,
};

function AcupunctureCard() {
  const { acupoints, loading: acupointsLoading } = useGetAcupointList();
  const { acupointLocations, loading: locationsLoading } = useGetAcupointLocationList();
  const { meridians, loading: meridiansLoading } = useGetMeridianList();

  const loading = acupointsLoading || locationsLoading || meridiansLoading;

  const acupointMap = useMemo(() => {
    const map = new Map<string, Acupoint>();
    acupoints.forEach((point) => {
      map.set(point.acupointCode, point);
    });
    return map;
  }, [acupoints]);

  const meridianMap = useMemo(() => {
    const map = new Map<number, Meridian>();
    meridians.forEach((meridian) => {
      map.set(meridian.meridianId, meridian);
    });
    return map;
  }, [meridians]);

  const meridiansByRegionSide = useMemo(() => {
    const map = new Map<string, Meridian[]>();
    meridians.forEach((meridian) => {
      const key = `${meridian.region.toLowerCase()}-${meridian.side.toLowerCase()}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(meridian);
    });
    return map;
  }, [meridians]);

  const pointsByRegionSideMeridian = useMemo(() => {
    const map = new Map<string, Map<number, AcupuncturePoint[]>>();
    
    acupointLocations.forEach((location) => {
      const meridian = meridianMap.get(location.meridianId);
      if (!meridian) return;

      const regionKey = `${meridian.region.toLowerCase()}-${meridian.side.toLowerCase()}`;
      if (!map.has(regionKey)) {
        map.set(regionKey, new Map());
      }

      const meridianMapForRegion = map.get(regionKey)!;
      if (!meridianMapForRegion.has(location.meridianId)) {
        meridianMapForRegion.set(location.meridianId, []);
      }

      const acupoint = acupointMap.get(location.acupointCode);
      if (acupoint) {
        meridianMapForRegion.get(location.meridianId)!.push({
          acupointCode: acupoint.acupointCode,
          acupointName: acupoint.acupointName,
          x: location.pointLeft,
          y: location.pointTop,
          meridianId: location.meridianId,
          meridianName: meridian.meridianName,
          locationId: location.locationId,
        });
      }
    });

    return map;
  }, [acupointLocations, acupointMap, meridianMap]);

  const [selectedParts, setSelectedParts] = useState<BodyPart[]>(["Head"]);
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);

  const [visibleMeridians, setVisibleMeridians] = useState<
    Record<string, Set<number>>
  >({});

  // Initialize visible meridians - show all by default
  useEffect(() => {
    if (meridians.length > 0) {
      const initial: Record<string, Set<number>> = {};
      meridiansByRegionSide.forEach((meridianList, key) => {
        initial[key] = new Set(meridianList.map((m) => m.meridianId));
      });
      setVisibleMeridians(initial);
    }
  }, [meridians, meridiansByRegionSide]);

  const [viewsByPart, setViewsByPart] = useState<
    Record<BodyPart, Record<ViewSide, boolean>>
  >({
    Head: { ...defaultViews, front: true },
    Neck: { ...defaultViews },
    Arms: { ...defaultViews },
    Torso: { ...defaultViews },
    Legs: { ...defaultViews },
  });

  const toggleBodyPart = (part: BodyPart) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const toggleView = (part: BodyPart, view: ViewSide) => {
    setViewsByPart((prev) => ({
      ...prev,
      [part]: {
        ...prev[part],
        [view]: !prev[part][view],
      },
    }));
  };

  const toggleMeridianVisibility = (region: string, side: string, meridianId: number) => {
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

  const handlePointClick = (
    point: AcupuncturePoint,
    bodyPart: BodyPart,
    side: ViewSide
  ) => {
    const pointKey = `${bodyPart}-${side}-${point.meridianId}-${point.acupointCode}`;
    const existingIndex = selectedPoints.findIndex((p) => p.key === pointKey);

    if (existingIndex >= 0) {
      setSelectedPoints(selectedPoints.filter((_, i) => i !== existingIndex));
    } else {
      setSelectedPoints([
        ...selectedPoints,
        {
          key: pointKey,
          bodyPart,
          side,
          ...point,
        },
      ]);
    }
  };

  const isPointSelected = (
    acupointCode: string,
    meridianId: number,
    bodyPart: BodyPart,
    side: ViewSide
  ) => {
    const pointKey = `${bodyPart}-${side}-${meridianId}-${acupointCode}`;
    return selectedPoints.some((p) => p.key === pointKey);
  };

  const handleSave = async () => {
    // Prepare data structure for saving
    const saveData = {
      selectedPoints: selectedPoints.map((point) => ({
        acupointCode: point.acupointCode,
        meridianId: point.meridianId,
        locationId: point.locationId,
        bodyPart: point.bodyPart,
        side: point.side,
      })),
      timestamp: new Date().toISOString(),
    };

    console.log("Saving points:", saveData);
    // TODO: Implement database save
    // await fetch('/api/medical-record-acupuncture', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(saveData)
    // });

    alert(`Saved ${selectedPoints.length} acupuncture points to database`);
  };

  // Get points for a specific region/side combination (only visible meridians)
  const getVisiblePointsForRegionSide = (
    bodyPart: BodyPart,
    side: ViewSide
  ): AcupuncturePoint[] => {
    const key = `${bodyPart.toLowerCase()}-${side.toLowerCase()}`;
    const meridianMapForRegion = pointsByRegionSideMeridian.get(key);
    if (!meridianMapForRegion) return [];

    const visibleMeridianIds = visibleMeridians[key] || new Set();
    const allPoints: AcupuncturePoint[] = [];

    meridianMapForRegion.forEach((points, meridianId) => {
      if (visibleMeridianIds.has(meridianId)) {
        allPoints.push(...points);
      }
    });

    return allPoints;
  };

  // Get all meridians for a region/side (including hidden ones)
  const getMeridiansForRegionSide = (
    bodyPart: BodyPart,
    side: ViewSide
  ): Meridian[] => {
    const key = `${bodyPart.toLowerCase()}-${side.toLowerCase()}`;
    return meridiansByRegionSide.get(key) || [];
  };

  // Get all points for a region/side (including from hidden meridians)
  const getAllPointsForRegionSide = (
    bodyPart: BodyPart,
    side: ViewSide
  ): AcupuncturePoint[] => {
    const key = `${bodyPart.toLowerCase()}-${side.toLowerCase()}`;
    const meridianMapForRegion = pointsByRegionSideMeridian.get(key);
    if (!meridianMapForRegion) return [];

    const allPoints: AcupuncturePoint[] = [];
    meridianMapForRegion.forEach((points) => {
      allPoints.push(...points);
    });

    return allPoints;
  };

  // Get image for a region/side combination from meridians
  const getImageForRegionSide = (
    bodyPart: BodyPart,
    side: ViewSide
  ): string | null => {
    const key = `${bodyPart.toLowerCase()}-${side.toLowerCase()}`;
    const meridiansForView = meridiansByRegionSide.get(key);
    
    if (!meridiansForView || meridiansForView.length === 0) {
      return null;
    }

    // Use the first visible meridian's image, or fallback to the first meridian's image
    const visibleMeridianIds = visibleMeridians[key] || new Set();
    const visibleMeridian = meridiansForView.find((m) =>
      visibleMeridianIds.has(m.meridianId)
    );

    if (visibleMeridian) {
      return visibleMeridian.image;
    }

    return meridiansForView[0]?.image || null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted">
        <div className="text-lg text-slate-600">Loading acupuncture data...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <main className="flex-1 p-8">
        <Card>
          <SectionHeading
            title="Acupuncture Point Selection"
            description="Select body parts and views to mark acupuncture points"
          />

          {/* Selected points counter */}
          {selectedPoints.length > 0 && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
              {selectedPoints.length} point
              {selectedPoints.length !== 1 ? "s" : ""} selected
            </div>
          )}

          {/* Body part selector */}
          <div className="mb-6 flex flex-wrap gap-3">
            {BODY_PARTS.map((part) => (
              <Button
                key={part}
                size="sm"
                variant={selectedParts.includes(part) ? "primary" : "secondary"}
                onClick={() => toggleBodyPart(part)}
              >
                {part}
              </Button>
            ))}
          </div>

          {/* Selected body parts */}
          <div className="space-y-10">
            {selectedParts.map((part) => (
              <div key={part}>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  {part}
                </h3>

                {/* View selector */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {VIEW_SIDES.map(({ key, label }) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={viewsByPart[part][key] ? "primary" : "ghost"}
                      onClick={() => toggleView(part, key)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Images with meridian selection */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {VIEW_SIDES.filter(({ key }) => viewsByPart[part][key]).map(
                    ({ key, label }) => {
                      const regionKey = `${part.toLowerCase()}-${key.toLowerCase()}`;
                      const meridiansForView = getMeridiansForRegionSide(part, key);
                      const visiblePoints = getVisiblePointsForRegionSide(part, key);
                      const allPoints = getAllPointsForRegionSide(part, key);
                      const visibleMeridianIds = visibleMeridians[regionKey] || new Set();
                      const imageUrl = getImageForRegionSide(part, key);

                      return (
                        <div key={key} className="space-y-4">
                          <Card padding="sm">
                            <p className="mb-2 text-sm font-medium text-slate-600">
                              {label}
                            </p>

                            <div className="relative h-96 w-full rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
                              {imageUrl ? (
                                <img
                                  key={imageUrl}
                                  src={imageUrl}
                                  alt={`${part} ${label}`}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <div className="text-slate-400 text-sm">
                                  No image available for this view
                                </div>
                              )}

                              {/* Render clickable points for visible meridians */}
                              {visiblePoints.map((point) => {
                                const selected = isPointSelected(
                                  point.acupointCode,
                                  point.meridianId,
                                  part,
                                  key
                                );
                                return (
                                  <div
                                    key={`${point.acupointCode}-${point.meridianId}`}
                                    onClick={() => handlePointClick(point, part, key)}
                                    className={`absolute cursor-pointer transition-all ${
                                      selected
                                        ? "bg-teal-500 ring-2 ring-teal-600"
                                        : "bg-red-500 hover:bg-red-600"
                                    } rounded-full w-4 h-4 -translate-x-1/2 -translate-y-1/2`}
                                    style={{
                                      left: `${point.x}%`,
                                      top: `${point.y}%`,
                                    }}
                                    title={`${point.acupointCode} - ${point.acupointName} (${point.meridianName})`}
                                  />
                                );
                              })}
                            </div>

                            {/* Meridian selection card */}
                            {meridiansForView.length > 0 && (
                              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <p className="mb-2 text-xs font-semibold text-slate-700">
                                  Visible Meridians:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {meridiansForView.map((meridian) => {
                                    const isVisible = visibleMeridianIds.has(
                                      meridian.meridianId
                                    );
                                    const pointsForMeridian =
                                      allPoints.filter(
                                        (p) => p.meridianId === meridian.meridianId
                                      );
                                    const selectedCountForMeridian =
                                      selectedPoints.filter(
                                        (p) =>
                                          p.meridianId === meridian.meridianId &&
                                          p.bodyPart === part &&
                                          p.side === key
                                      ).length;

                                    return (
                                      <button
                                        key={meridian.meridianId}
                                        onClick={() =>
                                          toggleMeridianVisibility(
                                            part,
                                            key,
                                            meridian.meridianId
                                          )
                                        }
                                        className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                          isVisible
                                            ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                                            : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                                        }`}
                                        title={`${pointsForMeridian.length} points, ${selectedCountForMeridian} selected`}
                                      >
                                        {meridian.meridianName}
                                        {selectedCountForMeridian > 0 &&
                                          !isVisible && (
                                            <span className="ml-1 text-red-600">
                                              ({selectedCountForMeridian})
                                            </span>
                                          )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Selected points table for this view */}
                            {selectedPoints.filter(
                              (p) => p.bodyPart === part && p.side === key
                            ).length > 0 && (
                              <div className="mt-3">
                                <Table
                                  headers={[
                                    "Acupoint Code",
                                    "Name",
                                    "Meridian",
                                    "Actions",
                                  ]}
                                >
                                  {selectedPoints
                                    .filter((p) => p.bodyPart === part && p.side === key)
                                    .map((point) => (
                                      <tr
                                        key={point.key}
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
                                        <td className="px-4 py-2 text-sm">
                                          <button
                                            onClick={() =>
                                              setSelectedPoints(
                                                selectedPoints.filter(
                                                  (p) => p.key !== point.key
                                                )
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
                          </Card>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* All selected points summary table */}
          {selectedPoints.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                All Selected Points
              </h3>
              <Table
                headers={[
                  "Region",
                  "Side",
                  "Acupoint Code",
                  "Name",
                  "Meridian",
                  "Actions",
                ]}
              >
                {selectedPoints.map((point) => (
                  <tr key={point.key} className="hover:bg-slate-50">
                    <td className="px-4 py-2 text-sm text-slate-900">
                      {point.bodyPart}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-600 capitalize">
                      {point.side}
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
                    <td className="px-4 py-2 text-sm">
                      <button
                        onClick={() =>
                          setSelectedPoints(
                            selectedPoints.filter((p) => p.key !== point.key)
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

          <div className="mt-8 flex justify-end">
            <Button variant="primary" onClick={handleSave}>
              Save Selected Points ({selectedPoints.length})
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default AcupunctureCard;

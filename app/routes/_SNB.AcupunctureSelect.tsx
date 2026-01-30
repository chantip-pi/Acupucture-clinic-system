import React, { useState, useEffect, useMemo } from "react";
import {
  PageShell,
  Card,
  SectionHeading,
  Button,
  Table,
} from "~/presentation/designSystem";
import AcupunctureCard from "./components/AcupunctureCard";
import { useGetAcupointList } from "~/presentation/hooks/acupoint/useGetAcupointList";
import { useGetAcupointLocationList } from "~/presentation/hooks/acupointLocation/useGetAcupointLocationList";
import { useGetMeridianRegion } from "~/presentation/hooks/meridian/useGetMeridianRegion";
import { useGetMeridianList } from "~/presentation/hooks/meridian/useGetMeridianList";
import { useGetMeridianSidesByRegion } from "~/presentation/hooks/meridian/useGetMeridianSidesByRegion";
import { Acupoint } from "~/domain/entities/Acupoint";
import { AcupointLocation } from "~/domain/entities/AcupointLocation";
import { Meridian } from "~/domain/entities/Meridian";
import { Acupuncture } from "~/domain/entities/Acupuncture";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";

type ViewSide = string;

interface AcupuncturePoint {
  acupunctureId: number;
  acupointCode: string;
  acupointName: string;
  x: number; // pointLeft as percentage
  y: number; // pointTop as percentage
  meridianId: number;
  meridianName: string;
  locationId: number;
}

interface SelectedPoint extends AcupuncturePoint {
  region: string;
  side: ViewSide;
  key: string;
}

const defaultViews: Record<ViewSide, boolean> = {
  front: false,
  back: false,
  left: false,
  right: false,
};

function AcupunctureSelect() {
  const { acupoints, loading: acupointsLoading } = useGetAcupointList(null);
  const { acupointLocations, loading: locationsLoading } =
    useGetAcupointLocationList();
  const { meridians, loading: meridiansLoading } = useGetMeridianList();
  const { regions, loading: regionsLoading } = useGetMeridianRegion();
  const { acupunctures, loading: acupuncturesLoading } = useGetAcupunctureList();

  const getRegionName = (regionObj: any): string | null => {
    if (typeof regionObj === "string") return regionObj;
    if (typeof regionObj?.region === "string") return regionObj.region;
    if (typeof regionObj?.regionName === "string") return regionObj.regionName;
    if (typeof regionObj?.name === "string") return regionObj.name;
    if (typeof regionObj?.value === "string") return regionObj.value;

    return null;
  };

  const loading =
    acupointsLoading || locationsLoading || meridiansLoading || regionsLoading;

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

  const acupunctureMap = useMemo(() => {
    const map = new Map<number, Acupuncture>();
    acupunctures.forEach((acupuncture) => {
      map.set(acupuncture.acupunctureId, acupuncture);
    });
    return map;
  }, [acupunctures]);

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
        // Find the acupuncture record matching this acupoint code and meridian ID
        let acupunctureId = 0;
        for (const acupuncture of acupunctures) {
          if (
            acupuncture.acupointCode === location.acupointCode &&
            acupuncture.meridianId === location.meridianId
          ) {
            acupunctureId = acupuncture.acupunctureId;
            break;
          }
        }

        meridianMapForRegion.get(location.meridianId)!.push({
          acupunctureId: acupunctureId,
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
  }, [acupointLocations, acupointMap, meridianMap, acupunctures]);

  const [selectedRegions, setSelectedRegions] = useState<string[]>(() => {
    if (regions && regions.length > 0) {
      const firstRegion = regions[0];
      const regionName = getRegionName(firstRegion);
      return regionName ? [regionName] : [];
    }
    return [];
  });

  useEffect(() => {
    if (regions && regions.length > 0 && selectedRegions.length === 0) {
      const first = getRegionName(regions[0]);
      if (first) {
        setSelectedRegions([first]);
      }
    }
  }, [regions]);

  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);

  const [visibleMeridians, setVisibleMeridians] = useState<
    Record<string, Set<number>>
  >({});

  useEffect(() => {
    if (meridians.length > 0) {
      const initial: Record<string, Set<number>> = {};
      meridiansByRegionSide.forEach((meridianList, key) => {
        initial[key] = new Set(meridianList.map((m) => m.meridianId));
      });
      setVisibleMeridians(initial);
    }
  }, [meridians, meridiansByRegionSide]);

  const [viewsByRegion, setViewsByRegion] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const { sidesByRegion } = useGetMeridianSidesByRegion(selectedRegions);

  const toggleRegion = (region: string) => {
    const normalized = region.toLowerCase();

    setSelectedRegions((prev) =>
      prev.includes(normalized)
        ? prev.filter((r) => r !== normalized)
        : [...prev, normalized],
    );
  };

  const toggleView = (region: string, side: string) => {
    setViewsByRegion((prev) => ({
      ...prev,
      [region]: {
        ...prev[region],
        [side]: !prev[region]?.[side],
      },
    }));
  };

  const toggleMeridianVisibility = (
    region: string,
    side: string,
    meridianId: number,
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

  const handlePointClick = (
    point: AcupuncturePoint,
    region: string,
    side: string,
  ) => {
    const pointKey = `${region}-${side}-${point.meridianId}-${point.acupointCode}`;
    const existingIndex = selectedPoints.findIndex((p) => p.key === pointKey);

    if (existingIndex >= 0) {
      setSelectedPoints(selectedPoints.filter((_, i) => i !== existingIndex));
    } else {
      setSelectedPoints([
        ...selectedPoints,
        {
          key: pointKey,
          region,
          side,
          ...point,
        },
      ]);
    }
  };

  const handleSave = async () => {
    const saveData = {
      selectedPoints: selectedPoints.map((point) => ({
        acupunctureId: point.acupunctureId,
        // acupointCode: point.acupointCode,
        // meridianId: point.meridianId,
        // locationId: point.locationId,
        // region: point.region,
        // side: point.side,
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

  const getVisiblePointsForRegionSide = (
    region: string,
    side: string,
  ): AcupuncturePoint[] => {
    const key = `${region.toLowerCase()}-${side.toLowerCase()}`;
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
    region: string,
    side: string,
  ): Meridian[] => {
    const key = `${region.toLowerCase()}-${side.toLowerCase()}`;
    return meridiansByRegionSide.get(key) || [];
  };

  // Get all points for a region/side (including from hidden meridians)
  const getAllPointsForRegionSide = (
    region: string,
    side: string,
  ): AcupuncturePoint[] => {
    const key = `${region.toLowerCase()}-${side.toLowerCase()}`;
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
    region: string,
    side: string,
  ): string | null => {
    const key = `${region.toLowerCase()}-${side.toLowerCase()}`;
    const meridiansForView = meridiansByRegionSide.get(key);

    if (!meridiansForView || meridiansForView.length === 0) {
      return null;
    }

    // Use the first visible meridian's image, or fallback to the first meridian's image
    const visibleMeridianIds = visibleMeridians[key] || new Set();
    const visibleMeridian = meridiansForView.find((m) =>
      visibleMeridianIds.has(m.meridianId),
    );

    if (visibleMeridian) {
      return visibleMeridian.image;
    }

    return meridiansForView[0]?.image || null;
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center bg-surface-muted">
          <div className="text-lg text-slate-600">
            Loading acupuncture data...
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="p-8">
      <Card>
        <SectionHeading
          title="Acupuncture Point Selection"
          description="Choose body part for acupuncture"
        />

        {/* Region selector */}
        <div className="mb-6 flex flex-wrap gap-3">
          {regions.map((regionObj, index) => {
            const regionName = getRegionName(regionObj);

            if (!regionName) {
              console.warn("Invalid region object:", regionObj);
              return null;
            }

            return (
              <Button
                key={`${regionName}-${index}`}
                variant={
                  selectedRegions.includes(regionName) ? "primary" : "secondary"
                }
                onClick={() => toggleRegion(regionName)}
              >
                {regionName && typeof regionName === "string"
                  ? regionName.charAt(0).toUpperCase() + regionName.slice(1)
                  : ""}
              </Button>
            );
          })}
        </div>

        {/* Selected regions */}
        <div className="space-y-4">
          {selectedRegions.map((region) => {
            const sidesForRegion = sidesByRegion[region] || [];
            return (
              <div key={region}>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  {region && typeof region === "string"
                    ? region.charAt(0).toUpperCase() + region.slice(1)
                    : ""}
                </h3>

                {/* Side selector */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {sidesForRegion.map((side) => (
                    <Button
                      key={side}
                      size="sm"
                      variant={
                        viewsByRegion[region]?.[side] ? "primary" : "secondary"
                      }
                      onClick={() => toggleView(region, side)}
                    >
                      {side && typeof side === "string"
                        ? side.charAt(0).toUpperCase() + side.slice(1)
                        : ""}
                    </Button>
                  ))}
                </div>

                {/* Images with meridian selection */}
                <div className="flex flex-col gap-4">
                  {sidesForRegion
                    .filter((side) => viewsByRegion[region]?.[side])
                    .map((side) => {
                      const regionKey = `${region.toLowerCase()}-${side.toLowerCase()}`;
                      const meridiansForView = getMeridiansForRegionSide(
                        region,
                        side,
                      );
                      const visiblePoints = getVisiblePointsForRegionSide(
                        region,
                        side,
                      );
                      const allPoints = getAllPointsForRegionSide(region, side);
                      const visibleMeridianIds =
                        visibleMeridians[regionKey] || new Set();
                      const imageUrl = getImageForRegionSide(region, side);
                      const sideLabel =
                        side && typeof side === "string"
                          ? side.charAt(0).toUpperCase() + side.slice(1)
                          : "";

                      return (
                        <div key={side} className="space-y-4">
                          <AcupunctureCard
                            bodyPart={region}
                            side={side}
                            label={sideLabel}
                            meridiansForView={meridiansForView}
                            visiblePoints={visiblePoints}
                            allPoints={allPoints}
                            selectedPoints={selectedPoints}
                            visibleMeridianIds={visibleMeridianIds}
                            imageUrl={imageUrl}
                            onPointClick={(point) =>
                              handlePointClick(point, region, side)
                            }
                            onMeridianToggle={(meridianId) =>
                              toggleMeridianVisibility(region, side, meridianId)
                            }
                          />

                          {/* Selected points table for this view */}
                          {selectedPoints.filter(
                            (p) => p.region === region && p.side === side,
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
                                  .filter(
                                    (p) =>
                                      p.region === region && p.side === side,
                                  )
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
                                                (p) => p.key !== point.key,
                                              ),
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
                    })}
                </div>
              </div>
            );
          })}
        </div>

        {selectedPoints.length > 0 && (
          <div className="my-4 rounded-lg bg-[#DCE8E9] p-3 text-md text-[#2F919C] font-semibold">
            {selectedPoints.length} Acupuncture point
            {selectedPoints.length !== 1 ? "s" : ""} selected
          </div>
        )}

        {/* All selected points summary table */}
        {selectedPoints.length > 0 && (
          <div>
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
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() =>
                        setSelectedPoints(
                          selectedPoints.filter((p) => p.key !== point.key),
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
            Save
          </Button>
        </div>
      </Card>
    </PageShell>
  );
}

export default AcupunctureSelect;

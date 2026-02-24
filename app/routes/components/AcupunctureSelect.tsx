import { useState, useEffect, useMemo } from "react";
import {
  PageShell,
  SectionHeading,
  Button,
  Table,
  Input,
} from "~/presentation/designSystem";
import RegionSideView from "./RegionSideView";
import { useGetMeridianList } from "~/presentation/hooks/meridian/useGetMeridianList";
import { useGetAcupunctureList } from "~/presentation/hooks/acupuncture/useGetAcupunctureList";
import {
  AcupuncturePoint,
  SelectedPoint,
} from "~/domain/entities/AcupuncturePoint";

interface AcupunctureSelectProps {
  selectedPoints: SelectedPoint[];
  onSelectedPointsChange: (points: SelectedPoint[]) => void;
  hideShell?: boolean;
  hideSaveButton?: boolean;
}

function AcupunctureSelect({
  selectedPoints,
  onSelectedPointsChange,
  hideShell = false,
  hideSaveButton = false,
}: AcupunctureSelectProps) {
  const { meridians, loading: meridiansLoading } = useGetMeridianList();
  const { acupunctures, loading: acupuncturesLoading } =
    useGetAcupunctureList();

  const [searchMode, setSearchMode] = useState<"meridian" | "point">(
    "meridian",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMeridians, setSelectedMeridians] = useState<number[]>([]);
  const loading = meridiansLoading || acupuncturesLoading;

  // Filter meridians based on search
  const filteredMeridians = useMemo(() => {
    if (!searchQuery || searchMode !== "meridian") return meridians;
    return meridians.filter((m) =>
      m.meridianName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [meridians, searchQuery, searchMode]);

  // Filter acupoints based on search
  const filteredAcupoints = useMemo(() => {
    if (!searchQuery || searchMode !== "point") return [];
    return acupunctures.filter(
      (acu) =>
        acu.acupointCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acu.acupointName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [acupunctures, searchQuery, searchMode]);

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const [visibleMeridians, setVisibleMeridians] = useState<
    Record<string, Set<number>>
  >({});

  useEffect(() => {
    if (meridians.length > 0) {
      const initial: Record<string, Set<number>> = {};
      meridians.forEach((m) => {
        const key = `${m.region.toLowerCase()}-${m.side.toLowerCase()}`;
        if (!initial[key]) initial[key] = new Set<number>();
        initial[key].add(m.meridianId);
      });
      setVisibleMeridians(initial);
    }
  }, [meridians]);

  const [viewsByRegion, setViewsByRegion] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const pointsByMeridian = useMemo(() => {
    const map = new Map<number, AcupuncturePoint[]>();

    acupunctures.forEach((a) => {
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
  }, [acupunctures]);

  const toggleView = (region: string, side: string) => {
    const isCurrentlyVisible = viewsByRegion[region]?.[side];

    if (isCurrentlyVisible) {
      onSelectedPointsChange(
        selectedPoints.filter(
          (p) =>
            !(
              p.region?.toLowerCase() === region.toLowerCase() &&
              p.side?.toLowerCase() === side.toLowerCase()
            ),
        ),
      );
    }

    setViewsByRegion((prev) => ({
      ...prev,
      [region]: {
        ...prev[region],
        [side]: !prev[region]?.[side],
      },
    }));
  };

  const cleanupMeridianIfEmpty = (nextPoints: SelectedPoint[]) => {
    setSelectedMeridians((prev) =>
      prev.filter((meridianId) =>
        nextPoints.some((p) => p.meridianId === meridianId),
      ),
    );
  };

  const handlePointClick = (
    point: AcupuncturePoint,
    region: string,
    side: string,
  ) => {
    const exists = selectedPoints.some(
      (p) => p.acupunctureId === point.acupunctureId,
    );

    let nextPoints: SelectedPoint[];

    if (exists) {
      nextPoints = selectedPoints.filter(
        (p) => p.acupunctureId !== point.acupunctureId,
      );
    } else {
      nextPoints = [
        ...selectedPoints,
        {
          key: `${point.region}-${point.side}-${point.locationId}`,

          acupunctureId: point.acupunctureId,
          meridianId: point.meridianId,
          meridianName: point.meridianName,

          acupointCode: point.acupointCode,
          acupointName: point.acupointName,

          locationId: point.locationId,
          pointLeft: point.pointLeft,
          pointTop: point.pointTop,
          image: point.image,

          region,
          side,
        },
      ];
    }

    onSelectedPointsChange(nextPoints);
    cleanupMeridianIfEmpty(nextPoints);
  };

  if (loading) {
    const content = (
      <div className="flex min-h-screen items-center justify-center bg-surface-muted">
        <div className="text-lg text-slate-600">
          Loading acupuncture data...
        </div>
      </div>
    );

    return hideShell ? content : <PageShell>{content}</PageShell>;
  }

  const content = (
    <div>
      <SectionHeading title="Acupuncture Point Selection" />

      {/* Search Mode Toggle */}
      <div className="mb-4">
        <div className="flex gap-2 mb-3">
          <Button
            variant={searchMode === "meridian" ? "primary" : "secondary"}
            size="sm"
            onClick={() => {
              setSearchMode("meridian");
              setSearchQuery("");
            }}
          >
            Search by Meridian
          </Button>
          <Button
            variant={searchMode === "point" ? "primary" : "secondary"}
            size="sm"
            onClick={() => {
              setSearchMode("point");
              setSearchQuery("");
            }}
          >
            Search by Point
          </Button>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <Input
            type="text"
            placeholder={
              searchMode === "meridian"
                ? "Search meridians..."
                : "Search acupoint codes or names..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Meridian Search Results */}
      {searchMode === "meridian" && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Select Meridian
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {filteredMeridians.map((meridian) => (
              <div
                key={meridian.meridianId}
                className={`p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer ${
                  selectedMeridians.includes(meridian.meridianId)
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
                onClick={() => {
                  const isSelected = selectedMeridians.includes(
                    meridian.meridianId,
                  );

                  if (isSelected) {
                    // Remove meridian
                    setSelectedMeridians((prev) =>
                      prev.filter((id) => id !== meridian.meridianId),
                    );

                    // Clear its selected points
                    onSelectedPointsChange(
                      selectedPoints.filter(
                        (p) => p.meridianId !== meridian.meridianId,
                      ),
                    );
                  } else {
                    // Add meridian
                    setSelectedMeridians((prev) => [
                      ...prev,
                      meridian.meridianId,
                    ]);
                  }
                }}
              >
                <div className="font-medium text-slate-900">
                  {meridian.meridianName}
                </div>
                <div className="text-sm text-slate-600">
                  {meridian.region} - {meridian.side}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Point Search Results */}
      {searchMode === "point" && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            Select Acupoint
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {filteredAcupoints.map((point) => {
              // const pointKey = `${point.region}-${point.side}-${point.acupunctureId}`;
              const isSelected = selectedPoints.some(
                (p) => p.acupunctureId === point.acupunctureId,
              );
              return (
                <div
                  key={point.acupunctureId}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    const region = point.region.toLowerCase();
                    const side = point.side.toLowerCase();

                    // Auto-select region and show view
                    if (!selectedRegions.includes(region)) {
                      setSelectedRegions([...selectedRegions, region]);
                    }
                    setViewsByRegion((prev) => ({
                      ...prev,
                      [region]: {
                        ...prev[region],
                        [side]: true,
                      },
                    }));

                    setSelectedMeridians((prev) =>
                      prev.includes(point.meridianId)
                        ? prev
                        : [...prev, point.meridianId],
                    );

                    // Toggle point selection
                    handlePointClick(point, region, side);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900">
                        {point.acupointCode}
                      </div>
                      <div className="text-sm text-slate-600">
                        {point.acupointName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {point.meridianName} • {point.region} {point.side}
                      </div>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isSelected ? "bg-teal-500" : "bg-slate-300"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Meridian */}
      <div className="space-y-6">
        {selectedMeridians.map((meridianId) => {
          const meridianPoints = pointsByMeridian.get(meridianId) || [];

          if (!meridianPoints.length) return null;

          const sample = meridianPoints[0];

          const visiblePoints = meridianPoints;

          return (
            <RegionSideView
              key={meridianId}
              region={sample.region}
              side={sample.side}
              meridianId={meridianId}
              meridianName={sample.meridianName}
              points={visiblePoints}
              selectedPoints={selectedPoints}
              handlePointClick={handlePointClick}
            />
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
              "Acupuncture Code",
              "Acupuncture Name",
              "Meridian",
              "Region",
              "Side",
              "Actions",
            ]}
          >
            {selectedPoints.map((point) => (
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
                <td className="px-4 py-2 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      const nextPoints = selectedPoints.filter(
                        (p) => p.key !== point.key,
                      );

                      onSelectedPointsChange(nextPoints);
                      cleanupMeridianIfEmpty(nextPoints);
                    }}
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

      {!hideSaveButton && (
        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            variant="primary"
            onClick={() =>
              console.log("Save button - implement parent handler")
            }
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );

  return hideShell ? content : <PageShell className="p-8">{content}</PageShell>;
}

export default AcupunctureSelect;

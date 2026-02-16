import { useState, useEffect } from "react";
import {
  PageShell,
  SectionHeading,
  Button,
  Table,
} from "~/presentation/designSystem";
import RegionSideView from "./RegionSideView";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { useGetMeridianRegion } from "~/presentation/hooks/meridian/useGetMeridianRegion";
import { useGetMeridianList } from "~/presentation/hooks/meridian/useGetMeridianList";
import { useGetMeridianSidesByRegion } from "~/presentation/hooks/meridian/useGetMeridianSidesByRegion";
import { AcupuncturePoint, SelectedPoint } from "~/domain/entities/AcupuncturePoint";

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
  hideSaveButton = false 
}: AcupunctureSelectProps) {
  const { meridians, loading: meridiansLoading } = useGetMeridianList();
  const { regions, loading: regionsLoading } = useGetMeridianRegion();

  const getRegionName = (regionObj: any): string | null => {
    if (typeof regionObj === "string") return regionObj;
    if (typeof regionObj?.region === "string") return regionObj.region;
    if (typeof regionObj?.regionName === "string") return regionObj.regionName;
    if (typeof regionObj?.name === "string") return regionObj.name;
    if (typeof regionObj?.value === "string") return regionObj.value;

    return null;
  };

  const loading = meridiansLoading || regionsLoading;

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const [visibleMeridians, setVisibleMeridians] = useState<Record<string, Set<number>>>({});

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

  const [viewsByRegion, setViewsByRegion] = useState<Record<string, Record<string, boolean>>>({});

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
    const pointKey = `${region}-${side}-${point.acupunctureId}`;
    const existingIndex = selectedPoints.findIndex((p) => p.key === pointKey);

    if (existingIndex >= 0) {
      onSelectedPointsChange(selectedPoints.filter((_, i) => i !== existingIndex));
    } else {
      onSelectedPointsChange([
        ...selectedPoints,
        {
          ...point,
          key: pointKey,
        },
      ]);
    }
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
      <SectionHeading
        title="Acupuncture Point Selection"
        description="Choose body part for acupuncture"
      />

      {/* Region multi-select dropdown */}
      <div className="mb-6">
        <MultiSelectDropdown
          choices={regions}
          selectedChoices={selectedRegions}
          onToggleChoice={toggleRegion}
          getChoiceName={getRegionName}
          dropdownPlaceholder="body parts"
        />
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
                    onClick={(e) => {
                      e.preventDefault();
                      toggleView(region, side);
                    }}
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
                  .map((side) => (
                    <div key={side} className="space-y-4">
                      <RegionSideView
                        region={region}
                        side={side}
                        selectedPoints={selectedPoints}
                        visibleMeridians={visibleMeridians}
                        handlePointClick={handlePointClick}
                        setSelectedPoints={onSelectedPointsChange}
                        toggleMeridianVisibility={toggleMeridianVisibility}
                      />
                    </div>
                  ))}
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
              "Acupuncture Code",
              "Acupuncture Name",
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
                    type="button"
                    onClick={() =>
                      onSelectedPointsChange(
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

      {!hideSaveButton && (
        <div className="mt-8 flex justify-end">
          <Button type="button" variant="primary" onClick={() => console.log("Save button - implement parent handler")}>
            Save
          </Button>
        </div>
      )}
    </div>
  );

  return hideShell ? content : <PageShell className="p-8">{content}</PageShell>;
}

export default AcupunctureSelect;
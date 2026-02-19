import React, { useState } from "react";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  Button,
  Card,
  FormField,
  Input,
  SectionHeading
} from "~/presentation/designSystem";
import Modal from "../Modal";
import { CustomMarker } from "~/domain/entities/CustomMarker";
import { useGetAcupointList } from "~/presentation/hooks/acupoint/useGetAcupointList";
import { Acupoint } from "~/domain/entities/Acupoint";
import HistoryTable from "./HistoryTable";

interface AcupunctureAreaProps {
  areaId: string;
  image: string;
  markers: CustomMarker[];
  onMarkersChange: (markers: CustomMarker[]) => void;
  onAreaRegionChange: (region: string) => void;
  onAreaSideChange: (side: string) => void;
  onRemove: () => void;
}

export const AcupunctureArea: React.FC<AcupunctureAreaProps> = ({
  areaId,
  image,
  markers,
  onMarkersChange,
  onAreaRegionChange,
  onAreaSideChange,
  onRemove
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [newMarkerPoint, setNewMarkerPoint] = useState<Marker | null>(null);
  const [acupointCode, setAcupointCode] = useState<string>("");
  const [acupointName, setAcupointName] = useState<string>("");
  const [areaRegion, setAreaRegion] = useState<string>("");
  const [areaSide, setAreaSide] = useState<string>("");
  const [searchCode, setSearchCode] = useState<string>("");
  const [useExistingPoint, setUseExistingPoint] = useState<boolean>(false);
  
  const { acupoints, loading: acupointsLoading } = useGetAcupointList(null);
  
  const filteredAcupoints = acupoints.filter(point =>
    point.acupointCode.toLowerCase().includes(searchCode.toLowerCase()) ||
    point.acupointName.toLowerCase().includes(searchCode.toLowerCase())
  );

  // Check if acupoint already exists in the system
  const acupointExistsInSystem = (code: string): boolean => {
    return acupoints.some(point => 
      point.acupointCode.toLowerCase() === code.toLowerCase()
    );
  };

  const MarkerView: React.FC<
    MarkerComponentProps & {
      acupointCode?: string;
      acupointName?: string;
    }
  > = ({ top, left, acupointCode, acupointName, itemNumber }) => {
    const label = acupointCode ?? acupointName;

    return (
      <>
        <div
          data-tooltip-id={`marker_${areaId}_${itemNumber}`}
          data-tooltip-content={String(label)}
          style={{
            position: "absolute",
            top: `${top}%`,
            left: `${left}%`,
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: "#ef4444",
            border: "2px solid white",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
          }}
        />
        <Tooltip id={`marker_${areaId}_${itemNumber}`} place="top" />
      </>
    );
  };

  const codeExists = markers.some(
    (m) => m.acupointCode?.toLowerCase() === acupointCode.toLowerCase(),
  );

  const handleSelectExistingAcupoint = (acupoint: Acupoint) => {
    setAcupointCode(acupoint.acupointCode);
    setAcupointName(acupoint.acupointName);
    setSearchCode("");
  };

  const handleClear = () => {
    onMarkersChange([]);
    onAreaRegionChange("");
    onAreaSideChange("");
  };

  const handleAreaRegionChange = (value: string) => {
    setAreaRegion(value);
    onAreaRegionChange(value);
  };

  const handleAreaSideChange = (value: string) => {
    setAreaSide(value);
    onAreaSideChange(value);
  };

  const handleAddMarker = () => {
    if (!newMarkerPoint) return;
    if (!acupointCode && !acupointName) return;
    if (!acupointCode.trim()) {
      alert("Acupuncture code is required");
      return;
    }
    
    // Check if acupoint already exists in current area
    if (codeExists) {
      return; // Silently skip duplicate in same area
    }


    const newMarker: CustomMarker = {
      top: Number(newMarkerPoint.top),
      left: Number(newMarkerPoint.left),
    };

    if (acupointCode) {
      newMarker.acupointCode = acupointCode.toUpperCase();
    }

    if (acupointName) {
      newMarker.acupointName = acupointName;
    }

    onMarkersChange([...markers, newMarker]);
    setAcupointCode("");
    setAcupointName("");
    setSearchCode("");
    setUseExistingPoint(false);
    setShow(false);
    setNewMarkerPoint(null);
  };

  return (
    <Card className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <SectionHeading title={"Acupuncture Area"} />
        <Button
          type="button"
          variant="secondary"
          onClick={onRemove}
          className="text-red-600 hover:text-red-700"
        >
          Remove Area
        </Button>
      </div>

      <Modal
        title="Add Marker Information"
        show={show}
        onClose={() => {
          setShow(false);
          setAcupointCode("");
          setAcupointName("");
          setSearchCode("");
          setUseExistingPoint(false);
        }}
        onAdd={handleAddMarker}
      >
        <div className="flex flex-col gap-3">
          {/* Toggle between manual input and existing point selection */}
          <div className="flex gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!useExistingPoint}
                onChange={() => setUseExistingPoint(false)}
                className="mr-2"
              />
              Manual Entry
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={useExistingPoint}
                onChange={() => setUseExistingPoint(true)}
                className="mr-2"
              />
              Select Existing Point
            </label>
          </div>

          {useExistingPoint ? (
            // Existing point selection
            <div className="flex flex-col gap-3">
              <FormField label="Search Acupoints">
                <Input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Search by code or name..."
                />
              </FormField>

              {searchCode && (
                <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                  {acupointsLoading ? (
                    <div className="p-3 text-gray-500">Loading...</div>
                  ) : filteredAcupoints.length > 0 ? (
                    filteredAcupoints.map((point) => (
                      <div
                        key={point.acupointCode}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                        onClick={() => handleSelectExistingAcupoint(point)}
                      >
                        <div className="font-medium">{point.acupointCode}</div>
                        <div className="text-sm text-gray-600">{point.acupointName}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">No matching acupoints found</div>
                  )}
                </div>
              )}

              {acupointCode && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="text-sm font-medium text-blue-800">Selected:</div>
                  <div className="font-medium">{acupointCode} - {acupointName}</div>
                </div>
              )}
            </div>
          ) : (
            // Manual entry
            <div className="flex flex-col gap-3">
              <FormField label="Acupuncture Code">
                <Input
                  type="text"
                  value={acupointCode}
                  onChange={(e) => setAcupointCode(e.target.value)}
                  placeholder="Acupuncture Code"
                />
              </FormField>

              <FormField label="Acupuncture Name">
                <Input
                  type="text"
                  value={acupointName}
                  onChange={(e) => setAcupointName(e.target.value)}
                  placeholder="Acupuncture Name"
                />
              </FormField>
            </div>
          )}
        </div>
      </Modal>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Region">
          <Input
            type="text"
            name="meridianRegion"
            value={areaRegion}
            onChange={(e) => handleAreaRegionChange(e.target.value)}
            placeholder="Region (e.g., Head, Torso, Arms)"
            className="h-14"
            required
          />
        </FormField>

        <FormField label="Side">
          <Input
            type="text"
            name="meridianSide"
            value={areaSide}
            onChange={(e) => handleAreaSideChange(e.target.value)}
            placeholder="Side (e.g., front, back, left, right)"
            className="h-14"
            required
          />
        </FormField>
      </div>
      <FormField label="Click on the image to add markers">
        <ImageMarker
          key={`${areaId}_${image}`}
          src={image}
          markers={markers}
          markerComponent={MarkerView}
          onAddMarker={(marker) => {
            console.log("clicked:", marker);
            setNewMarkerPoint(marker);
            setShow(true);
          }}
        />
      </FormField>

      <div className="mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
        >
          Clear All Markers
        </Button>
      </div>

      <HistoryTable 
        markers={markers} 
        setMarkers={onMarkersChange} 
      />
    </Card>
  );
};

export default AcupunctureArea;

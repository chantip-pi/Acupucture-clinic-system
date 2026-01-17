import React, { useState, FormEvent, ChangeEvent } from "react";
import ImageMarker, { Marker, MarkerComponentProps } from "react-image-marker";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import HistoryTable from "./HistoryTable";
import Modal from "./Modal";
import {
  Button,
  Card,
  FormField,
  Input,
  SectionHeading,
} from "~/presentation/designSystem";
import { useAddAcupoint } from "~/presentation/hooks/acupoint/useAddAcupoint";
import { useAddAcupointLocation } from "~/presentation/hooks/acupointLocation/useAddAcupointLocation";
import { useAddAcupuncture } from "~/presentation/hooks/acupuncture/useAddAcupuncture";
import { useAddMeridian } from "~/presentation/hooks/meridian/useAddMeridian";

interface CustomMarker {
  top: number;
  left: number;
  acupointCode?: string;
  acupointName?: string;
}

const AcupunctureMarker: React.FC = () => {
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [image, setImage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [newMarkerPoint, setNewMarkerPoint] = useState<Marker | null>(null);
  const [acupointCode, setAcupointCode] = useState<string>("");
  const [acupointName, setAcupointName] = useState<string>("");
  const [meridianName, setMeridianName] = useState<string>("");
  const [meridianRegion, setMeridianRegion] = useState<string>("");
  const [meridianSide, setMeridianSide] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { addMeridian, loading: meridianLoading, error: meridianError } = useAddMeridian();
  const { addAcupoint, loading: acupointLoading, error: acupointError } = useAddAcupoint();
  const { addAcupointLocation, loading: locationLoading, error: locationError } = useAddAcupointLocation();
  const { addAcupuncture, loading: acupunctureLoading, error: acupunctureError } = useAddAcupuncture();

  const loading = meridianLoading || acupointLoading || locationLoading || acupunctureLoading || uploadingImage;

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
          data-tooltip-id={`marker_${itemNumber}`}
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
        <Tooltip id={`marker_${itemNumber}`} place="top" />
      </>
    );
  };

  const codeExists = markers.some(
    (m) => m.acupointCode?.toLowerCase() === acupointCode.toLowerCase(),
  );

  const handleClear = () => setMarkers([]);

  const handleImageReupload = () => {
    setImage("");
    setImageUrl("");
    setImageFile(null);
    handleClear();
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    setImageFile(file);
    setError("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload image to backend
      const baseUrl = "http://localhost:3000/api";
      const response = await fetch(`${baseUrl}/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to upload image" }));
        throw new Error(errorData.error || "Failed to upload image");
      }

      const result = await response.json();
      const filename = result.filename;

      if (!filename) {
        throw new Error("Image uploaded but no filename returned");
      }

      // Store the full URL for saving to database
      const fullImageUrl = `${baseUrl}/images/${filename}`;
      setImageUrl(fullImageUrl);
      // Display the uploaded image using the backend endpoint
      setImage(fullImageUrl);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      setError(errorMessage);
      setImageFile(null);
      setImage("");
      setImageUrl("");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (markers.length === 0) {
      setError("Please add at least one marker before saving");
      return;
    }

    if (!meridianName || !meridianRegion || !meridianSide) {
      setError("Please fill in all meridian information");
      return;
    }

    try {
      const errors: string[] = [];
      const successes: string[] = [];

      // 1. Create Meridian
      let meridianIdNum: number;
      
      if (!imageUrl) {
        setError("Please upload an image before saving");
        return;
      }

      const meridianResult = await addMeridian({
        meridianId: 0,
        meridianName,
        region: meridianRegion,
        side: meridianSide,
        image: imageUrl, // Store the full URL (e.g., http://localhost:3000/api/images/1.jpg)
      });

      if (!meridianResult.success || !meridianResult.meridian) {
        const errorMessage = meridianResult.error || "Failed to create meridian";
        setError(errorMessage);
        return;
      }

      meridianIdNum = meridianResult.meridian.meridianId;
      if (!meridianIdNum) {
        setError("Meridian created but no ID returned from backend");
        return;
      }
      successes.push("Meridian created");

      // 2. Process each marker
      for (const marker of markers) {
        if (!marker.acupointCode || !marker.acupointName) {
          errors.push(`Marker missing code or name`);
          continue;
        }

        try {
          // 3a. Create/Update Acupoint
          const acupointResult = await addAcupoint({
            acupointCode: marker.acupointCode,
            acupointName: marker.acupointName,
          });

          if (!acupointResult.success) {
            errors.push(`Acupoint ${marker.acupointCode}: ${acupointResult.error || "Failed to create acupoint"}`);
            continue;
          }

          // 3b. Create AcupointLocation
          const locationResult = await addAcupointLocation({
            locationId: 0,
            meridianId: meridianIdNum,
            acupointCode: marker.acupointCode,
            pointTop: marker.top,
            pointLeft: marker.left,
          });

          if (!locationResult.success) {
            const isDuplicate = locationResult.error?.includes("409") || 
                               locationResult.error?.toLowerCase().includes("duplicate") ||
                               locationResult.error?.toLowerCase().includes("already exists");
            if (!isDuplicate) {
              errors.push(`Location for ${marker.acupointCode}: ${locationResult.error || "Failed"}`);
              continue;
            }
          }

          // 3c. Create Acupuncture record
          const acupunctureResult = await addAcupuncture({
            acupunctureId: 0,
            acupointCode: marker.acupointCode,
            meridianId: meridianIdNum,
          });

          if (!acupunctureResult.success) {
            const isDuplicate = acupunctureResult.error?.includes("409") || 
                               acupunctureResult.error?.toLowerCase().includes("duplicate") ||
                               acupunctureResult.error?.toLowerCase().includes("already exists");
            if (!isDuplicate) {
              errors.push(`Acupuncture for ${marker.acupointCode}: ${acupunctureResult.error || "Failed"}`);
              continue;
            }
          }

          successes.push(`Marker ${marker.acupointCode} saved`);
        } catch (error) {
          errors.push(
            `Marker ${marker.acupointCode}: ${
              error instanceof Error ? error.message : "Failed"
            }`,
          );
        }
      }

      if (errors.length > 0) {
        console.error("Errors:", errors);
        setError(errors[0] || "Failed to add acupuncture markers");
      } else {
        setImage("");
        setImageUrl("");
        setImageFile(null);
        setMarkers([]);
        setMeridianName("");
        setMeridianRegion("");
        setMeridianSide("");
        setAcupointCode("");
        setAcupointName("");
        setNewMarkerPoint(null);
        setError("");
        alert("Successfully saved all markers");
      }
    } catch (error) {
      console.error("Save error:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    }
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      {!image && (
        <Card>
          <SectionHeading title="Add Marker Information" />
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold">Upload Meridian Image</h2>
            <input 
              type="file" 
              accept="image/*" 
              onChange={onImageChange}
              disabled={uploadingImage}
            />
            {uploadingImage && (
              <p className="text-sm text-gray-600">Uploading image...</p>
            )}
          </div>
        </Card>
      )}

      {image && (
        <>
          <Modal
            title="Add Marker Information"
            show={show}
            onClose={() => {
              setShow(false);
              setAcupointCode("");
              setAcupointName("");
            }}
            onAdd={() => {
              if (!newMarkerPoint) return;

              if (!acupointCode && !acupointName) return;

              if (!acupointCode.trim()) {
                alert("Acupuncture code is required");
                return;
              }

              if (codeExists) {
                alert("This acupuncture code already exists");
                return;
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

              setMarkers((prev) => [...prev, newMarker]);
              setAcupointCode("");
              setAcupointName("");
              setShow(false);
              setNewMarkerPoint(null);
            }}
          >
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
          </Modal>

          <Card>
            <div className="gap-2 mb-4 flex flex-col">
              <SectionHeading title="Add Acupuncture Template" />

              <form onSubmit={handleSubmit} className="gap-4 flex flex-col">
                <FormField label="Meridian Name">
                  <Input
                    type="text"
                    name="meridianName"
                    value={meridianName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setMeridianName(e.target.value)
                    }
                    placeholder="Meridian Name"
                    className="h-14"
                    required
                  />
                </FormField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField label="Meridian Region">
                    <Input
                      type="text"
                      name="meridianRegion"
                      value={meridianRegion}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMeridianRegion(e.target.value)
                      }
                      placeholder="Region (e.g., Head, Torso, Arms)"
                      className="h-14"
                      required
                    />
                  </FormField>

                  <FormField label="Meridian Side">
                    <Input
                      type="text"
                      name="meridianSide"
                      value={meridianSide}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMeridianSide(e.target.value)
                      }
                      placeholder="Side (e.g., front, back, left, right)"
                      className="h-14"
                      required
                    />
                  </FormField>
                </div>

                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleImageReupload}
                  >
                    Reupload Image
                  </Button>
                </div>

                <FormField label="Click on the image to add markers">
                  <ImageMarker
                    key={image}
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

                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClear}
                  >
                    Clear All Markers
                  </Button>
                </div>

                <HistoryTable markers={markers} setMarkers={setMarkers} />

                {(error || meridianError || acupointError || locationError || acupunctureError) && (
                  <p className="text-md text-red-600">
                    {error || meridianError || acupointError || locationError || acupunctureError}
                  </p>
                )}

                <div className="sm:col-span-2 flex justify-end">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default AcupunctureMarker;

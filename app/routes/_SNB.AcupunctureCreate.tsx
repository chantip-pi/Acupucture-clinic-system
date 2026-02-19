import React, { useState, FormEvent } from "react";
import {
  Button,
  Card,
  SectionHeading,
  PageShell,
  FormField,
  Input
} from "~/presentation/designSystem";
import { useAddAcupoint } from "~/presentation/hooks/acupoint/useAddAcupoint";
import { useAddAcupointLocation } from "~/presentation/hooks/acupointLocation/useAddAcupointLocation";
import { useAddAcupuncture } from "~/presentation/hooks/acupuncture/useAddAcupuncture";
import { useAddMeridian } from "~/presentation/hooks/meridian/useAddMeridian";
import { useUploadImage } from "~/presentation/hooks/image/useUploadImage";
import { CustomMarker } from "~/domain/entities/CustomMarker";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useGetAllImages } from "~/presentation/hooks/image/useGetAllImages";
import ImageSelector from "./components/meridian/ImageSelector";
import AcupunctureArea from "./components/meridian/AcupunctureArea";
import { useGetAcupointList } from "~/presentation/hooks/acupoint/useGetAcupointList";

const AcupunctureCreate: React.FC = () => {
  const [acupunctureAreas, setAcupunctureAreas] = useState<Array<{
    id: string;
    image: string;
    side: string;
    region: string;
    imageFilename: string;
    pendingImageFile: File | null;
    markers: CustomMarker[];
  }>>([]);
  const [meridianName, setMeridianName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showImageSelector, setShowImageSelector] = useState(false);

  const { addMeridian, loading: meridianLoading, error: meridianError } = useAddMeridian();
  const { addAcupoint, loading: acupointLoading, error: acupointError } = useAddAcupoint();
  const { addAcupointLocation, loading: locationLoading, error: locationError } = useAddAcupointLocation();
  const { addAcupuncture, loading: acupunctureLoading, error: acupunctureError } = useAddAcupuncture();
  const { uploadImage, loading: uploadingImage, error: uploadError } = useUploadImage();
  const { images: systemImages, loading: imagesLoading } = useGetAllImages();
  const { acupoints: systemAcupoints } = useGetAcupointList(null);

  const loading = meridianLoading || acupointLoading || locationLoading || acupunctureLoading || uploadingImage;

  React.useEffect(() => {
    if (uploadError) {
      setError(uploadError);
    }
  }, [uploadError]);

  const navigate = useNavigate();

  // Check if acupoint already exists in system
  const acupointExistsInSystem = (code: string): boolean => {
    return systemAcupoints.some(point =>
      point.acupointCode.toLowerCase() === code.toLowerCase()
    );
  };

  const handleAddArea = (filename: string, previewUrl: string, file?: File) => {
    const newArea = {
      id: Date.now().toString(),
      side: "",
      region: "",
      image: previewUrl,
      imageFilename: filename,
      pendingImageFile: file || null,
      markers: []
    };
    setAcupunctureAreas([...acupunctureAreas, newArea]);
    setShowImageSelector(false);
  };

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleRemoveArea = (areaId: string) => {
    setAcupunctureAreas(acupunctureAreas.filter(area => area.id !== areaId));
  };

  const handleUpdateAreaMarkers = (areaId: string, markers: CustomMarker[]) => {
    setAcupunctureAreas(acupunctureAreas.map(area =>
      area.id === areaId ? { ...area, markers } : area
    ));
  };

  const handleUpdateAreaRegion = (areaId: string, region: string) => {
    setAcupunctureAreas(acupunctureAreas.map(area =>
      area.id === areaId ? { ...area, region } : area
    ));
  };

  const handleUpdateAreaSide = (areaId: string, side: string) => {
    setAcupunctureAreas(acupunctureAreas.map(area =>
      area.id === areaId ? { ...area, side } : area
    ));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (acupunctureAreas.length === 0) {
      setError("Please add at least one acupuncture area before saving");
      return;
    }

    const totalMarkers = acupunctureAreas.reduce((sum, area) => sum + area.markers.length, 0);
    if (totalMarkers === 0) {
      setError("Please add at least one marker before saving");
      return;
    }

    if (!meridianName) {
      setError("Please fill in all meridian information");
      return;
    }

    const errors: string[] = [];
    // Track acupoints created/confirmed during this session to avoid duplicate addAcupoint calls
    const processedAcupoints = new Set<string>();

    try {
      for (const area of acupunctureAreas) {
        // --- Step 1: Upload image if pending ---
        let finalImageFilename = area.imageFilename;
        if (area.pendingImageFile) {
          const result = await uploadImage(area.pendingImageFile);
          if (!result) {
            errors.push(`Failed to upload image for area "${area.imageFilename}"`);
            continue;
          }
          finalImageFilename = result.filename;
        }

        // --- Step 2: Create Meridian for this area ---
        const meridianResult = await addMeridian({
          meridianName: capitalizeFirstLetter(meridianName),
          region: capitalizeFirstLetter(area.region),
          side: capitalizeFirstLetter(area.side),
          image: finalImageFilename,
        });

        if (!meridianResult.success || !meridianResult.meridian?.meridianId) {
          errors.push(
            `Area "${area.imageFilename}": ${meridianResult.error || "Failed to create meridian"}`
          );
          continue;
        }

        const meridianId = meridianResult.meridian.meridianId;

        // --- Step 3: Process each marker in this area ---
        for (const marker of area.markers) {
          if (!marker.acupointCode || !marker.acupointName) {
            errors.push(`Marker missing code or name in area "${area.imageFilename}"`);
            continue;
          }

          const { acupointCode, acupointName, top, left } = marker;

          // Step 3a: Create acupoint only if it doesn't exist anywhere (system or this session)
          const alreadyExists = acupointExistsInSystem(acupointCode) || processedAcupoints.has(acupointCode);

          if (!alreadyExists) {
            const acupointResult = await addAcupoint({ acupointCode, acupointName });
            if (!acupointResult.success) {
              errors.push(`Acupoint "${acupointCode}": ${acupointResult.error || "Failed to create acupoint"}`);
              continue;
            }
          }

          // Mark as processed regardless of source (new or existing)
          processedAcupoints.add(acupointCode);

          // Step 3b: Create AcupointLocation (per meridian + acupoint pair)
          const locationResult = await addAcupointLocation({
            meridianId,
            acupointCode,
            pointTop: top,
            pointLeft: left,
          });

          if (!locationResult.success && !isDuplicateError(locationResult.error)) {
            errors.push(`Location for "${acupointCode}": ${locationResult.error || "Failed"}`);
            continue;
          }

          // Step 3c: Link acupoint to meridian via Acupuncture record (per meridian + acupoint pair)
          const acupunctureResult = await addAcupuncture({ acupointCode, meridianId });

          if (!acupunctureResult.success && !isDuplicateError(acupunctureResult.error)) {
            errors.push(`Acupuncture for "${acupointCode}": ${acupunctureResult.error || "Failed"}`);
            continue;
          }
        }
      }

      if (errors.length > 0) {
        console.error("Submission errors:", errors);
        setError(errors[0]);
      } else {
        setAcupunctureAreas([]);
        setMeridianName("");
        setError("");
        alert("Successfully saved all acupuncture areas and markers");
        navigate("/meridianLibrary");
      }
    } catch (error) {
      console.error("Save error:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };

  // Helper to avoid repeating duplicate-check logic
  const isDuplicateError = (error?: string): boolean => {
    if (!error) return false;
    const lower = error.toLowerCase();
    return error.includes("409") || lower.includes("duplicate") || lower.includes("already exists");
  };

  return (
    <PageShell className="p-8">
      {/* Back Button */}
      <div className="flex items-center gap-3 py-4">
        <Button size="sm" variant="back" onClick={() => navigate("/meridianLibrary")}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          Back
        </Button>
      </div>



      {/* Meridian Form */}
      {acupunctureAreas.length > 0 && (
        <Card className="mb-6">
          <SectionHeading title="Meridian Information" />
          <form onSubmit={handleSubmit} className="gap-4 flex flex-col">
              <FormField label="Meridian Name">
        <Input
          type="text"
          name="meridianName"
          value={meridianName}
          onChange={(e) => setMeridianName(e.target.value)}
          placeholder="Meridian Name"
          className="h-14"
          required
        />
      </FormField>

            {/* Acupuncture Areas */}
            {acupunctureAreas.map((area) => (
              <AcupunctureArea
                key={area.id}
                areaId={area.id}
                image={area.image}
                markers={area.markers}
                onMarkersChange={(markers) => handleUpdateAreaMarkers(area.id, markers)}
                onAreaRegionChange={(region) => handleUpdateAreaRegion(area.id, region)}
                onAreaSideChange={(side) => handleUpdateAreaSide(area.id, side)}
                onRemove={() => handleRemoveArea(area.id)}
              />
            ))}

            {/* Error Display */}
            {(error || meridianError || acupointError || locationError || acupunctureError) && (
              <p className="text-md text-red-600">
                {error || meridianError || acupointError || locationError || acupunctureError}
              </p>
            )}

            {/* Submit Button */}
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Save All Areas"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Image Selector Modal */}
      {showImageSelector && (
        <ImageSelector
          systemImages={systemImages}
          imagesLoading={imagesLoading}
          onImageSelect={(filename, previewUrl) => handleAddArea(filename, previewUrl)}
          onImageUpload={(file) => {
            const previewUrl = URL.createObjectURL(file);
            handleAddArea(file.name, previewUrl, file);
          }}
        />
      )}

      {/* Add Area Button */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <SectionHeading title="Acupuncture Areas" />
          <Button
            type="button"
            variant="primary"
            onClick={() => setShowImageSelector(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Area
          </Button>
        </div>
      </Card>
    </PageShell>
  );
};

export default AcupunctureCreate;

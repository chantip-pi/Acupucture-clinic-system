import React, { useState } from "react";
import {
  Button,
  Card,
  SectionHeading
} from "~/presentation/designSystem";
import { IMAGE_BASE_URL } from "~/constants/api";

type ImageSourceMode = "library" | "upload";

interface ImageSelectorProps {
  systemImages: string[];
  imagesLoading: boolean;
  onImageSelect: (filename: string, previewUrl: string) => void;
  onImageUpload: (file: File) => void;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({
  systemImages,
  imagesLoading,
  onImageSelect,
  onImageUpload
}) => {
  const [imageSourceMode, setImageSourceMode] = useState<ImageSourceMode>("library");

  const handleSelectSystemImage = (filename: string) => {
    const previewUrl = `${IMAGE_BASE_URL}/${filename}`;
    onImageSelect(filename, previewUrl);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    onImageUpload(file);
  };

  return (
    <Card>
      <SectionHeading title="Select Meridian Image" />

      {/* MODE SWITCH */}
      <div className="flex gap-3 mb-4">
        <Button
          type="button"
          variant={imageSourceMode === "library" ? "primary" : "secondary"}
          onClick={() => setImageSourceMode("library")}
        >
          Choose from System
        </Button>

        <Button
          type="button"
          variant={imageSourceMode === "upload" ? "primary" : "secondary"}
          onClick={() => setImageSourceMode("upload")}
        >
          Upload New
        </Button>
      </div>

      {imageSourceMode === "library" && (
        <>
          {imagesLoading && (
            <p className="text-sm text-gray-500">Loading images...</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Array.isArray(systemImages) ? systemImages : []).map((img) => {
              const previewUrl = `${IMAGE_BASE_URL}/${img}`;
              return (
                <div
                  key={img}
                  className="cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden transition"
                  onClick={() => handleSelectSystemImage(img)}
                >
                  <img
                    src={previewUrl}
                    alt={img}
                    className="w-full h-40 object-cover"
                  />
                  <p className="text-xs text-center text-gray-500 p-1 truncate">
                    {img}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {imageSourceMode === "upload" && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold">Upload Meridian Image</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <p className="text-sm text-gray-500">
            Image will be uploaded when you press Save.
          </p>
        </div>
      )}
    </Card>
  );
};

export default ImageSelector;

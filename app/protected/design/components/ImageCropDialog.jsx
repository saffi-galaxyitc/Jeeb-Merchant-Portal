"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  Crop,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Info,
  RotateCw,
} from "lucide-react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropDialog = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  uploadCase,
  handleImageUpload,
  handleItemImageUpload,
}) => {
  const cropperRef = useRef(null);
  const [selectedAspectLabel, setSelectedAspectLabel] = useState("Free");
  const [cropperReady, setCropperReady] = useState(false);
  const [initialAspectRatio, setInitialAspectRatio] = useState(NaN);

  // Aspect ratio mappings
  const aspectOptions = [
    {
      label: "Free",
      value: NaN,
      description: "No constraints",
    },
    {
      label: "ImageText",
      value: 25 / 12, // 2.083 (375/180)
      description: "Full width, 180px height",
      dimensions: "375×180",
    },
    {
      label: "Banner",
      value: 5 / 4, // 1.25 (375/300)
      description: "Full width, 300px height",
      dimensions: "375×300",
    },
    {
      label: "BodyHalf",
      value: 8 / 9, // 0.889 (160/180)
      description: "Fixed size slider item",
      dimensions: "160×180",
    },
    {
      label: "BodyRound",
      value: 75 / 37, // 2.027 (375/185)
      description: "Full width, 185px height, rounded",
      dimensions: "375×185",
    },
    {
      label: "BodyPlain",
      value: 75 / 37, // 2.027 (375/185)
      description: "Full width, 185px height",
      dimensions: "375×185",
    },
    {
      label: "Brands",
      value: 18 / 29, // 0.621 (180/290)
      description: "Brand card in slider",
      dimensions: "180×290",
    },
    {
      label: "SubCategBrands",
      value: 18 / 29, // 0.621 (180/290)
      description: "Sub-category brand card",
      dimensions: "180×290",
    },
    {
      label: "ImageRow",
      value: 1, // 1.0
      description: "Circular profile images",
      dimensions: "75×75",
    },
    {
      label: "SubHeaderGrid",
      value: 87 / 100, // 0.87
      description: "Sub-header grid item",
      dimensions: "87×100",
    },
    {
      label: "SubBodyGrid",
      value: 87 / 100, // 0.87
      description: "Sub-body grid item",
      dimensions: "87×100",
    },
    {
      label: "ProductGrid",
      value: 5 / 4, // 1.25 (160/128)
      description: "Product card image",
      dimensions: "160×128",
    },
    {
      label: "Square",
      value: 1, // 1.0
      description: "Perfect square",
      dimensions: "1:1",
    },
  ];

  // Initialize aspect ratio based on uploadCase - only run once when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    if (!uploadCase) {
      setInitialAspectRatio(NaN);
      setSelectedAspectLabel("Free");
      return;
    }

    const defaultMappings = {
      banner: "Banner",
      imagetext: "ImageText",
      bodyhalf: "BodyHalf",
      bodyround: "BodyRound",
      bodyplain: "BodyPlain",
      brands: "Brands",
      subcategbrands: "SubCategBrands",
      imagerow: "ImageRow",
      item: "Square",
      product: "ProductGrid",
    };

    const defaultLabel = defaultMappings[uploadCase.toLowerCase()] || "Free";
    const defaultOption = aspectOptions.find(
      (opt) => opt.label === defaultLabel
    );

    if (defaultOption) {
      setSelectedAspectLabel(defaultOption.label);
      setInitialAspectRatio(defaultOption.value);
    } else {
      setInitialAspectRatio(NaN);
      setSelectedAspectLabel("Free");
    }
  }, [isOpen, uploadCase]);

  // Get initial aspect ratio based on uploadCase
  const getInitialAspect = () => {
    return initialAspectRatio;
  };

  // Get cropper instance
  const getCropper = () => {
    return cropperRef.current?.cropper;
  };

  // Handle aspect ratio changes
  const handleAspectChange = (option) => {
    const cropper = getCropper();
    if (cropper) {
      try {
        cropper.setAspectRatio(option.value);
        setSelectedAspectLabel(option.label);
      } catch (error) {
        console.warn("Failed to set aspect ratio:", error);
      }
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    const cropper = getCropper();
    if (cropper) {
      try {
        cropper.zoom(0.1);
      } catch (error) {
        console.warn("Zoom in failed:", error);
      }
    }
  };

  const handleZoomOut = () => {
    const cropper = getCropper();
    if (cropper) {
      try {
        cropper.zoom(-0.1);
      } catch (error) {
        console.warn("Zoom out failed:", error);
      }
    }
  };

  // Rotation controls
  const handleRotateLeft = () => {
    const cropper = getCropper();
    if (cropper) {
      try {
        cropper.rotate(-90);
      } catch (error) {
        console.warn("Rotate left failed:", error);
      }
    }
  };

  const handleRotateRight = () => {
    const cropper = getCropper();
    if (cropper) {
      try {
        cropper.rotate(90);
      } catch (error) {
        console.warn("Rotate right failed:", error);
      }
    }
  };

  // Reset all transformations
  const handleReset = () => {
    const cropper = getCropper();
    if (cropper) {
      try {
        cropper.reset();
        cropper.setAspectRatio(NaN);
        setSelectedAspectLabel("Free");
      } catch (error) {
        console.warn("Reset failed:", error);
      }
    }
  };

  // Flip controls
  const handleFlipHorizontal = () => {
    const cropper = getCropper();
    if (cropper) {
      try {
        const imageData = cropper.getImageData();
        if (imageData && typeof imageData.scaleX !== "undefined") {
          cropper.scaleX(-imageData.scaleX);
        }
      } catch (error) {
        console.warn("Flip horizontal failed:", error);
      }
    }
  };

  const handleFlipVertical = () => {
    const cropper = getCropper();
    if (cropper) {
      try {
        const imageData = cropper.getImageData();
        if (imageData && typeof imageData.scaleY !== "undefined") {
          cropper.scaleY(-imageData.scaleY);
        }
      } catch (error) {
        console.warn("Flip vertical failed:", error);
      }
    }
  };

  // Debug function
  const debugCropperState = () => {
    const cropper = getCropper();
    if (!cropper) {
      console.log("Debug: No cropper instance");
      return;
    }

    try {
      console.log("Debug: Cropper state", {
        ready: cropperReady,
        cropData: cropper.getData(),
        canvasData: cropper.getCanvasData(),
        imageData: cropper.getImageData(),
        containerData: cropper.getContainerData(),
        cropBoxData: cropper.getCropBoxData(),
      });
    } catch (error) {
      console.error("Debug: Error getting cropper data", error);
    }
  };

  // Handle crop and upload
  const handleCropConfirm = async () => {
    const cropper = getCropper();

    if (!cropper || !cropperReady) {
      alert(
        "Cropper is not ready. Please wait for the image to load completely."
      );
      return;
    }

    try {
      // Get cropped canvas
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 2000,
        maxHeight: 2000,
        minWidth: 100,
        minHeight: 100,
        fillColor: "#fff",
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!canvas) {
        throw new Error("Failed to generate cropped canvas");
      }

      console.log("Canvas created:", canvas.width, "x", canvas.height);

      // Convert to blob
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result && result.size > 0) {
              resolve(result);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.9
        );
      });

      if (!blob) {
        throw new Error("Generated blob is empty");
      }

      // Create file
      const croppedFile = new File([blob], "cropped-image.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      console.log("Cropped file created:", croppedFile.size, "bytes");

      // Call appropriate handler
      if (uploadCase === "item" && handleItemImageUpload) {
        await handleItemImageUpload(croppedFile);
      } else if (handleImageUpload) {
        const syntheticEvent = { target: { files: [croppedFile] } };
        await handleImageUpload(syntheticEvent, uploadCase);
      } else {
        throw new Error("No upload handler available");
      }

      // Close dialog
      onClose();
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Failed to crop image. Please try again.");
    }
  };

  // Handle ready event
  const handleReady = () => {
    setCropperReady(true);
    console.log("Cropper ready");
  };

  if (!isOpen) return null;

  // Don't render if imageSrc is empty
  if (!imageSrc || imageSrc.trim() === "") {
    return null;
  }

  const selectedOption = aspectOptions.find(
    (opt) => opt.label === selectedAspectLabel
  );

  const initialAspect = getInitialAspect();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Crop Image</h3>
              {uploadCase && (
                <p className="text-sm text-gray-600">
                  Cropping for:{" "}
                  <span className="font-medium">{uploadCase}</span>
                </p>
              )}
            </div>
            {selectedOption && selectedOption.description && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info size={16} />
                <span>{selectedOption.description}</span>
                {selectedOption.dimensions && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {selectedOption.dimensions}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[75vh] overflow-auto">
          {/* Controls */}
          <div className="mb-4 space-y-4">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                {aspectOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleAspectChange(option)}
                    className={`px-2 py-2 text-xs border rounded transition-colors ${
                      selectedAspectLabel === option.label
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    title={option.description}
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.dimensions && (
                      <div className="text-xs opacity-75 truncate">
                        {option.dimensions}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Transform Controls */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Zoom */}
              <div className="flex items-center gap-1 border rounded p-1">
                <button
                  onClick={handleZoomOut}
                  disabled={!cropperReady}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={!cropperReady}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>

              {/* Rotation */}
              <div className="flex items-center gap-1 border rounded p-1">
                <button
                  onClick={handleRotateLeft}
                  disabled={!cropperReady}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Rotate Left 90°"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={handleRotateRight}
                  disabled={!cropperReady}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Rotate Right 90°"
                >
                  <RotateCw size={16} />
                </button>
              </div>

              {/* Flip */}
              <div className="flex items-center gap-1 border rounded p-1">
                <button
                  onClick={handleFlipHorizontal}
                  disabled={!cropperReady}
                  className="px-2 py-1 text-xs hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Flip Horizontal"
                >
                  ↔️
                </button>
                <button
                  onClick={handleFlipVertical}
                  disabled={!cropperReady}
                  className="px-2 py-1 text-xs hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Flip Vertical"
                >
                  ↕️
                </button>
              </div>

              {/* Reset */}
              <button
                onClick={handleReset}
                disabled={!cropperReady}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Move size={14} />
                Reset
              </button>

              {/* Debug */}
              <button
                onClick={debugCropperState}
                disabled={!cropperReady}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
                title="Debug (check console)"
              >
                Debug
              </button>
            </div>
          </div>

          {/* Cropper */}
          <div className="flex justify-center bg-gray-50 p-4 rounded">
            <Cropper
              ref={cropperRef}
              src={imageSrc}
              style={{ height: 400, width: "100%" }}
              aspectRatio={initialAspect}
              viewMode={1}
              dragMode="move"
              autoCropArea={0.8}
              responsive={true}
              restore={false}
              guides={true}
              center={true}
              highlight={false}
              cropBoxMovable={true}
              cropBoxResizable={true}
              toggleDragModeOnDblclick={false}
              background={false}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              ready={handleReady}
              checkOrientation={false}
            />
          </div>

          {/* Info */}
          {cropperReady && (
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              <div className="text-gray-600">
                <span className="font-medium">
                  Selected: {selectedAspectLabel}
                </span>
                {selectedOption?.description && (
                  <span className="ml-2">• {selectedOption.description}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {!cropperReady && <span>Loading cropper...</span>}
            {cropperReady &&
              selectedAspectLabel !== "Free" &&
              selectedOption && (
                <span>Using {selectedAspectLabel} aspect ratio</span>
              )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCropConfirm}
              disabled={!cropperReady}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Crop size={16} />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropDialog;

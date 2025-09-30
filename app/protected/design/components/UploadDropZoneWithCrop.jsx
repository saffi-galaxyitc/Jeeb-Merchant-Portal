"use client";

import ImageCropDialog from "./ImageCropDialog";
import React, { useRef, useState } from "react";
import { Check, ImageUp } from "lucide-react";

const UploadDropZoneWithCrop = ({
  edit,
  handleImageUpload = () => {},
  uploadCase = "",
  handleItemImageUpload = () => {},
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [imageToCrop, setImageToCrop] = useState("");
  const fileInputRef = useRef(null);

  const processImageForCropping = (source) => {
    if (!source) {
      console.error("No image source provided");
      return;
    }

    if (typeof source === "string") {
      // URL case - validate it's not empty
      if (source.trim() === "") {
        console.error("Empty image URL provided");
        return;
      }
      setImageToCrop(source);
      setShowCropDialog(true);
    } else {
      // File case
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target.result) {
          setImageToCrop(e.target.result);
          setShowCropDialog(true);
        }
      };
      reader.onerror = () => {
        console.error("Failed to read file");
      };
      reader.readAsDataURL(source);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageForCropping(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    processImageForCropping(files[0]);

    // Reset input so same file can be chosen again
    e.target.value = "";
    e.target.blur();
  };

  const handleClick = () => {
    if (edit && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateAndUploadUrl = () => {
    if (!urlInput || urlInput.trim() === "") {
      setUrlError("Please enter a valid URL");
      return;
    }

    const currentUrl = urlInput.trim();

    const validateImageUrl = (url) => {
      try {
        const parsedUrl = new URL(url);
        const extensionPattern = /\.(jpeg|jpg|png|gif|webp|svg|avif)(\?.*)?$/i;
        if (extensionPattern.test(parsedUrl.pathname)) {
          return true;
        }
        if (parsedUrl.pathname.includes("/web/image")) {
          return true;
        }
        return true;
      } catch {
        return false;
      }
    };

    if (!validateImageUrl(currentUrl)) {
      setUrlError("Invalid image URL format");
      return;
    }

    // Test if the image loads
    const img = new Image();
    img.onload = () => {
      setUrlError("");
      processImageForCropping(currentUrl);
      setUrlInput("");
    };
    img.onerror = () => {
      setUrlError("Image could not be loaded");
    };
    img.src = currentUrl;
  };

  const handleCloseCropDialog = () => {
    setShowCropDialog(false);
    // Clear the image source to prevent empty string issues
    setTimeout(() => {
      setImageToCrop("");
    }, 100);
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className={`
            relative w-full h-40 border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center
            transition-colors duration-200 cursor-pointer
            ${
              edit
                ? dragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                : "border-gray-200 bg-gray-100 cursor-not-allowed"
            }
          `}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragOver(false);
          }}
          onClick={handleClick}
        >
          <ImageUp
            className={`w-8 h-8 ${edit ? "text-blue-500" : "text-gray-300"}`}
          />
          <div className="text-center">
            <p
              className={`text-xs ${edit ? "text-gray-500" : "text-gray-400"}`}
            >
              Click to browse or drag and drop
            </p>
            <p
              className={`text-xs ${edit ? "text-blue-500" : "text-gray-300"}`}
            >
              Images will be cropped before upload
            </p>
          </div>
          <input
            id="file-input-detailed"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={!edit}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 py-4 w-full">
          <span
            className={`flex-grow border-t border-1 border-dashed ${
              edit ? "border-gray-300" : "border-gray-200"
            }`}
          />
          <span
            className={`font-bold ${edit ? "text-gray-300" : "text-gray-200"}`}
          >
            Or
          </span>
          <span
            className={`flex-grow border-t border-1 border-dashed ${
              edit ? "border-gray-300" : "border-gray-200"
            }`}
          />
        </div>

        {/* URL Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            readOnly={!edit}
            className={`flex-grow p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              !edit ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={validateAndUploadUrl}
            disabled={!edit}
            className={`flex-shrink px-3 py-2 rounded bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            <Check size={16} />
          </button>
        </div>

        {/* Error Message */}
        {urlError && <p className="text-sm text-red-500">{urlError}</p>}
      </div>

      {/* Crop Dialog - Only render when we have a valid image source */}
      {showCropDialog && imageToCrop && imageToCrop.trim() !== "" && (
        <ImageCropDialog
          isOpen={showCropDialog}
          onClose={handleCloseCropDialog}
          imageSrc={imageToCrop}
          uploadCase={uploadCase}
          handleImageUpload={handleImageUpload}
          handleItemImageUpload={handleItemImageUpload}
        />
      )}
    </>
  );
};

export default UploadDropZoneWithCrop;

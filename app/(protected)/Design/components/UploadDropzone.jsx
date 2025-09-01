import React, { useState } from "react";
import { ImageUp } from "lucide-react";

const UploadDropzone = ({ edit, handleImageUpload, uploadCase }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Create a synthetic event object to match your existing handler
      const syntheticEvent = {
        target: { files: files },
      };
      handleImageUpload(syntheticEvent, uploadCase);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    if (edit) {
      document.getElementById("file-input").click();
    }
  };

  return (
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <ImageUp
          className={`w-8 h-8 ${edit ? "text-blue-500" : "text-gray-300"}`}
        />

        {/* Upload Text and Instructions */}
        <div className="text-center">
          <p
            className={`text-sm font-medium mb-1 ${
              edit ? "text-gray-700" : "text-gray-400"
            }`}
          ></p>
          <p className={`text-xs ${edit ? "text-gray-500" : "text-gray-400"}`}>
            Click to browse or drag and drop
          </p>
        </div>

        {/* Hidden file input */}
        <input
          id="file-input-detailed"
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, uploadCase)}
          disabled={!edit}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default UploadDropzone;

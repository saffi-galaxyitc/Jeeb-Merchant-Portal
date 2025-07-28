"use client";

import { useCallback, useState } from "react";
import { useField } from "formik";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ImagePicker = ({ name }) => {
  const [field, , helpers] = useField(name);
  const [preview, setPreview] = useState(field.value || null);
  const [showDropzone, setShowDropzone] = useState(!field.value);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
          helpers.setValue(reader.result); // Save base64 string
          setShowDropzone(false);
        };
        reader.readAsDataURL(file);
      }
    },
    [helpers]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: false,
  });

  const handleRemove = () => {
    setPreview(null);
    helpers.setValue("");
    setShowDropzone(true);
  };

  return (
    <div className="mb-6">
      <label className="block font-medium text-gray-700 mb-2">Logo</label>

      {preview && !showDropzone ? (
        <div className="flex items-center gap-4">
          <Image
            src={preview}
            alt="Logo Preview"
            width={48}
            height={48}
            className="rounded-md border"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowDropzone(true)}
          >
            Change
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleRemove}
            className="text-red-500"
          >
            Remove
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="h-56 flex items-center justify-center border border-dashed border-gray-300 rounded-lg cursor-pointer text-gray-500 text-sm px-4 text-center"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop your image here…</p>
          ) : (
            <p>Drag & drop an image here or click to upload</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePicker;

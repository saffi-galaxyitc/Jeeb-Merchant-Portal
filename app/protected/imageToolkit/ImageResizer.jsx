import React, { useState, useRef, useCallback } from "react";
import Resizer from "react-image-file-resizer";
import {
  Upload,
  Download,
  X,
  ImageIcon,
  Link,
  Settings,
  RotateCw,
} from "lucide-react";

const ImageResizer = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  // Resize settings
  const [settings, setSettings] = useState({
    width: 800,
    height: 600,
    quality: 90,
    format: "JPEG",
    rotation: 0,
    maintainAspectRatio: true,
  });

  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  const resizeImage = useCallback(
    (file) => {
      return new Promise((resolve) => {
        Resizer.imageFileResizer(
          file,
          settings.width,
          settings.height,
          settings.format,
          settings.quality,
          settings.rotation,
          (uri) => resolve(uri),
          "base64",
          settings.maintainAspectRatio ? settings.width : undefined,
          settings.maintainAspectRatio ? settings.height : undefined
        );
      });
    },
    [settings]
  );

  const handleImageProcess = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create preview of original image
      const originalPreview = URL.createObjectURL(file);
      setOriginalImage({
        file,
        preview: originalPreview,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      });

      // Resize the image
      const resizedUri = await resizeImage(file);

      // Convert base64 to blob for size calculation
      const response = await fetch(resizedUri);
      const blob = await response.blob();

      setResizedImage({
        uri: resizedUri,
        blob,
        size: (blob.size / 1024 / 1024).toFixed(2) + " MB",
        name: `resized_${
          file.name.split(".")[0]
        }.${settings.format.toLowerCase()}`,
      });
    } catch (err) {
      setError("Error processing image: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleImageProcess(file);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file) handleImageProcess(file);
    },
    [handleImageProcess]
  );

  const handleUrlLoad = async () => {
    if (!imageUrl) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) {
        throw new Error("URL does not point to a valid image");
      }

      const file = new File([blob], "image_from_url.jpg", { type: blob.type });
      await handleImageProcess(file);
    } catch (err) {
      setError("Error loading image from URL: " + err.message);
      setIsLoading(false);
    }
  };

  const downloadResizedImage = () => {
    if (!resizedImage) return;

    const link = document.createElement("a");
    link.href = resizedImage.uri;
    link.download = resizedImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImages = () => {
    setOriginalImage(null);
    setResizedImage(null);
    setError("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="w-full mt-4 p-6 bg-white rounded-lg shadow-lg">
      {/* Upload Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* File Upload & Drag Drop */}
          <div
            ref={dropRef}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* URL Input */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Load from URL</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUrlLoad}
                disabled={!imageUrl || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Settings className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-700">
              Resize Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={settings.width}
                onChange={(e) =>
                  updateSetting("width", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="4000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={settings.height}
                onChange={(e) =>
                  updateSetting("height", parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="4000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality (%)
              </label>
              <input
                type="range"
                value={settings.quality}
                onChange={(e) =>
                  updateSetting("quality", parseInt(e.target.value))
                }
                className="w-full"
                min="1"
                max="100"
              />
              <span className="text-sm text-gray-500">{settings.quality}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <select
                value={settings.format}
                onChange={(e) => updateSetting("format", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="JPEG">JPEG</option>
                <option value="PNG">PNG</option>
                <option value="WEBP">WebP</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.maintainAspectRatio}
                onChange={(e) =>
                  updateSetting("maintainAspectRatio", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Maintain aspect ratio
              </span>
            </label>

            <div className="flex items-center space-x-2">
              <RotateCw className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Rotation:</span>
              <select
                value={settings.rotation}
                onChange={(e) =>
                  updateSetting("rotation", parseInt(e.target.value))
                }
                className="px-2 py-1 border border-gray-300 text-black rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>0°</option>
                <option value={90}>90°</option>
                <option value={180}>180°</option>
                <option value={270}>270°</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Processing image...</span>
          </div>
        )}
      </div>

      {/* Image Comparison */}
      {originalImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Original
              </h3>
              <button
                onClick={clearImages}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video bg-white rounded border overflow-hidden mb-3">
              <img
                src={originalImage.preview}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>Name: {originalImage.name}</p>
              <p>Size: {originalImage.size}</p>
            </div>
          </div>

          {/* Resized Image */}
          {resizedImage && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Resized
                </h3>
                <button
                  onClick={downloadResizedImage}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
              <div className="aspect-video bg-white rounded border overflow-hidden mb-3">
                <img
                  src={resizedImage.uri}
                  alt="Resized"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Name: {resizedImage.name}</p>
                <p>Size: {resizedImage.size}</p>
                <p>
                  Dimensions: {settings.width} × {settings.height}px
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!originalImage && (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Start by uploading an image
          </h3>
          <p className="text-gray-500">
            Drag & drop, select from your device, or load from a URL to get
            started
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageResizer;

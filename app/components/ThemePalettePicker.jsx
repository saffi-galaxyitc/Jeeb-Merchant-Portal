"use client";

import { useEffect, useRef, useState } from "react";
import ColorThief from "color-thief-browser";

const ThemePalettePicker = ({ imageUrl, onSelectPalette }) => {
  const imageRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorSelect = (color) => {
    const hex = `#${color
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`;

    const alreadySelected = selectedColor === hex;
    const newSelection = alreadySelected ? null : hex;

    setSelectedColor(newSelection);
    onSelectPalette(newSelection);
  };

  const extractPalette = async () => {
    if (!imageRef.current) return;
    try {
      const colorThief = new ColorThief();
      const palette = await colorThief.getPalette(imageRef.current, 8);
      setColors(palette);
    } catch (error) {
      console.error("Error extracting colors:", error);
    }
  };

  // Trigger extraction once image is ready
  useEffect(() => {
    if (imageUrl && imageRef.current?.complete) {
      extractPalette();
    }
  }, [imageUrl]);

  return (
    <div className="space-y-4 mt-6">
      {/* Hidden image for extraction only */}
      {imageUrl && (
        <img
          ref={imageRef}
          src={imageUrl}
          alt="hidden"
          crossOrigin="anonymous"
          onLoad={extractPalette}
          className="hidden"
        />
      )}

      {colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Note:</strong> Select your app's{" "}
            <span className="font-medium text-slate-600">theme color</span>{" "}
            using the palette below. Once chosen, you can{" "}
            <span className="italic">fine-tune</span> it by clicking on the
            color bubble above.
          </p>
          <div className="flex flex-wrap gap-4 outline-dashed rounded-lg p-4">
            {colors.map((color, idx) => {
              const hex = `#${color
                .map((c) => c.toString(16).padStart(2, "0"))
                .join("")}`;
              const isSelected = selectedColor === hex;

              return (
                <div key={idx} className="space-y-1 text-center">
                  <button
                    className={`w-12 h-12 rounded-full ${
                      isSelected
                        ? "outline-blue-500 outline-4 outline-offset-4 outline-dashed"
                        : "outline-none"
                    }`}
                    style={{ backgroundColor: hex }}
                    onClick={() => handleColorSelect(color)}
                    title={hex}
                    type="button"
                  />
                  <div className="text-xs my-3">{hex}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePalettePicker;

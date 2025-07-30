"use client";

import { useEffect, useRef, useState } from "react";
import ColorThief from "color-thief-browser";

const ThemePalettePicker = ({ imageUrl, onSelectPalette }) => {
  const imageRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [selected, setSelected] = useState({
    primary: null,
    secondary: null,
  });

  const handleColorSelect = (type, color) => {
    const alreadySelected = selected[type]?.toString() === color.toString();
    const newSelection = {
      ...selected,
      [type]: alreadySelected ? null : color,
    };
    setSelected(newSelection);
    onSelectPalette({
      primary: newSelection.primary,
      secondary: newSelection.secondary,
    });
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
            <strong className="text-slate-700">Note:</strong> Select your app’s{" "}
            <span className="font-medium text-slate-600">primary</span> and{" "}
            <span className="font-medium text-slate-600">secondary</span> theme
            colors using the palette below. Once chosen, you can{" "}
            <span className="italic">fine-tune</span> them by clicking on the
            color bubbles.
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, idx) => {
              const hex = `#${color
                .map((c) => c.toString(16).padStart(2, "0"))
                .join("")}`;
              return (
                <div key={idx} className="space-y-1 text-center">
                  <button
                    className={`w-12 h-12 rounded-full border-4 ${
                      selected.primary?.toString() === color.toString()
                        ? "border-blue-500"
                        : selected.secondary?.toString() === color.toString()
                        ? "border-green-500"
                        : "border-white"
                    }`}
                    style={{ backgroundColor: hex }}
                    onClick={() => {
                      if (!selected.primary) {
                        handleColorSelect("primary", color);
                      } else if (
                        selected.primary?.toString() !== color.toString() &&
                        !selected.secondary
                      ) {
                        handleColorSelect("secondary", color);
                      } else if (
                        selected.primary?.toString() === color.toString()
                      ) {
                        handleColorSelect("primary", color);
                      } else if (
                        selected.secondary?.toString() === color.toString()
                      ) {
                        handleColorSelect("secondary", color);
                      }
                    }}
                    title={hex}
                    type="button"
                  />
                  <div className="text-xs">{hex}</div>
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

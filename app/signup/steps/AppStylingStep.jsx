"use client";

import ImagePicker from "@/app/components/ImagePicker";
import ThemePalettePicker from "@/app/components/ThemePalettePicker";
import { Button } from "@/app/components/ui/button";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { useRef } from "react";

const AppStylingStep = ({ onBack }) => {
  const {
    values,
    setFieldValue,
    validateForm,
    submitForm,
    setTouched,
    setErrors,
  } = useFormikContext();

  const colorInputRef = useRef(null);

  // const rgbArrayToHex = ([r, g, b]) =>
  //   "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

  // const hexToRgbArray = (hex) => {
  //   const bigint = parseInt(hex.slice(1), 16);
  //   return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  // };
  // const handleColorChange = (event) => {
  //   setFieldValue("theme_palette", event.target.value);
  // };

  const handleCustomSubmit = async () => {
    const errors = await validateForm();
    console.log("errors", errors, values);
    if (Object.keys(errors).length > 0) {
      // console.log("errors", errors, Object.keys(errors).length);
      setErrors(errors);
      setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
      return;
    }

    submitForm();
  };
  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">App Styling</h2>

      <ImagePicker name="logo" />
      <ErrorMessage
        name="logo"
        component="div"
        className="text-red-500 text-sm"
      />

      <ThemePalettePicker
        imageUrl={values.logo}
        onSelectPalette={(hexColor) => {
          setFieldValue("theme_palette", hexColor);
        }}
      />
      <ErrorMessage
        name="theme_palette"
        component="div"
        className="text-red-500 text-sm"
      />

      {values.theme_palette && (
        <div className="flex items-center gap-2 mt-4 outline-dashed rounded-lg p-4">
          <strong className="text-sm text-slate-700">Selected Color:</strong>
          <div
            onClick={() => colorInputRef.current?.click()}
            className="w-6 h-6 rounded-full border cursor-pointer"
            style={{
              backgroundColor: values.theme_palette,
            }}
          />
          <span className="text-xs">{values.theme_palette}</span>
          <input
            ref={colorInputRef}
            type="color"
            value={values.theme_palette}
            onChange={(e) => setFieldValue("theme_palette", e.target.value)}
            className="hidden"
          />
        </div>
      )}

      <div className="flex justify-between mt-4 gap-4">
        <div className="w-1/2">
          <Button
            type="button"
            className="btn h-14 w-full text-xl font-bold theme-bg-blue"
            onClick={onBack}
          >
            Back
          </Button>
        </div>
        <div className="w-1/2">
          <Button
            type="button"
            onClick={handleCustomSubmit}
            className="btn h-14 w-full text-xl font-bold theme-bg-blue"
          >
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppStylingStep;

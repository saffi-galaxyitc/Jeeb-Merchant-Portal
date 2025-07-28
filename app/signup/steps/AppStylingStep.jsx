"use client";

import ImagePicker from "@/components/ImagePicker";
import ThemePalettePicker from "@/components/ThemePalettePicker";
import { Button } from "@/components/ui/button";
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

  const primaryInputRef = useRef(null);
  const secondaryInputRef = useRef(null);

  const rgbArrayToHex = ([r, g, b]) =>
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

  const hexToRgbArray = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };
  const handleColorChange = (type, event) => {
    const newColor = hexToRgbArray(event.target.value);
    setFieldValue("theme_palette", {
      ...values.theme_palette,
      [type]: newColor,
    });
  };

  const handleCustomSubmit = async () => {
    const errors = await validateForm();
    // console.log("errors", errors, values);
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
        onSelectPalette={({ primary, secondary }) => {
          setFieldValue("theme_palette", {
            primary,
            secondary,
          });
        }}
      />
      <ErrorMessage
        name="theme_palette.primary"
        component="div"
        className="text-red-500 text-sm"
      />
      <ErrorMessage
        name="theme_palette.secondary"
        component="div"
        className="text-red-500 text-sm"
      />
      {/* {Array.isArray(values.theme_palette?.primary) &&
        values.theme_palette.primary.length === 3 && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm">Primary:</span>
            <div
              className="w-6 h-6 rounded-full border"
              style={{
                backgroundColor: `rgb(${values.theme_palette.primary.join(
                  ","
                )})`,
              }}
            />
          </div>
        )}

      {Array.isArray(values.theme_palette?.secondary) &&
        values.theme_palette.secondary.length === 3 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm">Secondary:</span>
            <div
              className="w-6 h-6 rounded-full border"
              style={{
                backgroundColor: `rgb(${values.theme_palette.secondary.join(
                  ","
                )})`,
              }}
            />
          </div>
        )} */}
      {Array.isArray(values.theme_palette?.primary) &&
        values.theme_palette.primary.length === 3 && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm">Primary:</span>
            <div
              onClick={() => primaryInputRef.current?.click()}
              className="w-6 h-6 rounded-full border cursor-pointer"
              style={{
                backgroundColor: `rgb(${values.theme_palette.primary.join(
                  ","
                )})`,
              }}
            />
            <input
              ref={primaryInputRef}
              type="color"
              defaultValue={rgbArrayToHex(values.theme_palette.primary)}
              onChange={(e) => handleColorChange("primary", e)}
              className="hidden"
            />
          </div>
        )}

      {Array.isArray(values.theme_palette?.secondary) &&
        values.theme_palette.secondary.length === 3 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm">Secondary:</span>
            <div
              onClick={() => secondaryInputRef.current?.click()}
              className="w-6 h-6 rounded-full border cursor-pointer"
              style={{
                backgroundColor: `rgb(${values.theme_palette.secondary.join(
                  ","
                )})`,
              }}
            />
            <input
              ref={secondaryInputRef}
              type="color"
              defaultValue={rgbArrayToHex(values.theme_palette.secondary)}
              onChange={(e) => handleColorChange("secondary", e)}
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

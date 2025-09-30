"use client";
import { Button } from "@/app/components/ui/button";
import { getSettings, updateSettings } from "@/DAL/settings";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import * as Yup from "yup";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** Validate any CSS color string */
const isValidCssColor = (value) => {
  if (typeof document === "undefined") return true; // skip SSR validation
  const s = new Option().style;
  s.color = value;
  return s.color !== "";
};

// Validation Schema
const SettingsSchema = Yup.object().shape({
  name: Yup.string().required("App name is required"),
  logo: Yup.string().required("Logo is required"),
  app_color: Yup.string()
    .required("App color is required")
    .test("is-valid-color", "Invalid CSS color", (val) => isValidCssColor(val)),
  description: Yup.string().nullable(),
});

const SettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState({
    name: "",
    logo: "",
    app_color: "",
    description: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Fetch Settings
  const getData = async () => {
    setLoading(true);
    try {
      const response = await getSettings();
      const result = response?.data?.result;
      if (result?.code === 200) {
        const { name, logo, app_color, description } = result?.result;
        setInitialData({
          name: name || "",
          logo: logo
            ? logo.startsWith("data:")
              ? logo
              : `${BASE_URL}${logo}`
            : "",
          app_color: app_color || "#0636ff",
          description: description || "",
        });
      }
    } catch (error) {
      console.error("Something went wrong while fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Settings
  const updateData = async (values) => {
    setLoading(true);
    try {
      const updatedFields = {};
      Object.keys(values).forEach((key) => {
        if (values[key] !== initialData[key]) {
          if (key === "logo" && values[key].startsWith(BASE_URL)) {
            updatedFields[key] = values[key].replace(BASE_URL, "");
          } else {
            updatedFields[key] = values[key];
          }
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        const payload = { vals: updatedFields };
        const response = await updateSettings({ payload });
        const result = response?.data?.result;
        if (result?.code === 200) {
          const { name, logo, app_color, description } = result?.result;
          setInitialData({
            name,
            logo: logo
              ? logo.startsWith("data:")
                ? logo
                : `${BASE_URL}${logo}`
              : "",
            app_color,
            description,
          });
        }
      }
      setEditMode(false);
    } catch (error) {
      console.error("Something went wrong while updating settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Logo Upload (base64)
  const handleLogoUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("logo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Loader */}
      {loading && (
        <div className="absolute top-2 right-2">
          <ScaleLoader color="oklch(62.3% 0.214 259.815)" height={20} />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">App Settings</h2>

      <Formik
        initialValues={initialData}
        enableReinitialize
        validationSchema={SettingsSchema}
        onSubmit={updateData}
      >
        {({ values, setFieldValue, handleReset }) => (
          <Form className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                App Name *
              </label>
              <Field
                name="name"
                type="text"
                disabled={!editMode}
                className="w-full border text-black disabled:text-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows="3"
                disabled={!editMode}
                className="w-full border text-black disabled:text-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* App Color */}
            <div>
              <label className="block text-sm font-medium mb-1">
                App Color *
              </label>
              <div className="flex items-center gap-4">
                {/* Color picker */}
                <input
                  type="color"
                  disabled={!editMode}
                  value={
                    isValidCssColor(values.app_color)
                      ? values.app_color
                      : "#0636ff"
                  }
                  onChange={(e) => setFieldValue("app_color", e.target.value)}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
                {/* Manual input */}
                <Field
                  name="app_color"
                  type="text"
                  disabled={!editMode}
                  placeholder="Pick a color or type (e.g. #ff0000, rgb(), oklch())"
                  className="flex-1 border text-black disabled:text-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                {/* Live preview box */}
                <div
                  className="w-10 h-10 rounded border"
                  style={{
                    backgroundColor: isValidCssColor(values.app_color)
                      ? values.app_color
                      : "transparent",
                  }}
                  title={values.app_color}
                ></div>
              </div>
              <ErrorMessage
                name="app_color"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium mb-1">Logo *</label>
              {values.logo && (
                <img
                  src={values.logo}
                  alt="Logo Preview"
                  className="h-16 mb-2 object-contain"
                />
              )}
              <input
                type="file"
                accept="image/*"
                disabled={!editMode}
                onChange={(e) => handleLogoUpload(e, setFieldValue)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:border file:border-gray-300 file:rounded file:bg-gray-50 hover:file:bg-gray-100"
              />
              <ErrorMessage
                name="logo"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              {!editMode ? (
                <Button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 text-white border-1 border-blue-600 hover:text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200 disabled:opacity-50"
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      handleReset();
                      setEditMode(false);
                    }}
                    className="text-blue-600 bg-white border-1 border-blue-600 hover:bg-white hover:text-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white border-1 border-blue-600 hover:text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200 disabled:opacity-50"
                  >
                    Save
                  </Button>
                </>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SettingsForm;

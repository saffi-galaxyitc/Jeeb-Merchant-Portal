"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Upload, X, Plus, GripVertical, ArrowLeft, Trash2 } from "lucide-react";

// Shadcn UI Components (simplified versions)
const Button = ({
  children,
  variant = "default",
  size = "default",
  type = "button",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    borderless:
      "text-blue-700 bg-transparent hover:border hover:border-blue-700",
  };
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Select = ({ children, ...props }) => (
  <select
    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  >
    {children}
  </select>
);

const Checkbox = ({ checked, ...props }) => (
  <input
    type="checkbox"
    checked={checked}
    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    {...props}
  />
);

const Label = ({ children, className = "", ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  >
    {children}
  </label>
);

// Validation Schema
const productSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  cost: Yup.number()
    .positive("Cost must be positive")
    .required("Cost is required"),
  salesPrice: Yup.number()
    .positive("Sales price must be positive")
    .required("Sales price is required"),
  quantity: Yup.number()
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  trackQuantity: Yup.boolean(),
  chargeTax: Yup.boolean(),
  locations: Yup.array().of(Yup.string()),
  tags: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Tag name is required"),
      values: Yup.array()
        .of(Yup.string())
        .min(1, "At least one value is required"),
    })
  ),
  keyHighlights: Yup.string(),
});

export default function ProductForm({ id }) {
  const isNew = id === "new";
  const [uploadedImage, setUploadedImage] = useState(null);

  const initialValues = {
    title: "Nivea",
    description: "",
    category: "",
    cost: "",
    salesPrice: "",
    quantity: 45,
    trackQuantity: true,
    chargeTax: true,
    locations: ["dammam", "makkah"],
    tags: [
      {
        name: "Gender",
        values: ["Male", "Female", "Uni"],
      },
    ],
    keyHighlights: "",
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form values:", values);
    console.log("Uploaded image:", uploadedImage);

    if (isNew) {
      console.log("Creating product:", values);
      // POST /api/products
    } else {
      console.log("Updating product:", values);
      // PUT /api/products/:id
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-8">Add New Product</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={productSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {uploadedImage ? (
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Product"
                        className="max-w-xs mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setUploadedImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <Label
                        htmlFor="image-upload"
                        className="text-blue-600 cursor-pointer"
                      >
                        Upload
                      </Label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-100 rounded-lg border border-gray-200 p-6 space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Field name="title">
                    {({ field }) => (
                      <Input
                        {...field}
                        id="title"
                        placeholder="Product title"
                        className={
                          errors.title && touched.title ? "border-red-500" : ""
                        }
                      />
                    )}
                  </Field>
                  {errors.title && touched.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Field name="description">
                    {({ field }) => (
                      <div className="border border-gray-300 rounded-md">
                        <div className="border-b border-gray-200 px-3 py-2 bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <Select
                              defaultValue="paragraph"
                              className="h-8 text-xs border-0 bg-transparent"
                            >
                              <option value="paragraph">Paragraph</option>
                              <option value="heading">Heading</option>
                            </Select>
                            <div className="flex items-center space-x-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <strong>B</strong>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <em>I</em>
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <u>U</u>
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="Product description"
                          className="border-0 rounded-t-none"
                          rows={4}
                        />
                      </div>
                    )}
                  </Field>
                  {errors.description && touched.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Field name="category">
                    {({ field }) => (
                      <Select {...field} id="category">
                        <option value="">Select category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="beauty">Beauty</option>
                        <option value="home">Home & Garden</option>
                      </Select>
                    )}
                  </Field>
                  {errors.category && touched.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-100 rounded-lg border border-gray-200 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost">Cost</Label>
                    <Field name="cost">
                      {({ field }) => (
                        <Input
                          {...field}
                          id="cost"
                          type="number"
                          placeholder="0.00"
                          className={
                            errors.cost && touched.cost ? "border-red-500" : ""
                          }
                        />
                      )}
                    </Field>
                    {errors.cost && touched.cost && (
                      <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="salesPrice">Sales Price</Label>
                    <Field name="salesPrice">
                      {({ field }) => (
                        <Input
                          {...field}
                          id="salesPrice"
                          type="number"
                          placeholder="0.00"
                          className={
                            errors.salesPrice && touched.salesPrice
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    </Field>
                    {errors.salesPrice && touched.salesPrice && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salesPrice}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Field name="chargeTax">
                    {({ field }) => (
                      <Checkbox
                        {...field}
                        id="chargeTax"
                        checked={values.chargeTax}
                        onChange={(e) =>
                          setFieldValue("chargeTax", e.target.checked)
                        }
                      />
                    )}
                  </Field>
                  <Label htmlFor="chargeTax">Charge tax on it</Label>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-gray-100 rounded-lg border border-gray-200 p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Field name="trackQuantity">
                    {({ field }) => (
                      <Checkbox
                        {...field}
                        id="trackQuantity"
                        checked={values.trackQuantity}
                        onChange={(e) =>
                          setFieldValue("trackQuantity", e.target.checked)
                        }
                      />
                    )}
                  </Field>
                  <Label htmlFor="trackQuantity">Track quantity</Label>
                </div>

                {values.trackQuantity && (
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Field name="quantity">
                      {({ field }) => (
                        <Input
                          {...field}
                          id="quantity"
                          type="number"
                          className={
                            errors.quantity && touched.quantity
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    </Field>
                    {errors.quantity && touched.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.quantity}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label>Locations</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Field name="locations">
                        {({ field }) => (
                          <Checkbox
                            checked={values.locations.includes("dammam")}
                            onChange={(e) => {
                              const newLocations = e.target.checked
                                ? [...values.locations, "dammam"]
                                : values.locations.filter(
                                    (loc) => loc !== "dammam"
                                  );
                              setFieldValue("locations", newLocations);
                            }}
                          />
                        )}
                      </Field>
                      <Label>Dammam Regional Storage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Field name="locations">
                        {({ field }) => (
                          <Checkbox
                            checked={values.locations.includes("makkah")}
                            onChange={(e) => {
                              const newLocations = e.target.checked
                                ? [...values.locations, "makkah"]
                                : values.locations.filter(
                                    (loc) => loc !== "makkah"
                                  );
                              setFieldValue("locations", newLocations);
                            }}
                          />
                        )}
                      </Field>
                      <Label>Makkah Retail Store Backroom 1</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-100 rounded-lg border border-gray-200 p-6">
                <Label className="text-base font-medium mb-4 block">Tags</Label>
                <FieldArray name="tags">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                              <div className="flex-1">
                                <Field name={`tags.${index}.name`}>
                                  {({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder="Tag name"
                                      className="border-0 bg-gray-50"
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {tag.values.map((value, valueIndex) => (
                                <span
                                  key={valueIndex}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                >
                                  {value}
                                </span>
                              ))}
                            </div>

                            <div>
                              <Label>Name</Label>
                              <Field name={`tags.${index}.name`}>
                                {({ field }) => <Input {...field} />}
                              </Field>
                            </div>

                            <div>
                              <Label>Values</Label>
                              <FieldArray name={`tags.${index}.values`}>
                                {({ push: pushValue, remove: removeValue }) => (
                                  <div className="space-y-2">
                                    {tag.values.map((value, valueIndex) => (
                                      <div
                                        key={valueIndex}
                                        className="flex items-center space-x-2"
                                      >
                                        <GripVertical className="h-4 w-4 text-gray-400" />
                                        <Field
                                          name={`tags.${index}.values.${valueIndex}`}
                                        >
                                          {({ field }) => (
                                            <Input
                                              {...field}
                                              className="flex-1"
                                            />
                                          )}
                                        </Field>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            removeValue(valueIndex)
                                          }
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => pushValue("")}
                                    >
                                      Add Value
                                    </Button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>

                            <div className="flex space-x-2">
                              <Button type="button" variant="outline" size="sm">
                                Delete
                              </Button>
                              <Button type="button" size="sm">
                                Done
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => push({ name: "", values: [""] })}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add another
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Key Highlights */}
              <div className="bg-gray-100 rounded-lg border border-gray-200 p-6">
                <Label htmlFor="keyHighlights">Key Highlights</Label>
                <Field name="keyHighlights">
                  {({ field }) => (
                    <Textarea
                      {...field}
                      id="keyHighlights"
                      placeholder="Enter key highlights"
                      rows={3}
                    />
                  )}
                </Field>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between">
                <Button type="button" variant="borderless" size="lg">
                  Remove
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  onClick={() =>
                    handleSubmit(values, { setSubmitting: () => {} })
                  }
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
}

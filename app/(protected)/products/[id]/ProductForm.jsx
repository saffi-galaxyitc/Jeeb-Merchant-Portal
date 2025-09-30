"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import {
  Upload,
  X,
  Plus,
  GripVertical,
  ArrowLeft,
  Trash2,
  SquarePen,
  Save,
  Edit,
} from "lucide-react";
import Select from "react-select";
import { useProduct } from "@/app/mainContext/ProductContext";
import {
  createProduct,
  getCategories,
  getProductDetails,
  handleCreateUpdateTag,
  updateProduct,
} from "@/DAL/products";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import DescriptionField from "../DescriptionField.client";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { Button, Input, Textarea, Checkbox, Label } from "../formComponents";

// Validation Schema
const productSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  category: Yup.object()
    .shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
    })
    .test("not-empty", "Category is required", (value) => {
      return value && Object.keys(value).length > 0 && value.id;
    }),
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
  description_sale: Yup.string(),
});

export default function ProductForm({ id }) {
  const isNew = id === "new";
  const [uploadedImage, setUploadedImage] = useState(null);
  const [edit, setEdit] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [editingTagIndex, setEditingTagIndex] = useState(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  //category states
  const [categories, setCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(false);
  const {
    product,
    removeProduct,
    setProduct,
    loadingProduct,
    setLoadingProduct,
  } = useProduct();
  const router = useRouter();

  // Convert API product data to form format
  const getInitialValues = () => {
    if (isNew || !product) {
      return {
        title: "",
        description: "",
        category: {},
        cost: "",
        salesPrice: "",
        quantity: 0,
        trackQuantity: true,
        chargeTax: true,
        locations: [],
        tags: [],
        description_sale: "",
      };
    }

    // Transform API data to form data
    const formTags =
      product.tags?.map((tag) => ({
        name: tag.name,
        values: tag.values?.map((value) => value.name) || [],
      })) || [];

    return {
      title: product?.name || "",
      description: product?.description || "",
      category: product?.category || {},
      cost: product?.cost || "",
      salesPrice: product?.price || "",
      quantity: product?.quantity || 0,
      trackQuantity: true,
      chargeTax: true,
      locations: [],
      tags: formTags,
      description_sale: product?.description_sale || "",
    };
  };
  const fetchProduct = async () => {
    setLoadingProduct(true);
    try {
      const response = await getProductDetails({ id });
      const result = response?.data?.result;
      if (result?.code === 200) {
        setProduct(result.result); // always overwrite with latest
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoadingProduct(false);
    }
  };
  useEffect(() => {
    if (id && id !== "new") {
      fetchProduct(); // always fetch on id change
    } else {
      removeProduct();
    }
  }, [id]);
  // Fetch categories from API
  const fetchCategories = useCallback(async (query = "") => {
    setLoadingCategory(true);
    try {
      const response = await getCategories({
        payload: { limit: 20, offset: 0, query },
      });

      const result = response?.data?.result;
      if (result?.code === 200) {
        setCategories(result.result || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategory(false);
    }
  }, []);
  // Debounced search
  const debouncedFetch = useCallback(
    debounce((q) => {
      fetchCategories(q);
    }, 500),
    [fetchCategories]
  );
  useEffect(() => {
    if (categorySearchTerm) {
      debouncedFetch(categorySearchTerm);
    } else {
      fetchCategories();
    }
  }, [categorySearchTerm, debouncedFetch, fetchCategories]);

  // Set uploaded image from product data
  useEffect(() => {
    if (product?.image && !isNew) {
      setUploadedImage(`${BASE_URL}${product.image}`);
    }
  }, [product, isNew]);

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
  const handleSubmit = async (values) => {
    console.log("Form values:", values, product);
    console.log("Uploaded image:", uploadedImage);

    // --- Step 1: build normalized form data
    const formData = {
      name: values.title,
      category: values.category,
      price: parseFloat(values.salesPrice),
      cost: parseFloat(values.cost),
      quantity: parseFloat(values.quantity),
      tags: values?.tags?.map((tag) => ({
        name: tag.name,
        values: tag.values.map((value) => ({ name: value })),
      })),
      description: values?.description,
      description_sale: values?.description_sale,
    };

    let payload = {};

    // --- Step 2: handle new vs update
    if (isNew) {
      // For new product, always send everything
      payload = {
        name: formData?.name,
        category: formData?.category?.id,
        price: formData?.price,
        cost: formData?.cost,
        quantity: formData?.quantity,
        description: formData?.description,
        description_sale: formData?.description_sale,
      };
      if (uploadedImage) payload.image = uploadedImage;
      try {
        const response = await createProduct({
          payload: payload,
        });
        const result = response?.data?.result;
        console.log("result", result);
        if (result?.code === 200) {
          if (result?.result?.id) {
            router.push(`/products/${result?.result?.id}`);
            toast.success("Product created successfully!");
          }
        } else {
          toast.error("Product creation failed!");
          return;
        }
      } catch (error) {
        console.error("Something went wrong while creating product:", error);
      }
    } else {
      // For update, send only diffs
      let changes = {};

      if (product.name !== formData.name) changes.name = formData.name;
      if ((product.category?.id || null) !== (formData.category?.id || null))
        changes.category = formData.category?.id;
      if (parseFloat(product.price) !== formData.price)
        changes.price = formData.price;
      if (parseFloat(product.cost) !== formData.cost)
        changes.cost = formData.cost;
      if (parseFloat(product.quantity) !== formData.quantity)
        changes.quantity = formData.quantity;
      if (product.description !== formData.description)
        changes.description = formData.description;
      if (product.description_sale !== formData.description_sale) {
        changes.description_sale = formData.description_sale;
      }
      // Compare tags
      const normalizeTags = (tags) =>
        (tags || []).map((t) => ({
          name: t.name,
          values: (t.values || []).map((v) =>
            typeof v === "string" ? v : v.name
          ),
        }));

      if (
        JSON.stringify(normalizeTags(product.tags)) !==
        JSON.stringify(normalizeTags(values.tags))
      ) {
        changes.tags = formData.tags;
      }

      // Image only if updated
      if (uploadedImage && uploadedImage !== `${BASE_URL}${product.image}`) {
        changes.image = uploadedImage;
      }
      if (Object.keys(changes).length > 0) {
        console.log("show changes", changes);
        try {
          const response = await updateProduct({
            payload: changes,
            id: product.id,
          });
          const result = response?.data?.result;
          console.log("result", result);
          if (result?.code === 200) {
            if (result?.result?.id == id) {
              await fetchProduct();
              toast.success("Product updated successfully!");
              await handleEdit();
            }
          } else {
            toast.error("Product update failed!");
          }
        } catch (error) {
          console.error("Something went wrong while updating product:", error);
        }
      } else {
        await handleEdit();
        return;
      }
    }
  };
  const handleEdit = async () => {
    console.log("edit", edit);
    setEdit(!edit);
    setDisabled(!disabled);
  };
  const handleCreateUpdateTagAPI = async (tagData, attachToProduct = false) => {
    setIsCreatingTag(true);
    try {
      const payload = {
        tag_name: tagData.name,
        val_names: tagData.values,
        product_id: attachToProduct ? parseInt(id) : false,
      };

      const response = await handleCreateUpdateTag({ payload });
      const result = response?.data?.result;

      if (result?.code === 200) {
        toast.success("Tag created successfully");
        // Refresh product data to get updated tags
        if (attachToProduct && !isNew) {
          await fetchProduct();
        }
        return true;
      }
    } catch (error) {
      console.error("Something went wrong while create/update tag:", error);
      toast.error("Failed to create/update tag");
      return false;
    } finally {
      setIsCreatingTag(false);
    }
  };
  const handleTagDone = async (
    tagData,
    attachToProduct,
    setFieldValue,
    values,
    tagIndex
  ) => {
    const success = await handleCreateUpdateTagAPI(tagData, attachToProduct);

    if (success) {
      // If not attaching to product, just add to form state
      if (!attachToProduct) {
        const newTags = [...values.tags];
        if (tagIndex !== undefined && tagIndex >= 0) {
          // Update existing tag
          newTags[tagIndex] = { ...tagData, isExisting: false };
        } else {
          // Add new tag
          newTags.push({ ...tagData, isExisting: false });
        }
        setFieldValue("tags", newTags);
      }

      // Close editing mode
      setEditingTagIndex(null);
    }
  };
  // Show loading state
  if (loadingProduct && !isNew) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={productSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true} // Important: This allows the form to update when product data loads
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="mb-8 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                  {isNew ? "Add New Product" : ""}
                </h1>
                {!edit && !isNew ? (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault(); // just in case
                      console.log("Edit clicked → should NOT submit");
                      handleEdit();
                    }}
                  >
                    <SquarePen className="h-6 w-6 "></SquarePen>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    // onClick={handleSubmit}
                  >
                    <Save className="h-6 w-6 "></Save>
                  </Button>
                )}
              </div>
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
                      {edit && (
                        <Button
                          type="button"
                          // disabled={disabled}
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setUploadedImage(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
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
                        disabled={disabled && !isNew}
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
                  {/* Updated Description Field with React TipTap Editor */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Field name="description">
                      {({ field, form }) => (
                        <DescriptionField
                          field={field}
                          form={form}
                          disabled={disabled && !isNew}
                          placeholder="Product description"
                        />
                      )}
                    </Field>
                    {errors.description && touched.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Field name="category">
                    {({ field, form }) => (
                      <Select
                        id="category"
                        isDisabled={disabled && !isNew}
                        isLoading={loadingCategory}
                        options={categories}
                        getOptionLabel={(option) => option.name || ""}
                        getOptionValue={(option) => option.id?.toString() || ""}
                        value={field.value?.id ? field.value : null}
                        onChange={(selectedCategory) => {
                          form.setFieldValue(
                            "category",
                            selectedCategory || {}
                          );
                        }}
                        onInputChange={(inputValue) => {
                          setCategorySearchTerm(inputValue);
                        }}
                        placeholder="Select category"
                        isClearable
                        isSearchable
                        noOptionsMessage={({ inputValue }) =>
                          inputValue
                            ? `No categories found for "${inputValue}"`
                            : "No categories available"
                        }
                        loadingMessage={() => "Loading categories..."}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderColor:
                              errors.category && touched.category
                                ? "#ef4444"
                                : base.borderColor,
                            "&:hover": {
                              borderColor:
                                errors.category && touched.category
                                  ? "#ef4444"
                                  : base.borderColor,
                            },
                          }),
                        }}
                      />
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
                          step="0.01"
                          disabled={disabled && !isNew}
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
                          step="0.01"
                          disabled={disabled && !isNew}
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
                        disabled={disabled && !isNew}
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
              {!isNew && (
                <div className="bg-gray-100 rounded-lg border border-gray-200 p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Field name="trackQuantity">
                      {({ field }) => (
                        <Checkbox
                          {...field}
                          id="trackQuantity"
                          disabled={disabled}
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
                            disabled={disabled}
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
                              disabled={disabled}
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
                              disabled={disabled}
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
              )}

              {/* Tags */}
              {!isNew && (
                <div className="bg-gray-100 rounded-lg border border-gray-200 p-6">
                  <Label className="text-base font-medium mb-4 block">
                    Tags
                  </Label>
                  <FieldArray name="tags">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {/* ✅ Show message if no tags exist */}
                        {values.tags.length === 0 && (
                          <div className="text-center text-gray-500 text-sm py-6 border border-dashed border-gray-300 rounded-lg">
                            No tags available. Add some using the button below.
                          </div>
                        )}

                        {values.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 space-y-4"
                          >
                            {editingTagIndex === index ? (
                              // 🔹 Edit mode
                              <div className="space-y-4">
                                {/* your edit form code */}
                                {/* Tag Edit Form - Show when editing existing tag */}
                                {typeof editingTagIndex === "number" &&
                                  editingTagIndex === index &&
                                  values.tags.length > 0 && (
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <GripVertical className="h-4 w-4 text-gray-400" />
                                          <div className="text-sm font-medium">
                                            Edit Tag
                                          </div>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            setEditingTagIndex(null)
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>

                                      <div>
                                        <Label>Name</Label>
                                        <Field name={`tags.${index}.name`}>
                                          {({ field }) => <Input {...field} />}
                                        </Field>
                                      </div>

                                      <div>
                                        <Label>Values</Label>
                                        <FieldArray
                                          name={`tags.${index}.values`}
                                        >
                                          {({
                                            push: pushValue,
                                            remove: removeValue,
                                          }) => (
                                            <div className="space-y-2">
                                              {tag.values?.map(
                                                (value, valueIndex) => (
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
                                                )
                                              )}
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
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => remove(index)}
                                        >
                                          Delete
                                        </Button>
                                        <Button
                                          type="button"
                                          size="sm"
                                          disabled={isCreatingTag}
                                          onClick={() =>
                                            handleTagDone(
                                              values.tags[index],
                                              true, // attachToProduct = true for existing tags
                                              setFieldValue,
                                              values,
                                              index
                                            )
                                          }
                                        >
                                          {isCreatingTag ? "Saving..." : "Done"}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ) : (
                              // 🔹 View mode
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {tag.name}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {tag.values?.map((value, valueIndex) => (
                                        <span
                                          key={valueIndex}
                                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                        >
                                          {value}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingTagIndex(index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => remove(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* New Tag Edit Form */}
                        {editingTagIndex === "new" &&
                          values.tags.length > 0 &&
                          !values.tags[values.tags.length - 1].isExisting && (
                            <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-blue-50">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">
                                  New Tag
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    remove(values.tags.length - 1);
                                    setEditingTagIndex(null);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              <div>
                                <Label>Name</Label>
                                <Field
                                  name={`tags.${values.tags.length - 1}.name`}
                                >
                                  {({ field }) => (
                                    <Input
                                      {...field}
                                      placeholder="Enter tag name"
                                    />
                                  )}
                                </Field>
                              </div>

                              <div>
                                <Label>Values</Label>
                                <FieldArray
                                  name={`tags.${values.tags.length - 1}.values`}
                                >
                                  {({
                                    push: pushValue,
                                    remove: removeValue,
                                  }) => (
                                    <div className="space-y-2">
                                      {values.tags[
                                        values.tags.length - 1
                                      ].values?.map((value, valueIndex) => (
                                        <div
                                          key={valueIndex}
                                          className="flex items-center space-x-2"
                                        >
                                          <GripVertical className="h-4 w-4 text-gray-400" />
                                          <Field
                                            name={`tags.${
                                              values.tags.length - 1
                                            }.values.${valueIndex}`}
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
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    remove(values.tags.length - 1);
                                    setEditingTagIndex(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={isCreatingTag}
                                  onClick={() => {
                                    const currentTag =
                                      values.tags[values.tags.length - 1];
                                    const attachToProduct =
                                      currentTag.attachToProduct || false;
                                    handleTagDone(
                                      currentTag,
                                      attachToProduct,
                                      setFieldValue,
                                      values
                                    );
                                    setEditingTagIndex(null); // ✅ reset after done
                                  }}
                                >
                                  {isCreatingTag ? "Saving..." : "Done"}
                                </Button>
                              </div>
                            </div>
                          )}

                        {/* Add New Tag Section */}
                        <div className="flex flex-col items-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              push({
                                name: "",
                                values: [""],
                                isExisting: false,
                              });
                              setEditingTagIndex("new"); // ✅ sentinel value for new tag
                            }}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add another
                          </Button>

                          <div className="flex items-center justify-center gap-2 py-4 w-full">
                            <span
                              className={`flex-grow border-t border-1 border-dashed ${
                                edit ? "border-gray-300" : "border-gray-200"
                              }`}
                            />
                            <span
                              className={`font-bold ${
                                edit ? "text-gray-300" : "text-gray-200"
                              }`}
                            >
                              Or
                            </span>
                            <span
                              className={`flex-grow border-t border-1 border-dashed ${
                                edit ? "border-gray-300" : "border-gray-200"
                              }`}
                            />
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              push({
                                name: "",
                                values: [""],
                                isExisting: false,
                                attachToProduct: true,
                              });
                              setEditingTagIndex("new"); // ✅ sentinel value for new tag
                            }}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add another and attach
                          </Button>
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </div>
              )}

              {/* Key Highlights */}
              <div className="bg-gray-100 rounded-lg border border-gray-200 p-6">
                <Label htmlFor="description_sale">Key Highlights</Label>
                <Field name="description_sale">
                  {({ field }) => (
                    <Textarea
                      {...field}
                      id="description_sale"
                      placeholder="Enter key highlights"
                      rows={3}
                    />
                  )}
                </Field>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

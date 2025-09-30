import React, { useState, useCallback, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LAYOUT_TYPES = [
  { value: "Home", label: "Home Page" },
  { value: "SubCategory", label: "Category Page" },
  { value: "AllProducts", label: "Product Page" },
];

const PageManagementSheet = ({
  isOpen,
  onOpenChange,
  onSave,
  initialData = null,
  appId,
  templateName,
  currentPageId,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    layout_type: "SubCategory",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when sheet opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        console.log("initial data", initialData);
        setFormData({
          name: initialData.name || "",
          layout_type: initialData.layout_type || "SubCategory",
        });
      } else {
        setFormData({
          name: "",
          layout_type: "SubCategory",
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Page name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Page name must be at least 2 characters";
    }

    if (!formData.layout_type) {
      newErrors.layout_type = "Layout type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let payload;
      if (isEditing) {
        payload = {
          page_id: initialData?.id,
          vals: {
            name: formData.name.trim(),
          },
        };
      } else {
        payload = {
          vals: {
            app_id: appId,
            name: formData.name.trim(),
            layout_type: formData.layout_type,
          },
        };
      }

      await onSave(payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving page:", error);
      // You might want to show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Page" : "Add New Page"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the page details below."
              : "Create a new page by filling in the details below."}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 px-4 space-y-4">
          {/* Page Name Field */}
          <div className="space-y-2">
            <Label htmlFor="page-name">Page Name *</Label>
            <Input
              id="page-name"
              placeholder="Enter page name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Layout Type Field */}
          <div className="space-y-2">
            <Label htmlFor="layout-type">Layout Type *</Label>
            <Select
              value={formData.layout_type}
              onValueChange={(value) => handleInputChange("layout_type", value)}
            >
              <SelectTrigger
                className={errors.layout_type ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select layout type" />
              </SelectTrigger>
              <SelectContent>
                {LAYOUT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.layout_type && (
              <p className="text-sm text-red-500">{errors.layout_type}</p>
            )}
          </div>

          {/* App ID Info (Hidden from user but shown for reference) */}
          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
            Template Name: {templateName}
          </div>
        </div>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button
              className="text-blue-600 bg-white border-1 border-blue-600 hover:bg-white hover:text-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </SheetClose>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="min-w-[80px] bg-blue-600 text-white border-1 border-blue-600 hover:text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : isEditing ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
export default PageManagementSheet;

"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { updateTemplate } from "@/DAL/design";
import { shallowEqual } from "@/lib/utils";

export function TemplateDialog({
  templates = [],
  selectedTemplate,
  setSelectedTemplate,
  defaultTemplate,
  setDefaultTemplate,
}) {
  const [open, setOpen] = useState(false);

  //   console.log("TemplateDialog render - selectedTemplate:", selectedTemplate);
  //   console.log("TemplateDialog render - templates:", templates);

  // Make the selected template object available whether the prop is an id or an object
  const selectedTplObj = useMemo(() => {
    if (!selectedTemplate) return null;
    if (typeof selectedTemplate === "object") return selectedTemplate;
    return (
      templates.find((t) => String(t.id) === String(selectedTemplate)) || null
    );
  }, [selectedTemplate, templates]);

  const defaultTplObj =
    defaultTemplate && typeof defaultTemplate === "object"
      ? defaultTemplate
      : templates.find((t) => String(t.id) === String(defaultTemplate)) || null;

  const displayName =
    selectedTplObj?.name ?? defaultTplObj?.name ?? "Select a template...";

  const handleTemplateSelect = (template) => {
    // console.log("Template selected:", template);
    // console.log("Current selectedTemplate before update:", selectedTemplate);

    setSelectedTemplate(template);
  };

  const handleSave = async () => {
    console.log("Saving default template:", selectedTplObj);
    try {
      if (selectedTplObj) {
        const payload = {
          vals: { is_default: true, id: selectedTplObj?.id },
        };
        const response = await updateTemplate({ payload });
        const result = response?.data?.result;
        if (result?.code === 200) {
          console.log("update template default result:", result);
          const updatedTemplate = result?.result;
          setDefaultTemplate(updatedTemplate);
          toast.success(
            `${updatedTemplate?.name} is set as default successfully.`
          );
        }
      }
    } catch (error) {
      console.error("Error while setting template default:", error);
      toast.error(
        `Something went wrong while setting ${selectedTplObj?.name} as default.`
      );
    } finally {
      setOpen(false);
    }
  };

  const TemplateSelect = () => (
    <select
      className="w-full p-2 rounded-md border border-blue-400 bg-white hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      value={selectedTplObj?.id || ""}
      onChange={(e) => {
        const selectedId = e.target.value;
        const template = templates.find((t) => String(t.id) === selectedId);
        if (template) {
          handleTemplateSelect(template);
        }
      }}
    >
      <option value="">Select a template...</option>
      {templates.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-blue-600 bg-white border-1 border-blue-600 hover:bg-white hover:text-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200">
          Choose Template
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Default Template</DialogTitle>
          <DialogDescription>
            Select a template from the list below and mark it as default.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <TemplateSelect />

          {defaultTplObj && (
            <p className="text-sm text-muted-foreground">
              Current default:{" "}
              <span className="font-medium text-blue-600">
                {defaultTplObj.name}
              </span>
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="text-blue-600 bg-white border-1 border-blue-600 rounded hover:bg-white hover:text-blue-600">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleSave}
            disabled={!selectedTplObj}
          >
            Set Default
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

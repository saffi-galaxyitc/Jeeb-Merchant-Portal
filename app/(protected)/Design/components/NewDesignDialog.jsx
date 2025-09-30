"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewDesignDialog({
  handleNewDesign,
  loadingCreate = false,
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Untitled Design");
  const [isDefault, setIsDefault] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      vals: {
        name: title,
        is_default: isDefault,
      },
    };

    await handleNewDesign({ payload });
    setOpen(false);
    setTitle("Untitled Design");
    setIsDefault(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        disabled={loadingCreate}
        className="bg-blue-600 text-white border-1 border-blue-600 hover:text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200 disabled:opacity-50"
      >
        New
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter design title"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(!!checked)}
              />
              <Label htmlFor="isDefault">Set as default</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                disabled={loadingCreate}
                className="text-blue-600 bg-white border-1 border-blue-600 hover:bg-white hover:text-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200 disabled:opacity-50"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={loadingCreate}
                className="bg-blue-600 text-white border-1 border-blue-600 hover:text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition duration-200 disabled:opacity-50"
                type="submit"
              >
                {loadingCreate ? "Creating" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

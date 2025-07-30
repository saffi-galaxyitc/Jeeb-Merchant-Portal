"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/app/components/ui/collapsible";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

import { Plus, ChevronDown, Trash2 } from "lucide-react";

export default function PageSections({
  pages,
  currentPageId,
  open,
  setOpen,
  newLabel,
  setNewLabel,
  handleAddItem,
  handleRemoveItem,
  handleRemoveSection,
  items,
}) {
  return (
    <div className="space-y-1 max-h-64 h-64 overflow-y-auto border-b border-gray-200">
      <div className="flex my-4 w-full items-start">
        <h3 className="text-sm font-semibold text-gray-500">Sections</h3>
      </div>
      {pages
        .find((page) => page.id === currentPageId)
        ?.components.map((component) => (
          <div key={component.id} className="mb-4">
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium bg-gray-100 hover:border-gray-100 hover:border-1">
                <span>{component.type || component.props.title}</span>
                <div className="flex items-center space-x-2">
                  {/* Dialog for adding item */}
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Plus
                        className="h-4 w-4 rounded bg-white text-gray-800 cursor-pointer hover:bg-gray-800 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddItem(component.id);
                        }}
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add new item</DialogTitle>
                      </DialogHeader>
                      <Input
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        placeholder="Enter item label"
                      />
                      <DialogFooter className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleAddItem}
                          disabled={!newLabel.trim()}
                        >
                          Add
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {/* <button
                    type="button"
                    onClick={() => handleRemoveSection(component.id)}
                    className="ml-auto text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button> */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSection(component.id);
                    }}
                    className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className=" space-y-1 bg-gray-100 rounded-md mt-2">
                <ul className="relative pt-4 pb-4 pl-6 pr-4 space-y-4">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-center relative pl-4">
                      <span className="absolute left-0 top-0 h-1/2 w-px bg-gray-700" />
                      <span className="absolute left-0 top-1/2 w-6 h-px bg-gray-700" />
                      <span className="text-gray-800 text-sm ml-4">{item}</span>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="ml-auto text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
    </div>
  );
}

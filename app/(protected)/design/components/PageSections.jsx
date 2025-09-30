"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/app/components/ui/collapsible";
import { getComponentByType } from "@/lib/utils";
import { ScaleLoader } from "react-spinners";

import { Plus, ChevronDown, Trash2 } from "lucide-react";
export default function PageSections({
  pages,
  currentPageId,
  // open,
  // setOpen,
  // newLabel,
  // setNewLabel,
  // handleAddItem,
  // handleRemoveItem,
  handleRemoveSection,
  selectedComponent,
  onSelectComponent,
  // items,
  isLoadingComponents,
}) {
  const handleComponentClick = (component, event) => {
    event.stopPropagation();
    onSelectComponent(component);
  };
  return (
    <div className="space-y-1 max-h-64 h-64 overflow-y-auto border-b border-gray-200">
      <div className="flex my-4 w-full items-start">
        <h3 className="text-sm font-semibold text-gray-500">Sections</h3>
      </div>
      {isLoadingComponents ? (
        <div className="flex flex-col items-center space-y-4 py-6">
          <ScaleLoader color="oklch(62.3% 0.214 259.815)" size={50} />
          <p className="text-sm font-medium">Loading components...</p>
        </div>
      ) : pages.find((page) => page.id === currentPageId)?.components
          ?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <p className="text-sm font-medium">No components found</p>
        </div>
      ) : (
        pages
          .find((page) => page.id === currentPageId)
          ?.components?.map((component) => (
            <div key={component.id} className="mb-4 px-1">
              <Collapsible>
                <CollapsibleTrigger
                  className={`flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium bg-gray-100 hover:border-gray-100 hover:border-1 ${
                    selectedComponent?.id === component.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                >
                  <span
                    className="cursor-pointer"
                    onClick={(e) => handleComponentClick(component, e)}
                  >
                    {getComponentByType(component.type)?.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSection(component.id, e);
                      }}
                      className="ml-auto text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className=" space-y-1 bg-gray-100 rounded-md mt-2 p-3">
                  {(() => {
                    const compInfo = getComponentByType(component.type);
                    return (
                      <div className="flex items-center justify-center space-x-3">
                        <img
                          src={compInfo?.icon}
                          alt={compInfo.name}
                          className="w-10 h-10 rounded-md shadow-sm border bg-white"
                        />
                        <div>
                          <p className="text-xs text-gray-600 mt-1">
                            {compInfo.description}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))
      )}
    </div>
  );
}

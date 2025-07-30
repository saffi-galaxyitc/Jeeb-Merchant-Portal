"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ComponentPalette from "./components/ComponentPalette";
import Canvas from "./components/Canvas";
import PropertyPanel from "./components/PropertyPanel";
import PreviewModal from "./components/PreviewModal";
import SaveLoadModal from "./components/SaveLoadModal";
import PageManager from "./components/PageManager";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { useJeebContext } from "@/app/context/JeebContext";

export default function MobileBuilderPage() {
  const {
    // State
    pages,
    currentPageId,
    selectedComponent,
    canvasScale,
    designName,
    showPreview,
    showSaveModal,
    showLoadModal,
    isSaving,
    hasUnsavedChanges,

    // Computed values
    currentPage,
    components,

    // State setters
    setDesignName,
    setShowPreview,
    setShowSaveModal,
    setShowLoadModal,

    // Page management
    handleAddPage,
    handleDeletePage,
    handleRenamePage,
    handleSwitchPage,
    handleDuplicatePage,

    // Component management
    handleDragEnd,
    handleAddComponent,
    handleSelectComponent,
    handleUpdateComponent,
    handleDeleteComponent,
    handleImageUpload,

    // Design management
    saveDesign,
    exportDesign,
    handleNewDesign,

    // Canvas scale
    increaseScale,
    decreaseScale,
  } = useJeebContext();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSaveDesign = (savedDesign) => {
    alert("Design saved successfully!");
  };

  const handleLoadDesign = (loadedDesign) => {
    if (loadedDesign.pages) {
      // Handle through context
    } else if (loadedDesign.components) {
      // Handle through context
    }
    alert("Design loaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Component Palette */}
        <div className="w-100 bg-white border-r border-gray-200 flex flex-col">
          <Tabs defaultValue="pageManager" className="w-[400px]">
            <TabsList className="w-84 mt-6 mx-auto p-2 flex-1 flex justify-center">
              <TabsTrigger
                value="pageManager"
                className="py-2 text-lg font-normal"
              >
                Pages
              </TabsTrigger>
              <TabsTrigger
                value="components"
                className="py-2 text-lg font-normal"
              >
                Section Type
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pageManager">
              {/* Page Manager */}
              <div className="flex-1 h-100 p-4">
                <PageManager
                  pages={pages}
                  currentPageId={currentPageId}
                  onAddPage={handleAddPage}
                  onDeletePage={handleDeletePage}
                  onRenamePage={handleRenamePage}
                  onSwitchPage={handleSwitchPage}
                  onDuplicatePage={handleDuplicatePage}
                />
              </div>
            </TabsContent>
            <TabsContent value="components">
              {/* Components */}
              <div className="flex-1 p-4 m-4">
                <div className="relative w-auto mb-4">
                  <Input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 border border-gray-400 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-100"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
                <ComponentPalette onAddComponent={handleAddComponent} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
              />
              <div className="flex items-center space-x-2 ml-8">
                <button
                  onClick={decreaseScale}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-sm font-medium">{canvasScale}%</span>
                <button
                  onClick={increaseScale}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Current Page Indicator */}
              {/* <div className="flex items-center space-x-2 ml-8 px-3 py-1 bg-blue-50 rounded-md">
                <span className="text-sm text-blue-600 font-medium">
                  {currentPage?.name || "Page"} • {components.length} components
                </span>
              </div> */}
            </div>

            <div className="flex items-center space-x-3">
              {/* <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Preview
              </button> */}
              <button
                onClick={saveDesign}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={exportDesign}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Export
              </button>
              {/* <button
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Save As
              </button> */}
              {/* <button
                onClick={() => setShowLoadModal(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Load
              </button> */}
              <button
                onClick={handleNewDesign}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                New
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-start justify-center p-8 bg-gray-50">
            <SortableContext
              items={components.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <Canvas
                components={components}
                selectedComponent={selectedComponent}
                onSelectComponent={handleSelectComponent}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
                onImageUpload={handleImageUpload}
                scale={canvasScale}
              />
            </SortableContext>
          </div>

          <SaveLoadModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={handleSaveDesign}
            currentDesign={{ pages }}
            mode="save"
          />

          <SaveLoadModal
            isOpen={showLoadModal}
            onClose={() => setShowLoadModal(false)}
            onLoad={handleLoadDesign}
            mode="load"
          />
        </div>

        {/* Property Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Properties</h2>
          <PropertyPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={handleUpdateComponent}
            onImageUpload={handleImageUpload}
          />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <PreviewModal
            pages={pages}
            currentPageId={currentPageId}
            onClose={() => setShowPreview(false)}
          />
        )}
      </DndContext>
    </div>
  );
}

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
import { Pencil, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useJeebContext } from "@/app/context/JeebContext";
import { useEffect, useMemo, useState } from "react";
import { TemplateDialog } from "./components/TemplateDialog";
import NewDesignDialog from "./components/NewDesignDialog";

export default function MobileBuilderPage() {
  const {
    // State
    pages,
    currentPageId,
    selectedComponent,
    canvasScale,
    setCanvasScale,
    designName,
    showPreview,
    // showSaveModal,
    // showLoadModal,
    // isSaving,
    // hasUnsavedChanges,
    //template dialog
    templates,
    selectedTemplate,
    setSelectedTemplate,
    defaultTemplate,
    setDefaultTemplate,
    //loaders for mobile view
    isLoadingTemplates,
    isLoadingPages,
    isLoadingComponents,

    // Computed values
    // currentPage,
    components,

    // State setters
    setDesignName,
    setShowPreview,
    // setShowSaveModal,
    // setShowLoadModal,

    // Page management
    isSheetOpen,
    setIsSheetOpen,
    editingPage,
    handleAddPage,
    handleEditPage,
    handleSavePage,

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
    handleRemoveImage,
    processImage,
    onRemoveItem,
    processItem,
    processVideo,
    processVideoUpdate,
    itemNavigationUpdate,

    // Design management
    // saveDesign,
    // exportDesign,
    handleNewDesign,
    handleSaveTitle,
    isEditingTitle,
    setIsEditingTitle,
    loadingTitle,
    loadingCreate,

    // Canvas scale
    increaseScale,
    decreaseScale,
    //navigation
    goBack,
  } = useJeebContext();
  const [openPalette, setOpenPalette] = useState(true);
  const [openProps, setOpenProps] = useState(true);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // When width decreases to 1370px or below
      if (width <= 1370) {
        setOpenPalette(false);
        setOpenProps(false);
      } else {
        // Reset to true when width is above 1370px
        setOpenPalette(true);
        setOpenProps(true);
      }

      // When width reaches 768px or below (tablet/mobile breakpoint)
      if (width < 768) {
        // calculate scale in steps of 10
        // e.g. width 760 → 70, width 700 → 60, etc.
        const step = Math.floor((768 - width) / 100) + 1;
        const newScale = Math.max(60, 80 - step * 10); // never below 10
        setCanvasScale(newScale);
      } else {
        setCanvasScale(80); // reset to default when back on bigger screens
      }
    };

    // Set initial state based on current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const currentPage = useMemo(() => {
    return pages.find((page) => page.id === currentPageId) || null;
  }, [pages, currentPageId]);

  return (
    <div className="h-screen bg-gray-100 flex">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Component Palette */}
        <div
          className={`${
            openPalette ? "w-100" : "w-0"
          } bg-white border-r border-gray-200 flex flex-col overflow-y-scroll transition-all duration-300 ease-in-out`}
        >
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
                  isSheetOpen={isSheetOpen}
                  setIsSheetOpen={setIsSheetOpen}
                  editingPage={editingPage}
                  handleAddPage={handleAddPage}
                  handleEditPage={handleEditPage}
                  handleSavePage={handleSavePage}
                  selectedTemplate={selectedTemplate}
                  onDeletePage={handleDeletePage}
                  onRenamePage={handleRenamePage}
                  onSwitchPage={handleSwitchPage}
                  onDuplicatePage={handleDuplicatePage}
                  selectedComponent={selectedComponent}
                  onSelectComponent={handleSelectComponent}
                  onUpdateComponent={handleUpdateComponent}
                  onDeleteComponent={handleDeleteComponent}
                  isLoadingPages={isLoadingPages}
                  isLoadingComponents={isLoadingComponents}
                />
              </div>
            </TabsContent>
            <TabsContent value="components">
              {/* Components */}
              <div className="flex-1 p-4 m-4">
                <ComponentPalette onAddComponent={handleAddComponent} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-y-scroll">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setOpenPalette(!openPalette)}
              className="p-2 bg-gray-100 border border-gray-300 rounded-r-lg hover:bg-gray-200 transition"
            >
              {openPalette ? (
                <ChevronLeft size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
            <button
              onClick={() => setOpenProps(!openProps)}
              className="p-2 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 transition"
            >
              {openProps ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
          <div className="bg-white border-b border-gray-200 p-4 flex flex-wrap items-center sm:justify-between justify-start">
            <div className="flex items-center gap-2 w-auto">
              {isEditingTitle ? (
                <>
                  <input
                    type="text"
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    className="text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
                    autoFocus
                  />
                  <button
                    disabled={loadingTitle}
                    onClick={handleSaveTitle}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    disabled={loadingTitle}
                    onClick={() => {
                      setDesignName(selectedTemplate?.name);
                      setIsEditingTitle(false);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold">{designName}</span>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={16} />
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mx-2 w-auto mt-2 sm:mt-0">
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
            <div className="flex items-center gap-2 w-auto mt-2 sm:mt-0">
              <TemplateDialog
                templates={templates}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                defaultTemplate={defaultTemplate}
                setDefaultTemplate={setDefaultTemplate}
              />
              <NewDesignDialog
                loadingCreate={loadingCreate}
                handleNewDesign={handleNewDesign}
              />
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
                scale={canvasScale}
                isLoadingTemplates={isLoadingTemplates}
                isLoadingPages={isLoadingPages}
                isLoadingComponents={isLoadingComponents}
                currentPage={currentPage}
                goBack={goBack}
              />
            </SortableContext>
          </div>
        </div>

        {/* Property Panel */}
        <div
          className={`${
            openProps ? "w-100 p-4" : "w-0 p-0"
          } bg-white border-l border-gray-200 overflow-y-scroll transition-all duration-300 ease-in-out`}
        >
          <h2 className="bg-muted h-16 items-center rounded-lg w-84 mt-2 text-lg mx-auto p-2 flex-1 flex justify-center">
            Properties
          </h2>
          <PropertyPanel
            selectedComponent={selectedComponent}
            onUpdateComponent={handleUpdateComponent}
            onImageUpload={handleImageUpload}
            onImageRemove={handleRemoveImage}
            processImage={processImage}
            onRemoveItem={onRemoveItem}
            processItem={processItem}
            processVideo={processVideo}
            processVideoUpdate={processVideoUpdate}
            itemNavigationUpdate={itemNavigationUpdate}
          />
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <PreviewModal
            pages={pages}
            currentPageId={currentPageId}
            onClose={() => setShowPreview(false)}
            components={components}
            scale={canvasScale}
            isLoadingTemplates={isLoadingTemplates}
            isLoadingPages={isLoadingPages}
            isLoadingComponents={isLoadingComponents}
            increaseScale={increaseScale}
            decreaseScale={decreaseScale}
            currentPage={currentPage}
          />
        )}
      </DndContext>
    </div>
  );
}

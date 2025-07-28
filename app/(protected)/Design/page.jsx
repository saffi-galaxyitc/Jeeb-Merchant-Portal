"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MobileBuilderPage() {
  // Page management state
  const [pages, setPages] = useState([
    {
      id: "page-1",
      name: "Home",
      components: [],
      isActive: true,
    },
  ]);
  const [currentPageId, setCurrentPageId] = useState("page-1");

  // Existing state
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [canvasScale, setCanvasScale] = useState(80);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [currentDesign, setCurrentDesign] = useState(null);
  const [designName, setDesignName] = useState("Untitled Design");
  const [isSaving, setIsSaving] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [currentDesignName, setCurrentDesignName] = useState("Untitled Design");
  const [currentDesignId, setCurrentDesignId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadedImages, setUploadedImages] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get current page and its components
  const currentPage = pages.find((page) => page.id === currentPageId);
  const components = currentPage?.components || [];

  // Page management functions
  const handleAddPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPage = {
      id: newPageId,
      name: `Page ${pages.length + 1}`,
      components: [],
      isActive: true,
    };
    setPages([...pages, newPage]);
    setCurrentPageId(newPageId);
    setSelectedComponent(null);
    setHasUnsavedChanges(true);
  };

  const handleDeletePage = (pageId) => {
    if (pages.length <= 1) {
      alert("Cannot delete the last page");
      return;
    }

    if (confirm("Are you sure you want to delete this page?")) {
      const updatedPages = pages.filter((page) => page.id !== pageId);
      setPages(updatedPages);

      // If deleted page was current, switch to first page
      if (currentPageId === pageId) {
        setCurrentPageId(updatedPages[0].id);
      }
      setSelectedComponent(null);
      setHasUnsavedChanges(true);
    }
  };

  const handleRenamePage = (pageId, newName) => {
    setPages(
      pages.map((page) =>
        page.id === pageId ? { ...page, name: newName } : page
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSwitchPage = (pageId) => {
    setCurrentPageId(pageId);
    setSelectedComponent(null);
  };

  const handleDuplicatePage = (pageId) => {
    const pageToClone = pages.find((page) => page.id === pageId);
    if (pageToClone) {
      const newPageId = `page-${Date.now()}`;
      const duplicatedPage = {
        ...pageToClone,
        id: newPageId,
        name: `${pageToClone.name} Copy`,
        components: pageToClone.components.map((comp) => ({
          ...comp,
          id: `${comp.type}-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        })),
      };
      setPages([...pages, duplicatedPage]);
      setCurrentPageId(newPageId);
      setHasUnsavedChanges(true);
    }
  };

  // Update components for current page
  const updateCurrentPageComponents = (newComponents) => {
    setPages(
      pages.map((page) =>
        page.id === currentPageId
          ? { ...page, components: newComponents }
          : page
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = components.findIndex((item) => item.id === active.id);
      const newIndex = components.findIndex((item) => item.id === over?.id);
      const newComponents = arrayMove(components, oldIndex, newIndex);
      updateCurrentPageComponents(newComponents);
    }
  };

  const handleAddComponent = (componentType) => {
    const newComponent = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      position: { x: 0, y: components.length * 100 },
      props: getDefaultProps(componentType),
    };
    updateCurrentPageComponents([...components, newComponent]);
  };

  const handleSelectComponent = (component) => {
    setSelectedComponent(component);
  };

  const handleUpdateComponent = (updatedComponent) => {
    const newComponents = components.map((comp) =>
      comp.id === updatedComponent.id ? updatedComponent : comp
    );
    updateCurrentPageComponents(newComponents);
    setSelectedComponent(updatedComponent);
  };

  const handleDeleteComponent = (componentId) => {
    const newComponents = components.filter((comp) => comp.id !== componentId);
    updateCurrentPageComponents(newComponents);
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };
  const handleImageUpload = (componentId, file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setUploadedImages((prev) => ({
          ...prev,
          [componentId]: imageUrl,
        }));

        // Update component with image
        const updatedComponent = components.find(
          (comp) => comp.id === componentId
        );
        if (updatedComponent) {
          if (updatedComponent.type === "banner") {
            // For banner, append image to images array
            handleUpdateComponent({
              ...updatedComponent,
              props: {
                ...updatedComponent.props,
                images: [...(updatedComponent.props.images || []), imageUrl],
              },
            });
          } else {
            // For other components (e.g., imageBlock)
            handleUpdateComponent({
              ...updatedComponent,
              props: {
                ...updatedComponent.props,
                image: imageUrl,
              },
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getDefaultProps = (type) => {
    switch (type) {
      case "banner":
        return {
          images: [],
          autoPlay: true,
          interval: 3000,
        };
      case "imageRow":
        return {
          items: Array(8).fill({
            image: "/Images/sampleImg.png",
            text: "Item Text",
          }),
        };
      case "subHeaderGrid":
        return {
          items: Array(8).fill({
            image: "/Images/sampleImg.png",
            text: "Item Text",
          }),
        };
      case "videoText":
        return {
          video_url:
            "https://videocdn.cdnpk.net/videos/a578ce73-6c51-4ad5-88c1-6f5836831b99/horizontal/previews/clear/large.mp4?token=exp=1753171926~hmac=3913b3cd8a57017ed149d1677154989cb894b3a2b36f7996ada5bacc5aa66449",
          title: "Title Text",
          button_text: "Button Text",
        };
      case "imageText":
        return {
          image: "",
          title: "Title Text",
          button_text: "Button Text",
        };
      case "bodyHalf":
        return {
          images: [],
        };
      case "subBodyGrid":
        return {
          items: Array(3).fill({
            image: "/Images/sampleImg.png",
            text: "Item Text",
          }),
        };
      case "bodyPlain":
        return {
          images: [],
          autoPlay: true,
          interval: 3000,
        };
      case "bodyRound":
        return {
          images: [],
          autoPlay: true,
          interval: 3000,
        };
      case "brands":
        return {
          images: [],
          bg_image: "",
          title: "",
        };
      case "subCategBrands":
        return {
          images: [],
          title: "",
        };
      case "productsGrid":
        return {
          products: [],
          gridTitle: "",
        };
      default:
        return {};
    }
  };

  const saveDesign = async () => {
    setIsSaving(true);
    const designData = {
      name: designName,
      pages: pages, // Save all pages instead of just components
      metadata: {
        created: new Date().toISOString(),
        version: "2.0", // Updated version for multi-page support
        pagesCount: pages.length,
        totalComponents: pages.reduce(
          (total, page) => total + page.components.length,
          0
        ),
      },
    };

    // try {
    //   const response = await fetch("/api/designs", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(designData),
    //   });

    // if (response.ok) {
    //   const savedDesign = await response.json();
    //   setSavedDesigns([...savedDesigns, savedDesign]);
    setSavedDesigns([...savedDesigns, designData]);
    setHasUnsavedChanges(false);
    alert("Design saved successfully!");
    console.log("saved designs", savedDesigns);
    // } else {
    //   alert("Failed to save design");
    // }
    // } catch (error) {
    //   console.error("Error saving design:", error);
    //   alert("Error saving design");
    // } finally {
    setIsSaving(false);
    // }
  };

  const loadDesign = async (designId) => {
    try {
      const response = await fetch(`/api/designs/${designId}`);
      if (response.ok) {
        const design = await response.json();

        // Handle both old (single page) and new (multi-page) designs
        if (design.pages) {
          setPages(design.pages);
          setCurrentPageId(design.pages[0]?.id || "page-1");
        } else if (design.components) {
          // Convert old single-page design to multi-page format
          setPages([
            {
              id: "page-1",
              name: "Home",
              components: design.components,
              isActive: true,
            },
          ]);
          setCurrentPageId("page-1");
        }

        setDesignName(design.name);
        setSelectedComponent(null);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Error loading design:", error);
    }
  };

  const exportDesign = () => {
    const designData = {
      name: designName,
      pages: pages,
      metadata: {
        created: new Date().toISOString(),
        version: "2.0",
        pagesCount: pages.length,
        totalComponents: pages.reduce(
          (total, page) => total + page.components.length,
          0
        ),
      },
    };

    const dataStr = JSON.stringify(designData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${designName.replace(/\s+/g, "_")}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleSaveDesign = (savedDesign) => {
    setCurrentDesignName(savedDesign.name);
    setCurrentDesignId(savedDesign.id);
    setHasUnsavedChanges(false);
    alert("Design saved successfully!");
  };

  const handleLoadDesign = (loadedDesign) => {
    if (loadedDesign.pages) {
      setPages(loadedDesign.pages);
      setCurrentPageId(loadedDesign.pages[0]?.id || "page-1");
    } else if (loadedDesign.components) {
      // Convert old format
      setPages([
        {
          id: "page-1",
          name: "Home",
          components: loadedDesign.components,
          isActive: true,
        },
      ]);
      setCurrentPageId("page-1");
    }

    setCurrentDesignName(loadedDesign.name);
    setCurrentDesignId(loadedDesign.id);
    setSelectedComponent(null);
    setHasUnsavedChanges(false);
    alert("Design loaded successfully!");
  };

  const handleNewDesign = () => {
    if (
      hasUnsavedChanges &&
      !confirm(
        "You have unsaved changes. Are you sure you want to create a new design?"
      )
    ) {
      return;
    }

    setPages([
      {
        id: "page-1",
        name: "Home",
        components: [],
        isActive: true,
      },
    ]);
    setCurrentPageId("page-1");
    setSelectedComponent(null);
    setCurrentDesignName("Untitled Design");
    setCurrentDesignId(null);
    setHasUnsavedChanges(false);
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
                  onClick={() => setCanvasScale(Math.max(50, canvasScale - 10))}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-sm font-medium">{canvasScale}%</span>
                <button
                  onClick={() =>
                    setCanvasScale(Math.min(150, canvasScale + 10))
                  }
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Current Page Indicator */}
              <div className="flex items-center space-x-2 ml-8 px-3 py-1 bg-blue-50 rounded-md">
                <span className="text-sm text-blue-600 font-medium">
                  {currentPage?.name || "Page"} • {components.length} components
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Preview
              </button>
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
            pages={pages} // Pass all pages instead of just components
            currentPageId={currentPageId}
            onClose={() => setShowPreview(false)}
          />
        )}
      </DndContext>
    </div>
  );
}

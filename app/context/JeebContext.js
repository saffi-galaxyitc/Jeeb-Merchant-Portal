"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { SplinePointer, LayoutDashboard, Settings } from "lucide-react";

const JeebContext = createContext();

const STORAGE_KEYS = {
  PAGES: "jeeb_pages",
  CURRENT_PAGE_ID: "jeeb_current_page_id",
  DESIGN_NAME: "jeeb_design_name",
  SAVED_DESIGNS: "jeeb_saved_designs",
  CANVAS_SCALE: "jeeb_canvas_scale",
  SELECTED_COMPONENT: "jeeb_selected_component",
};
const navItems = [
  { href: "/design", icon: SplinePointer, label: "Design" },
  { href: "/products", icon: LayoutDashboard, label: "Products" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

// Default props for different component types
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

// Helper functions for localStorage
const loadFromStorage = (key, defaultValue) => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export function JeebContextProvider({ children }) {
  //paymentModal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);
  // Core state
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState("page-1");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [canvasScale, setCanvasScale] = useState(80);
  const [designName, setDesignName] = useState("Untitled Design");
  const [savedDesigns, setSavedDesigns] = useState([]);

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize state from localStorage
  useEffect(() => {
    const storedPages = loadFromStorage(STORAGE_KEYS.PAGES, [
      {
        id: "page-1",
        name: "Home",
        components: [],
        isActive: true,
      },
    ]);
    const storedCurrentPageId = loadFromStorage(
      STORAGE_KEYS.CURRENT_PAGE_ID,
      "page-1"
    );
    const storedDesignName = loadFromStorage(
      STORAGE_KEYS.DESIGN_NAME,
      "Untitled Design"
    );
    const storedSavedDesigns = loadFromStorage(STORAGE_KEYS.SAVED_DESIGNS, []);
    const storedCanvasScale = loadFromStorage(STORAGE_KEYS.CANVAS_SCALE, 80);

    setPages(storedPages);
    setCurrentPageId(storedCurrentPageId);
    setDesignName(storedDesignName);
    setSavedDesigns(storedSavedDesigns);
    setCanvasScale(storedCanvasScale);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PAGES, pages);
  }, [pages]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_PAGE_ID, currentPageId);
  }, [currentPageId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DESIGN_NAME, designName);
  }, [designName]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SAVED_DESIGNS, savedDesigns);
  }, [savedDesigns]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CANVAS_SCALE, canvasScale);
  }, [canvasScale]);

  // Computed values
  const currentPage = pages.find((page) => page.id === currentPageId);
  const components = currentPage?.components || [];

  // Page management functions
  const handleAddPage = useCallback(() => {
    const newPageId = `page-${Date.now()}`;
    const newPage = {
      id: newPageId,
      name: `Page ${pages.length + 1}`,
      components: [],
      isActive: true,
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageId(newPageId);
    setSelectedComponent(null);
    setHasUnsavedChanges(true);
  }, [pages.length]);

  const handleDeletePage = useCallback(
    (pageId) => {
      if (pages.length <= 1) {
        alert("Cannot delete the last page");
        return;
      }

      if (confirm("Are you sure you want to delete this page?")) {
        const updatedPages = pages.filter((page) => page.id !== pageId);
        setPages(updatedPages);

        if (currentPageId === pageId) {
          setCurrentPageId(updatedPages[0].id);
        }
        setSelectedComponent(null);
        setHasUnsavedChanges(true);
      }
    },
    [pages, currentPageId]
  );

  const handleRenamePage = useCallback((pageId, newName) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, name: newName } : page
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleSwitchPage = useCallback((pageId) => {
    setCurrentPageId(pageId);
    setSelectedComponent(null);
  }, []);

  const handleDuplicatePage = useCallback(
    (pageId) => {
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
        setPages((prev) => [...prev, duplicatedPage]);
        setCurrentPageId(newPageId);
        setHasUnsavedChanges(true);
      }
    },
    [pages]
  );

  // Component management functions
  const updateCurrentPageComponents = useCallback(
    (newComponents) => {
      setPages((prev) =>
        prev.map((page) =>
          page.id === currentPageId
            ? { ...page, components: newComponents }
            : page
        )
      );
      setHasUnsavedChanges(true);
    },
    [currentPageId]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = components.findIndex((item) => item.id === active.id);
        const newIndex = components.findIndex((item) => item.id === over?.id);
        const newComponents = arrayMove(components, oldIndex, newIndex);
        updateCurrentPageComponents(newComponents);
      }
    },
    [components, updateCurrentPageComponents]
  );

  const handleAddComponent = useCallback(
    (componentType) => {
      const newComponent = {
        id: `${componentType}-${Date.now()}`,
        type: componentType,
        position: { x: 0, y: components.length * 100 },
        props: getDefaultProps(componentType),
      };
      updateCurrentPageComponents([...components, newComponent]);
    },
    [components, updateCurrentPageComponents]
  );

  const handleSelectComponent = useCallback((component) => {
    setSelectedComponent(component);
  }, []);

  const handleUpdateComponent = useCallback(
    (updatedComponent) => {
      const newComponents = components.map((comp) =>
        comp.id === updatedComponent.id ? updatedComponent : comp
      );
      updateCurrentPageComponents(newComponents);
      setSelectedComponent(updatedComponent);
    },
    [components, updateCurrentPageComponents]
  );

  const handleDeleteComponent = useCallback(
    (componentId) => {
      const newComponents = components.filter(
        (comp) => comp.id !== componentId
      );
      updateCurrentPageComponents(newComponents);
      if (selectedComponent?.id === componentId) {
        setSelectedComponent(null);
      }
    },
    [components, updateCurrentPageComponents, selectedComponent]
  );

  const handleImageUpload = useCallback(
    (componentId, file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;

          const updatedComponent = components.find(
            (comp) => comp.id === componentId
          );
          if (updatedComponent) {
            if (updatedComponent.type === "banner") {
              handleUpdateComponent({
                ...updatedComponent,
                props: {
                  ...updatedComponent.props,
                  images: [...(updatedComponent.props.images || []), imageUrl],
                },
              });
            } else {
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
    },
    [components, handleUpdateComponent]
  );

  // Design management functions
  const saveDesign = useCallback(async () => {
    setIsSaving(true);
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

    setSavedDesigns((prev) => [...prev, designData]);
    setHasUnsavedChanges(false);
    setIsSaving(false);
    alert("Design saved successfully!");
  }, [designName, pages]);

  const loadDesign = useCallback(async (designId) => {
    try {
      const response = await fetch(`/api/designs/${designId}`);
      if (response.ok) {
        const design = await response.json();

        if (design.pages) {
          setPages(design.pages);
          setCurrentPageId(design.pages[0]?.id || "page-1");
        } else if (design.components) {
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
  }, []);

  const exportDesign = useCallback(() => {
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
  }, [designName, pages]);

  const handleNewDesign = useCallback(() => {
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
    setDesignName("Untitled Design");
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  // Canvas scale functions
  const increaseScale = useCallback(() => {
    setCanvasScale((prev) => Math.min(150, prev + 10));
  }, []);

  const decreaseScale = useCallback(() => {
    setCanvasScale((prev) => Math.max(50, prev - 10));
  }, []);

  const contextValue = {
    // State
    pages,
    currentPageId,
    selectedComponent,
    canvasScale,
    designName,
    savedDesigns,
    showPreview,
    showSaveModal,
    showLoadModal,
    isSaving,
    hasUnsavedChanges,
    //navItems
    navItems,

    // Computed values
    currentPage,
    components,

    // State setters
    setPages,
    setCurrentPageId,
    setSelectedComponent,
    setCanvasScale,
    setDesignName,
    setSavedDesigns,
    setShowPreview,
    setShowSaveModal,
    setShowLoadModal,
    setIsSaving,
    setHasUnsavedChanges,

    // Page management
    handleAddPage,
    handleDeletePage,
    handleRenamePage,
    handleSwitchPage,
    handleDuplicatePage,

    // Component management
    updateCurrentPageComponents,
    handleDragEnd,
    handleAddComponent,
    handleSelectComponent,
    handleUpdateComponent,
    handleDeleteComponent,
    handleImageUpload,

    // Design management
    saveDesign,
    loadDesign,
    exportDesign,
    handleNewDesign,

    // Canvas scale
    increaseScale,
    decreaseScale,

    // Utility
    getDefaultProps,
    //paymentModal
    isPaymentModalOpen,
    openPaymentModal,
    closePaymentModal,
  };

  return (
    <JeebContext.Provider value={contextValue}>{children}</JeebContext.Provider>
  );
}

export function useJeebContext() {
  const context = useContext(JeebContext);
  if (!context) {
    throw new Error("useJeebContext must be used within a JeebContextProvider");
  }
  return context;
}

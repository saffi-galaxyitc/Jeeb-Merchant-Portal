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

// Default props for different component types (enhanced with navigation)
const getDefaultProps = (type) => {
  switch (type) {
    case "banner":
      return {
        images: [],
        autoPlay: true,
        interval: 3000,
        // Each image can have navigation
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean}
      };
    case "imageRow":
      return {
        items: Array(8).fill({
          image: "/Images/sampleImg.png",
          text: "Item Text",
          navigation: {
            enabled: false,
            targetPageId: null,
          },
        }),
      };
    case "subHeaderGrid":
      return {
        items: Array(8).fill({
          image: "/Images/sampleImg.png",
          text: "Item Text",
          navigation: {
            enabled: false,
            targetPageId: null,
          },
        }),
      };
    case "videoText":
      return {
        video_url: "",
        title: "Title Text",
        title_color: "#000000",
        button_text: "Button Text",
        button_color: "#ffffff",
        navigation: {
          enabled: false,
          targetPageId: null,
        },
      };
    case "imageText":
      return {
        image: "",
        title: "Title Text",
        title_color: "#000000",
        button_text: "Button Text",
        button_color: "#ffffff",
        navigation: {
          enabled: false,
          targetPageId: null,
        },
      };
    case "bodyHalf":
      return {
        images: [],
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean}
      };
    case "subBodyGrid":
      return {
        items: Array(3).fill({
          image: "/Images/sampleImg.png",
          text: "Item Text",
          navigation: {
            enabled: false,
            targetPageId: null,
          },
        }),
      };
    case "bodyPlain":
      return {
        images: [],
        autoPlay: true,
        interval: 3000,
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean}
      };
    case "bodyRound":
      return {
        images: [],
        autoPlay: true,
        interval: 3000,
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean}
      };
    case "brands":
      return {
        images: [],
        bg_image: "",
        title: "Title Text",
        title_color: "#000000",
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean}
      };
    case "subCategBrands":
      return {
        images: [],
        title: "Title Text",
        title_color: "#000000",
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean}
      };
    case "productsGrid":
      return {
        products: [],
        gridTitle: "",
        productNavigation: [], // Array of {productIndex: number, targetPageId: string, enabled: boolean}
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

  // Navigation state
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [allowEditModeNavigation, setAllowEditModeNavigation] = useState(false);

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

  // Navigation functions
  const navigateToPage = useCallback(
    (targetPageId, addToHistory = true) => {
      const targetPage = pages.find((page) => page.id === targetPageId);
      if (!targetPage) {
        console.warn(`Page with id "${targetPageId}" not found`);
        return false;
      }

      if (addToHistory && currentPageId !== targetPageId) {
        setNavigationHistory((prev) => [...prev, currentPageId]);
        setCanGoBack(true);
      }

      setCurrentPageId(targetPageId);
      setSelectedComponent(null);
      return true;
    },
    [pages, currentPageId]
  );

  const goBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const previousPageId = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      setCanGoBack(navigationHistory.length > 1);
      setCurrentPageId(previousPageId);
      setSelectedComponent(null);
    }
  }, [navigationHistory]);

  const clearNavigationHistory = useCallback(() => {
    setNavigationHistory([]);
    setCanGoBack(false);
  }, []);

  // Handle component click navigation
  const handleComponentClick = useCallback(
    (componentId, clickData) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const { type, index, targetPageId } = clickData;

      switch (type) {
        case "image":
          // Handle image clicks for banner, bodyPlain, bodyRound, etc.
          const imageNav = component.props.imageNavigation?.find(
            (nav) => nav.imageIndex === index && nav.enabled
          );
          if (imageNav && imageNav.targetPageId) {
            navigateToPage(imageNav.targetPageId);
          }
          break;

        case "item":
          // Handle item clicks for imageRow, subHeaderGrid, subBodyGrid
          const item = component.props.items?.[index];
          if (item?.navigation?.enabled && item.navigation.targetPageId) {
            navigateToPage(item.navigation.targetPageId);
          }
          break;

        case "product":
          // Handle product clicks for productsGrid
          const productNav = component.props.productNavigation?.find(
            (nav) => nav.productIndex === index && nav.enabled
          );
          if (productNav && productNav.targetPageId) {
            navigateToPage(productNav.targetPageId);
          }
          break;

        case "component":
          // Handle direct component clicks (videoText, imageText)
          if (
            component.props.navigation?.enabled &&
            component.props.navigation.targetPageId
          ) {
            navigateToPage(component.props.navigation.targetPageId);
          }
          break;

        default:
          console.warn("Unknown click type:", type);
      }
    },
    [components, navigateToPage]
  );

  // Enhanced component update functions
  const updateImageNavigation = useCallback(
    (componentId, imageIndex, targetPageId, enabled = true) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const currentNav = component.props.imageNavigation || [];
      const existingNavIndex = currentNav.findIndex(
        (nav) => nav.imageIndex === imageIndex
      );

      let updatedNav;
      if (existingNavIndex >= 0) {
        updatedNav = [...currentNav];
        updatedNav[existingNavIndex] = { imageIndex, targetPageId, enabled };
      } else {
        updatedNav = [...currentNav, { imageIndex, targetPageId, enabled }];
      }

      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          imageNavigation: updatedNav,
        },
      };

      handleUpdateComponent(updatedComponent);
    },
    [components]
  );

  const updateItemNavigation = useCallback(
    (componentId, itemIndex, targetPageId, enabled = true) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const updatedItems = component.props.items.map((item, index) => {
        if (index === itemIndex) {
          return {
            ...item,
            navigation: {
              enabled,
              targetPageId,
            },
          };
        }
        return item;
      });

      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          items: updatedItems,
        },
      };

      handleUpdateComponent(updatedComponent);
    },
    [components]
  );

  const updateProductNavigation = useCallback(
    (componentId, productIndex, targetPageId, enabled = true) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const currentNav = component.props.productNavigation || [];
      const existingNavIndex = currentNav.findIndex(
        (nav) => nav.productIndex === productIndex
      );

      let updatedNav;
      if (existingNavIndex >= 0) {
        updatedNav = [...currentNav];
        updatedNav[existingNavIndex] = { productIndex, targetPageId, enabled };
      } else {
        updatedNav = [...currentNav, { productIndex, targetPageId, enabled }];
      }

      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          productNavigation: updatedNav,
        },
      };

      handleUpdateComponent(updatedComponent);
    },
    [components]
  );

  const updateComponentNavigation = useCallback(
    (componentId, targetPageId, enabled = true) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          navigation: {
            enabled,
            targetPageId,
          },
        },
      };

      handleUpdateComponent(updatedComponent);
    },
    [components]
  );

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

        // Clear navigation history if current page is deleted
        clearNavigationHistory();
      }
    },
    [pages, currentPageId, clearNavigationHistory]
  );

  const handleRenamePage = useCallback((pageId, newName) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, name: newName } : page
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const handleSwitchPage = useCallback(
    (pageId) => {
      navigateToPage(pageId, false); // Don't add to history for manual switches
    },
    [navigateToPage]
  );

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
      console.log(
        "newComponent in updateCurrentPageComponents",
        newComponents,
        pages,
        currentPageId
      );
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
      console.log("newComponent", newComponent, components);
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
        version: "2.1", // Updated version for navigation feature
        pagesCount: pages.length,
        totalComponents: pages.reduce(
          (total, page) => total + page.components.length,
          0
        ),
        hasNavigation: pages.some((page) =>
          page.components.some(
            (comp) =>
              comp.props.navigation?.enabled ||
              comp.props.imageNavigation?.some((nav) => nav.enabled) ||
              comp.props.productNavigation?.some((nav) => nav.enabled) ||
              comp.props.items?.some((item) => item.navigation?.enabled)
          )
        ),
      },
    };

    setSavedDesigns((prev) => [...prev, designData]);
    setHasUnsavedChanges(false);
    setIsSaving(false);
    alert("Design saved successfully!");
  }, [designName, pages]);

  const loadDesign = useCallback(
    async (designId) => {
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
          clearNavigationHistory();
        }
      } catch (error) {
        console.error("Error loading design:", error);
      }
    },
    [clearNavigationHistory]
  );

  const exportDesign = useCallback(() => {
    const designData = {
      name: designName,
      pages: pages,
      metadata: {
        created: new Date().toISOString(),
        version: "2.1",
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
    clearNavigationHistory();
  }, [hasUnsavedChanges, clearNavigationHistory]);

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
    navigationHistory,
    canGoBack,
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
    //allowEditModeNavigation
    allowEditModeNavigation,
    setAllowEditModeNavigation,
    // Navigation functions
    navigateToPage,
    goBack,
    clearNavigationHistory,
    handleComponentClick,

    // Navigation update functions
    updateImageNavigation,
    updateItemNavigation,
    updateProductNavigation,
    updateComponentNavigation,

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

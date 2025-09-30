"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";
import {
  SplinePointer,
  LayoutDashboard,
  Settings,
  Settings2,
} from "lucide-react";
import {
  addComponent,
  createComponentItem,
  createPage,
  createTemplate,
  deleteComponent,
  deleteComponentItem,
  deletePage,
  getPage,
  getPages,
  getProductsComponentItem,
  getTemplates,
  updateComponentGeneral,
  updateComponentItem,
  updatePage,
  updateTemplate,
} from "@/DAL/design";
import { toast } from "react-toastify";

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
  { href: "/imageToolkit", icon: Settings2, label: "Image Toolkit" },
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
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean, navigation: boolean}
      };
    case "imageRow":
      return {
        items: Array(8).fill({
          image: "/Images/sampleImg.png",
          text: "Item Text",
          navigation: {
            enabled: false,
            navigation: null,
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
            navigation: null,
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
          navigation: null,
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
          navigation: null,
          targetPageId: null,
        },
      };
    case "bodyHalf":
      return {
        images: [],
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean, navigation: boolean}
      };
    case "subBodyGrid":
      return {
        items: Array(3).fill({
          image: "/Images/sampleImg.png",
          text: "Item Text",
          navigation: {
            enabled: false,
            navigation: null,
            targetPageId: null,
          },
        }),
      };
    case "bodyPlain":
      return {
        images: [],
        autoPlay: true,
        interval: 3000,
        imageNavigation: [], // Array of {imageIndex: number, targetPageId: string, enabled: boolean, navigation: boolean}
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
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [canvasScale, setCanvasScale] = useState(80);
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [defaultTemplate, setDefaultTemplate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [designName, setDesignName] = useState("");
  const [savedDesigns, setSavedDesigns] = useState([]);
  // Loading states to manage API flow
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [pagesLoaded, setPagesLoaded] = useState(false);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  //Page management
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  // Navigation state
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [allowEditModeNavigation, setAllowEditModeNavigation] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const isPublicUrl = (str) => /^https?:\/\//i.test(str);
  const [genericProducts, setGenericProducts] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState(false);
  //get generic page products here:
  const fetchProducts = async (itemId) => {
    try {
      setLoadingProducts(true);
      const payload = { item_id: itemId };
      const response = await getProductsComponentItem({ payload });
      const result = response?.data?.result;

      if (result?.code === 200) {
        const apiData = result?.result;
        setGenericProducts(apiData); // ✅ overwrite old state
        setPages((prevPages) =>
          prevPages.map((page) => {
            if (page.type === "AllProducts") {
              return {
                ...page,
                components: [
                  ...(page.components || []).filter(
                    (c) => c.type !== "productsList"
                  ),
                  {
                    id: Math.floor(1000 + Math.random() * 9000), // ✅ random 4-digit id
                    type: "productsList",
                    data: apiData,
                  },
                ],
              };
            }
            return page;
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };
  // Fetch all templates
  const fetchAllTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      const response = await getTemplates();
      const result = response?.data?.result;

      if (result?.code === 200) {
        const fetchedTemplates = result?.result || [];
        setTemplates(fetchedTemplates);

        if (fetchedTemplates.length > 0) {
          // ✅ If API provides "default" in future
          const apiDefault = fetchedTemplates.find((tpl) => tpl.is_default);
          const initialTemplate = apiDefault || fetchedTemplates[0];

          setDefaultTemplate(initialTemplate);
          setSelectedTemplate(initialTemplate);
          setDesignName(initialTemplate.name);
        }
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  // Fetch all pages for selected template
  const fetchAllPages = async (templateId) => {
    try {
      setIsLoadingPages(true);
      setPagesLoaded(false);

      const payload = { app_id: templateId };
      const response = await getPages({ payload });
      const result = response?.data?.result;

      if (result?.code === 200) {
        const fetchedPages = result?.result || [];
        setPages(fetchedPages);

        // Handle initial currentPageId after pages are loaded
        const storedCurrentPageId = loadFromStorage(
          STORAGE_KEYS.CURRENT_PAGE_ID,
          null
        );

        if (fetchedPages.length > 0) {
          let initialPageId = null;

          // Priority 1: Use stored page ID if it exists in fetched pages
          if (
            storedCurrentPageId &&
            fetchedPages.find((p) => p.id === storedCurrentPageId)
          ) {
            initialPageId = storedCurrentPageId;
          }
          // Priority 2: Find "Home" page
          else {
            const homePage = fetchedPages.find((p) => p.type === "Home");
            initialPageId = homePage ? homePage.id : fetchedPages[0].id;
          }

          setCurrentPageId(initialPageId);
        }

        setPagesLoaded(true);
      } else {
        setPages([]);
        setPagesLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching all pages:", error);
      setPages([]);
      setPagesLoaded(true);
    } finally {
      setIsLoadingPages(false);
    }
  };

  // Fetch single page by id and merge into pages
  const fetchPage = async (templateId, pageId) => {
    try {
      setIsLoadingComponents(true);
      const isProductPage = pages.some(
        (p) => p.type === "AllProducts" && p.id === pageId
      );
      console.log("isProductPage", isProductPage, pageId, pages);
      if (isProductPage) {
        console.log("Skipping API call for AllProducts page");
        return; // 🚫 don’t call API
      }
      const payload = { app_id: templateId, page_id: pageId };
      const response = await getPage({ payload });
      const result = response?.data?.result;

      if (result?.code === 200) {
        const page = result?.result;

        const updatedComponents =
          page?.components?.map((comp) => {
            let updatedProps = { ...comp.props };

            // ✅ Handle image
            if (comp.props?.image) {
              updatedProps.image = `${BASE_URL}${comp.props.image}`;
            }
            // ✅ Handle images
            if (comp.props?.images) {
              updatedProps.images = comp.props.images.map(
                (img) => `${BASE_URL}${img}`
              );
            }

            // ✅ Handle items with image
            if (comp.props?.items) {
              updatedProps.items = comp.props.items.map((item) => ({
                ...item,
                image: item.image ? `${BASE_URL}${item.image}` : null,
              }));
            }

            return {
              ...comp,
              props: updatedProps,
            };
          }) || [];

        setPages((prevPages) =>
          prevPages.map((p) =>
            p.id === page.id
              ? { ...p, components: updatedComponents } // ✅ append components
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setIsLoadingComponents(false);
    }
  };

  // Initialize - Load from localStorage and fetch templates
  useEffect(() => {
    const storedSavedDesigns = loadFromStorage(STORAGE_KEYS.SAVED_DESIGNS, []);
    const storedCanvasScale = loadFromStorage(STORAGE_KEYS.CANVAS_SCALE, 80);

    setSavedDesigns(storedSavedDesigns);
    setCanvasScale(storedCanvasScale);

    // Start the API flow
    fetchAllTemplates();
  }, []);

  // When template changes, fetch its pages
  useEffect(() => {
    if (selectedTemplate && selectedTemplate.id && !isLoadingTemplates) {
      fetchAllPages(selectedTemplate.id);
      setDesignName(selectedTemplate.name);
    }
  }, [selectedTemplate, isLoadingTemplates]);

  // When pages are loaded and currentPageId is set, fetch the specific page
  useEffect(() => {
    if (
      pagesLoaded &&
      currentPageId &&
      selectedTemplate &&
      selectedTemplate.id &&
      !isLoadingPages
    ) {
      fetchPage(selectedTemplate.id, currentPageId);
      saveToStorage(STORAGE_KEYS.CURRENT_PAGE_ID, currentPageId);
    }
  }, [pagesLoaded, currentPageId, selectedTemplate, isLoadingPages]);

  // Save to localStorage when state changes
  useEffect(() => {
    if (pages.length > 0) {
      saveToStorage(STORAGE_KEYS.PAGES, pages);
    }
  }, [pages]);

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
    console.log("goBack", navigationHistory);
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
      console.log(
        "inside context handleComponentClick",
        componentId,
        clickData
      );

      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;
      const { type, index, targetPageId } = clickData;
      switch (type) {
        case "image": {
          const imageNav = component.props.imageNavigation?.find(
            (nav) => nav.imageIndex === index
          );
          if (imageNav?.targetPageId) {
            const itemId = imageNav.id; // ✅ navigation id
            console.log("Image itemId:", itemId);
            fetchProducts(itemId);
            navigateToPage(imageNav.targetPageId);
          }
          break;
        }

        case "item": {
          const item = component.props.items?.[index];
          if (item?.navigation?.targetPageId) {
            const itemId = item.navigation.id; // ✅ navigation id
            console.log("Item itemId:", itemId);
            fetchProducts(itemId);
            navigateToPage(item.navigation.targetPageId);
          }
          break;
        }

        case "product": {
          const productNav = component.props.productNavigation?.find(
            (nav) => nav.productIndex === index
          );
          if (productNav?.targetPageId) {
            const itemId = productNav.id; // ✅ navigation id
            console.log("Product itemId:", itemId);
            fetchProducts(itemId);
            navigateToPage(productNav.targetPageId);
          }
          break;
        }

        case "component": {
          if (component.props.navigation?.targetPageId) {
            const itemId = component.props.navigation.id; // ✅ navigation id
            console.log("Component itemId:", itemId);
            fetchProducts(itemId);
            navigateToPage(component.props.navigation.targetPageId);
          }
          break;
        }

        default:
          console.warn("Unknown click type:", type);
      }

      // switch (type) {
      //   case "image":
      //     // Handle image clicks for banner, bodyPlain, bodyRound, etc.
      //     const imageNav = component.props.imageNavigation?.find(
      //       (nav) => nav.imageIndex === index
      //     );
      //     if (imageNav && imageNav.targetPageId) {
      //       navigateToPage(imageNav.targetPageId);
      //     }
      //     break;

      //   case "item":
      //     // Handle item clicks for imageRow, subHeaderGrid, subBodyGrid
      //     const item = component.props.items?.[index];
      //     if (item.navigation.targetPageId) {
      //       navigateToPage(item.navigation.targetPageId);
      //     }
      //     break;

      //   case "product":
      //     // Handle product clicks for productsGrid
      //     const productNav = component.props.productNavigation?.find(
      //       (nav) => nav.productIndex === index
      //     );
      //     if (productNav && productNav.targetPageId) {
      //       navigateToPage(productNav.targetPageId);
      //     }
      //     break;

      //   case "component":
      //     // Handle direct component clicks (videoText, imageText)
      //     if (component.props.navigation.targetPageId) {
      //       navigateToPage(component.props.navigation.targetPageId);
      //     }
      //     break;

      //   default:
      //     console.warn("Unknown click type:", type);
      // }
    },
    [components, navigateToPage]
  );

  const updateItemNavigation = useCallback(
    (componentId, itemIndex, targetPageId, enabled = true, navigation) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const updatedItems = component.props.items.map((item, index) => {
        if (index === itemIndex) {
          return {
            ...item,
            navigation: {
              enabled,
              navigation,
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
    (componentId, productIndex, targetPageId, enabled = true, navigation) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const currentNav = component.props.productNavigation || [];
      const existingNavIndex = currentNav.findIndex(
        (nav) => nav.productIndex === productIndex
      );

      let updatedNav;
      if (existingNavIndex >= 0) {
        updatedNav = [...currentNav];
        updatedNav[existingNavIndex] = {
          productIndex,
          targetPageId,
          enabled,
          navigation,
        };
      } else {
        updatedNav = [
          ...currentNav,
          { productIndex, targetPageId, enabled, navigation },
        ];
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
    (componentId, targetPageId, enabled = true, navigation) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const updatedComponent = {
        ...component,
        props: {
          ...component.props,
          navigation: {
            enabled,
            navigation,
            targetPageId,
          },
        },
      };

      handleUpdateComponent(updatedComponent);
    },
    [components]
  );

  const updateImageNavigation = useCallback(
    (componentId, imageIndex, targetPageId, enabled = true, navigation) => {
      const component = components.find((comp) => comp.id === componentId);
      if (!component) return;

      const currentNav = component.props.imageNavigation || [];
      const existingNavIndex = currentNav.findIndex(
        (nav) => nav.imageIndex === imageIndex
      );

      let updatedNav;
      if (existingNavIndex >= 0) {
        updatedNav = [...currentNav];
        updatedNav[existingNavIndex] = {
          imageIndex,
          targetPageId,
          enabled,
          navigation,
        };
      } else {
        updatedNav = [
          ...currentNav,
          { imageIndex, targetPageId, enabled, navigation },
        ];
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

  // Page management functions

  const handleAddPage = useCallback(() => {
    setEditingPage(null);
    setIsSheetOpen(true);
  }, []);

  const handleEditPage = useCallback((pageData) => {
    setEditingPage(pageData);
    setIsSheetOpen(true);
  }, []);

  const handleSavePage = useCallback(
    async (payload) => {
      try {
        if (editingPage) {
          // API call for updating existing page
          const response = await updatePage({ payload });
          const result = response?.data?.result;
          console.log("update page result", result);
          if (result.code === 200) {
            const pageToEdit = result?.result;

            // Update local state
            setPages((prev) =>
              prev.map((page) =>
                page.id === pageToEdit.id
                  ? { ...page, ...pageToEdit } // <-- trust backend response
                  : page
              )
            );
            toast.success("Page updated successfully!");
          }
        } else {
          // API call for creating new page
          const response = await createPage({ payload });
          const result = response?.data?.result;
          console.log("create page result", result);
          if (result.code === 200) {
            const pageToAdd = result?.result;
            setPages((prev) => [...prev, pageToAdd]);
            setCurrentPageId(pageToAdd.id);
            setSelectedComponent(null);
            setHasUnsavedChanges(true);
            toast.success("Page created successfully!");
          }
        }
      } catch (error) {
        console.error("Error saving page:", error);

        toast.error(
          `Failed to ${
            editingPage ? "edit" : "add"
          } the page. Please try again.`
        );

        throw error; // Re-throw to handle in the sheet component
      }
    },
    [editingPage]
  );

  const handleDeletePage = useCallback(
    async (pageId) => {
      if (pages.length <= 1) {
        alert("Cannot delete the last page");
        return;
      }

      if (confirm("Are you sure you want to delete this page?")) {
        try {
          const payload = { page_id: pageId };
          const response = await deletePage({ payload });
          const result = response?.data?.result;
          if (result?.code === 200) {
            const pageToDelete = result?.result;
            const updatedPages = pages.filter(
              (page) => page.id !== pageToDelete
            );
            setPages(updatedPages);

            if (currentPageId === pageToDelete) {
              setCurrentPageId(updatedPages[0]?.id || null);
            }

            setSelectedComponent(null);
            setHasUnsavedChanges(true);
            clearNavigationHistory();
            toast.success("Page deleted successfully!");
          }
        } catch (error) {
          console.error("Error deleting page:", error);
          toast.error("Failed to delete the page. Please try again.");
        }
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
    async (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = components.findIndex((item) => item.id === active.id);
      const newIndex = components.findIndex((item) => item.id === over.id);

      const payload = {
        vals: {
          component_id: active.id,
          position: newIndex, // new index as "y-axis"
        },
      };

      try {
        const response = await updateComponentGeneral({ payload });
        const result = response?.data?.result;

        if (result?.code === 200 && result?.result === active.id) {
          const newComponents = arrayMove(components, oldIndex, newIndex);
          updateCurrentPageComponents(newComponents);
        } else {
          console.error("Failed to update component order:", result);
        }
      } catch (error) {
        console.error("Error while updating component order:", error);
      }
    },
    [components, updateCurrentPageComponents]
  );

  const handleAddComponent = useCallback(
    async (componentType) => {
      const payload = {
        vals: {
          layout_id: currentPageId,
          type: componentType,
        },
      };
      try {
        const response = await addComponent({ payload });
        const result = response?.data?.result;
        console.log("result on addComponent", result);
        if (result?.code === 200) {
          const compToAdd = result?.result;
          const newComponent = {
            id: compToAdd?.id,
            type: compToAdd?.type,
            position: compToAdd?.position,
            props: compToAdd?.props,
          };
          updateCurrentPageComponents([...components, newComponent]);
          toast.success("Component added successfully.");
          console.log("newComponent", newComponent, components);
        }
      } catch (error) {
        toast.error("Failed to add the component. Please try again.");
        console.error("Error adding component:", error);
      }
    },
    [components, updateCurrentPageComponents]
  );

  const handleSelectComponent = useCallback((component) => {
    setSelectedComponent(component);
  }, []);
  const handleUpdateComponent = useCallback(
    async (updatedComponent) => {
      // Always include component_id
      const payloadVals = {
        component_id: updatedComponent.id,
      };

      // Map props if they exist
      const props = updatedComponent.props || {};

      if ("title" in props) payloadVals.title = props.title;
      if ("gridTitle" in props) payloadVals.title = props.gridTitle;
      if ("title_color" in props) payloadVals.title_color = props.title_color;
      if ("bg_image" in props) payloadVals.bg_image = props.bg_image;
      if ("button_text" in props) payloadVals.button_text = props.button_text;
      if ("button_color" in props)
        payloadVals.button_color = props.button_color;
      if ("interval" in props) payloadVals.interval = props.interval;
      if ("autoPlay" in props) payloadVals.autoPlay = props.autoPlay;

      const payload = { vals: payloadVals };

      console.log("Final payload for API:", payload);

      try {
        const response = await updateComponentGeneral({ payload });
        const result = response?.data?.result;

        // ✅ Confirm success + same component
        if (result?.code === 200 && result?.result === updatedComponent.id) {
          const newComponents = components.map((comp) =>
            comp.id === updatedComponent.id ? updatedComponent : comp
          );
          updateCurrentPageComponents(newComponents);
          // Optionally reselect updated component
          setSelectedComponent(updatedComponent);
        } else {
          console.error("Failed to update component:", result);
        }
      } catch (error) {
        console.error("Error while updating component:", error);
      }
    },
    [components, updateComponentGeneral, updateCurrentPageComponents]
  );

  const handleDeleteComponent = useCallback(
    async (componentId) => {
      const payload = { component_id: componentId };
      try {
        const response = await deleteComponent({ payload });
        const result = response?.data?.result;
        console.log("result on deleteComponent", result);
        if (result?.code === 200) {
          const compToDelete = result?.result;
          const newComponents = components.filter(
            (comp) => comp.id !== compToDelete
          );
          updateCurrentPageComponents(newComponents);
          if (selectedComponent?.id === compToDelete) {
            setSelectedComponent(null);
          }
        }
        toast.success("Component deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete the component. Please try again.");
        console.error("Error deleting component:", error);
      }
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
  // const processImage = async (
  //   componentId,
  //   uploadCase,
  //   imageUrl,
  //   updateStateWithImage
  // ) => {
  //   try {
  //     const payload = {
  //       vals: {
  //         section_id: componentId,
  //         image: imageUrl,
  //       },
  //     };

  //     const response = await createComponentItem({ payload });
  //     const result = response?.data?.result;

  //     if (result?.code === 200) {
  //       console.log("create component item result", result);
  //       // 🔹 Update local state (PropertyPanel)
  //       // updateStateWithImage(uploadCase, imageUrl);

  //       // 🔹 Update global/context state
  //       // handleImageUpload(componentId, imageUrl);

  //       return { success: true };
  //     } else {
  //       console.error("API failed while uploading image:", result);
  //       return { success: false, error: result };
  //     }
  //   } catch (error) {
  //     console.error("Error in createComponentItem:", error);
  //     return { success: false, error };
  //   }
  // };

  const normalizeComponent = (comp) => {
    if (!comp?.props) return comp;

    const updatedProps = { ...comp.props };

    // ✅ Handle single image
    if (updatedProps.image) {
      updatedProps.image = isPublicUrl(updatedProps.image)
        ? updatedProps.image
        : `${BASE_URL}${updatedProps.image}?v=${Date.now()}`;
    }

    // ✅ Handle images array
    if (updatedProps.images) {
      updatedProps.images = updatedProps.images.map((img) =>
        isPublicUrl(img) ? img : `${BASE_URL}${img}?v=${Date.now()}`
      );
    }

    // ✅ Handle items array with image
    if (updatedProps.items) {
      updatedProps.items = updatedProps.items.map((item) => ({
        ...item,
        image: item.image
          ? isPublicUrl(item.image)
            ? item.image
            : `${BASE_URL}${item.image}`
          : null,
      }));
      // ✅ Handle products array with image
      if (updatedProps.products) {
        updatedProps.products = updatedProps.products.map((product) => ({
          ...product,
          image: product.image
            ? isPublicUrl(product.image)
              ? product.image
              : `${BASE_URL}${product.image}`
            : null,
        }));
      }
    }

    return { ...comp, props: updatedProps };
  };
  //create/update image item for 7 components i.e. banner, bodyPlain, bodyRound, bodyHalf, brands, SubCategoryBrands, imageText.
  const processImage = async (componentId, imageUrl, itemId = null) => {
    try {
      const payload = {
        vals: {
          section_id: componentId,
          image: imageUrl,
        },
      };
      let response;
      if (itemId) {
        // Update case
        payload.vals.id = itemId;
        response = await updateComponentItem({ payload });
      } else {
        // Create case
        response = await createComponentItem({ payload });
      }
      const result = response?.data?.result;

      if (result?.code === 200 && result?.result) {
        const updatedComponent = normalizeComponent(result.result);

        // Replace component in state
        const newComponents = components.map((comp) =>
          comp.id === updatedComponent.id ? updatedComponent : comp
        );
        updateCurrentPageComponents(newComponents);

        // Keep selected in sync
        setSelectedComponent(updatedComponent);

        return { success: true, updatedComponent };
      } else {
        console.error("Image upload failed:", result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return { success: false, error };
    }
  };
  //delete item for all components
  const onRemoveItem = async (itemId) => {
    try {
      const payload = {
        vals: {
          id: itemId,
        },
      };

      const response = await deleteComponentItem({ payload });
      const result = response?.data?.result;

      if (result?.code === 200 && result?.result) {
        const updatedComponent = normalizeComponent(result.result);

        // Replace component in state
        const newComponents = components.map((comp) =>
          comp.id === updatedComponent.id ? updatedComponent : comp
        );
        updateCurrentPageComponents(newComponents);

        // Keep selected in sync
        setSelectedComponent(updatedComponent);

        return { success: true, updatedComponent };
      } else {
        console.error("Image Deletion failed:", result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      return { success: false, error };
    }
  };

  //create/update item for 3 components i.e. imageRow, subBodyGrid, subHeaderGrid
  const processItem = async (componentId, item) => {
    try {
      let payload = {
        vals: {
          section_id: componentId,
          image: item.image,
          name: item.text,
        },
      };
      let response;

      if (item?.navigation?.id) {
        // Update case
        payload.vals.id = item.navigation.id;
        response = await updateComponentItem({ payload });
      } else {
        // Create case
        response = await createComponentItem({ payload });
      }

      const result = response?.data?.result;

      if (result?.code === 200 && result?.result) {
        const updatedComponent = normalizeComponent(result.result);

        // Replace in state
        const newComponents = components.map((comp) =>
          comp.id === updatedComponent.id ? updatedComponent : comp
        );
        updateCurrentPageComponents(newComponents);
        setSelectedComponent(updatedComponent);

        return { success: true, updatedComponent };
      } else {
        console.error("Item creation failed:", result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("Error creating item:", error);
      return { success: false, error };
    }
  };

  //create/add video item for videoText component
  const processVideo = async (componentId, url) => {
    try {
      const payload = {
        vals: {
          section_id: componentId,
          video_url: url,
        },
      };

      const response = await createComponentItem({ payload });
      const result = response?.data?.result;

      if (result?.code === 200 && result?.result) {
        const updatedComponent = normalizeComponent(result.result);

        // Replace in state
        const newComponents = components.map((comp) =>
          comp.id === updatedComponent.id ? updatedComponent : comp
        );
        updateCurrentPageComponents(newComponents);
        setSelectedComponent(updatedComponent);

        return { success: true, updatedComponent };
      } else {
        console.error("Video creation failed:", result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("Error creating video:", error);
      return { success: false, error };
    }
  };
  //update navigation type item
  const itemNavigationUpdate = async (componentId, type, itemId) => {
    try {
      const payload = {
        vals: {
          section_id: componentId,
          selected_layout_type: type,
          id: itemId,
        },
      };

      const response = await updateComponentItem({ payload });
      const result = response?.data?.result;

      if (result?.code === 200 && result?.result) {
        const updatedComponent = normalizeComponent(result.result);

        // Replace in state
        const newComponents = components.map((comp) =>
          comp.id === updatedComponent.id ? updatedComponent : comp
        );
        updateCurrentPageComponents(newComponents);
        setSelectedComponent(updatedComponent);

        return { success: true, updatedComponent };
      } else {
        console.error("navigation type update failed:", result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("Error update navigation type:", error);
      return { success: false, error };
    }
  };
  //update item navigation target
  const updateNavigationTarget = async (sectionId, targetId, itemId) => {
    console.log(
      "on page select updateNavigationTarget.....sectionId, targetId, itemId:",
      sectionId,
      targetId,
      itemId
    );
    try {
      const payload = {
        vals: { section_id: sectionId, app_layout_id: targetId, id: itemId },
      };
      const response = await updateComponentItem({ payload });
      const result = response?.data?.result;

      if (result?.code === 200 && result?.result) {
        const updatedComponent = normalizeComponent(result.result);

        // Replace in state
        const newComponents = components.map((comp) =>
          comp.id === updatedComponent.id ? updatedComponent : comp
        );
        updateCurrentPageComponents(newComponents);
        setSelectedComponent(updatedComponent);

        return { success: true, updatedComponent };
      } else {
        console.error("navigation type update failed:", result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("Error update navigation type:", error);
      return { success: false, error };
    }
  };
  //update video item for videoText component
  const processVideoUpdate = async (componentId, url, itemId) => {
    try {
      const payload = {
        vals: {
          section_id: componentId,
          video_url: url,
          id: itemId,
        },
      };

      const response = await updateComponentItem({ payload });
      const result = response?.data?.result;

      if (result?.code === 200 && result?.result) {
        const updatedComponent = normalizeComponent(result.result);

        // Replace in state
        const newComponents = components.map((comp) =>
          comp.id === updatedComponent.id ? updatedComponent : comp
        );
        updateCurrentPageComponents(newComponents);
        setSelectedComponent(updatedComponent);

        return { success: true, updatedComponent };
      } else {
        console.error("Video updatation failed:", result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error("Error updating video:", error);
      return { success: false, error };
    }
  };

  const handleImageUpload = useCallback(
    (componentId, imageUrl) => {
      const updatedComponent = components.find(
        (comp) => comp.id === componentId
      );
      if (!updatedComponent) return;

      let newProps = { ...updatedComponent.props };

      switch (updatedComponent.type) {
        case "banner":
        case "bodyPlain":
        case "bodyRound":
        case "bodyHalf":
        case "brands":
        case "subCategBrands":
          newProps = {
            ...updatedComponent.props,
            images: [...(updatedComponent.props.images || []), imageUrl],
          };
          break;

        case "imageText":
          newProps = {
            ...updatedComponent.props,
            image: imageUrl, // single image
          };
          break;

        default:
          console.warn("Unhandled component type:", updatedComponent.type);
          return;
      }

      handleUpdateComponent({
        ...updatedComponent,
        props: newProps,
      });
    },
    [components, handleUpdateComponent]
  );
  const handleRemoveImage = useCallback(
    (componentId, index = null) => {
      const updatedComponent = components.find(
        (comp) => comp.id === componentId
      );
      if (!updatedComponent) return;

      let newProps = { ...updatedComponent.props };

      switch (updatedComponent.type) {
        case "banner":
        case "bodyPlain":
        case "bodyRound":
        case "bodyHalf":
        case "brands":
        case "subCategBrands": {
          const updatedImages = [...(updatedComponent.props.images || [])];
          if (index !== null && index >= 0 && index < updatedImages.length) {
            updatedImages.splice(index, 1);
          }
          newProps = {
            ...updatedComponent.props,
            images: updatedImages,
          };
          break;
        }

        case "imageText":
          newProps = {
            ...updatedComponent.props,
            image: "", // clear single image
          };
          break;

        default:
          console.warn(
            "Unhandled component type in remove:",
            updatedComponent.type
          );
          return;
      }

      handleUpdateComponent({
        ...updatedComponent,
        props: newProps,
      });
    },
    [components, handleUpdateComponent]
  );

  // Design management functions
  // const saveDesign = useCallback(async () => {
  //   setIsSaving(true);
  //   const designData = {
  //     name: designName,
  //     pages: pages,
  //     metadata: {
  //       created: new Date().toISOString(),
  //       version: "2.1", // Updated version for navigation feature
  //       pagesCount: pages.length,
  //       totalComponents: pages.reduce(
  //         (total, page) => total + page.components.length,
  //         0
  //       ),
  //       hasNavigation: pages.some((page) =>
  //         page.components.some(
  //           (comp) =>
  //             comp.props.navigation?.enabled ||
  //             comp.props.imageNavigation?.some((nav) => nav.enabled) ||
  //             comp.props.productNavigation?.some((nav) => nav.enabled) ||
  //             comp.props.items?.some((item) => item.navigation?.enabled)
  //         )
  //       ),
  //     },
  //   };

  //   setSavedDesigns((prev) => [...prev, designData]);
  //   setHasUnsavedChanges(false);
  //   setIsSaving(false);
  //   alert("Design saved successfully!");
  // }, [designName, pages]);

  // const loadDesign = useCallback(
  //   async (designId) => {
  //     try {
  //       const response = await fetch(`/api/designs/${designId}`);
  //       if (response.ok) {
  //         const design = await response.json();

  //         if (design.pages) {
  //           setPages(design.pages);
  //           setCurrentPageId(design.pages[0]?.id || null);
  //         } else if (design.components) {
  //           setPages([
  //             {
  //               id: null,
  //               name: "Home",
  //               components: design.components,
  //               isActive: true,
  //             },
  //           ]);
  //           setCurrentPageId(null);
  //         }

  //         setDesignName(design.name);
  //         setSelectedComponent(null);
  //         setHasUnsavedChanges(false);
  //         clearNavigationHistory();
  //       }
  //     } catch (error) {
  //       console.error("Error loading design:", error);
  //     }
  //   },
  //   [clearNavigationHistory]
  // );

  // const exportDesign = useCallback(() => {
  //   const designData = {
  //     name: designName,
  //     pages: pages,
  //     metadata: {
  //       created: new Date().toISOString(),
  //       version: "2.1",
  //       pagesCount: pages.length,
  //       totalComponents: pages.reduce(
  //         (total, page) => total + page.components.length,
  //         0
  //       ),
  //     },
  //   };

  //   const dataStr = JSON.stringify(designData, null, 2);
  //   const dataUri =
  //     "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  //   const exportFileDefaultName = `${designName.replace(/\s+/g, "_")}.json`;

  //   const linkElement = document.createElement("a");
  //   linkElement.setAttribute("href", dataUri);
  //   linkElement.setAttribute("download", exportFileDefaultName);
  //   linkElement.click();
  // }, [designName, pages]);
  const handleSaveTitle = async () => {
    try {
      setLoadingTitle(true);
      const payload = { vals: { id: selectedTemplate?.id, name: designName } };
      const response = await updateTemplate({ payload });
      const result = response?.data?.result;

      if (result?.code === 200) {
        toast.success("Template title updated successfully");
        setIsEditingTitle(false);
      } else {
        toast.error("Failed to update title");
        setDesignName(selectedTemplate?.name); // revert
      }
    } catch (err) {
      toast.error("Something went wrong while updating title!");
      setDesignName(selectedTemplate?.name); // revert
    } finally {
      setLoadingTitle(false);
    }
  };
  const handleNewDesign = useCallback(
    async ({ payload }) => {
      setLoadingCreate(true);
      try {
        const response = await createTemplate({ payload });
        const result = response?.data?.result;
        console.log("create template result:", result);
        if (result?.code === 200) {
          toast.success(`Template created successfully!`);
          const newTemplate = result?.result;

          setTemplates((prev) => [...prev, newTemplate]);

          if (newTemplate?.is_default) {
            setDefaultTemplate(newTemplate);
          }
        }
      } catch (error) {
        console.log("Something went wrong while Creating app:", error);
        toast.error(
          `Something went wrong while creating template: ${payload?.vals?.name}!`
        );
      } finally {
        setLoadingCreate(false);
      }

      // setPages([
      //   {
      //     id: null,
      //     name: "Home",
      //     components: [],
      //     isActive: true,
      //   },
      // ]);
      // setCurrentPageId(null);
      // setSelectedComponent(null);
      // setDesignName("Untitled Design");
      // setHasUnsavedChanges(false);
      // clearNavigationHistory();
    },
    [hasUnsavedChanges, clearNavigationHistory]
  );

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
    templates,
    selectedTemplate,
    setSelectedTemplate,
    defaultTemplate,
    setDefaultTemplate,
    showPreview,
    showSaveModal,
    showLoadModal,
    isSaving,
    hasUnsavedChanges,
    navigationHistory,
    canGoBack,
    //navItems
    navItems,
    //loaders for mobile view
    isLoadingTemplates,
    isLoadingPages,
    isLoadingComponents,
    loadingProducts,

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
    //allowEditModeNavigation
    allowEditModeNavigation,
    setAllowEditModeNavigation,
    // Navigation functions
    navigateToPage,
    goBack,
    clearNavigationHistory,
    handleComponentClick,

    // Navigation update functions
    updateNavigationTarget,
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
    handleRemoveImage,
    processImage,
    onRemoveItem,
    processItem,
    processVideo,
    processVideoUpdate,
    itemNavigationUpdate,
    normalizeComponent,
    genericProducts,
    // Design management
    // saveDesign,
    // loadDesign,
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

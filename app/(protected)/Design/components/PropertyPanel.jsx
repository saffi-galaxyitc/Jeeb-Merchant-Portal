import { useCallback, useEffect, useState } from "react";
import { sampleProducts } from "@/lib/utils";
import NavigationPropertyPanel from "./NavigationPropertyPanel";
import {
  renderBannerProperties,
  renderBodyHalfProperties,
  renderBodyPlainProperties,
  renderBodyRoundProperties,
  renderBrandsProperties,
  renderImageRowProperties,
  renderImageTextProperties,
  renderProductsGridProperties,
  renderSubBodyGridProperties,
  renderSubCategBrandsProperties,
  renderSubHeaderGridProperties,
  renderUnknownComponent,
  renderVideoTextProperties,
} from "./PropertyRenders";
import { getProducts } from "@/DAL/products";
import { debounce } from "lodash";
const PropertyPanel = ({
  selectedComponent,
  onUpdateComponent,
  onImageUpload,
  onImageRemove,
}) => {
  //(1) Video Text State variables
  const [videoTextProps, setVideoTextProps] = useState({
    video_url: "",
    title: "",
    title_color: "#000000",
    button_text: "",
    button_color: "#ffffff",
  });
  const [editVideoText, setEditVideoText] = useState(false);
  //(2) Image Row State variables
  const [imageRowItem, setImageRowItem] = useState({
    image: "",
    text: "",
  });
  const [imageRowEditIndex, setImageRowEditIndex] = useState(null);
  //(3) Image Text State variables
  const [imageTextProps, setImageTextProps] = useState({
    image: "",
    title: "",
    title_color: "#000000",
    button_text: "",
    button_color: "#ffffff",
  });
  const [editImageText, setEditImageText] = useState(false);
  //(4) Banner State variables
  const [bannerProps, setBannerProps] = useState({
    autoPlay: true,
    interval: 3000,
    images: [],
  });
  const [editBanner, setEditBanner] = useState(false);
  //(5) Body Plain State variables
  const [bodyPlainProps, setBodyPlainProps] = useState({
    autoPlay: true,
    interval: 3000,
    images: [],
  });
  const [editBodyPlain, setEditBodyPlain] = useState(false);
  //(6) Body Round State variables
  const [bodyRoundProps, setBodyRoundProps] = useState({
    autoPlay: true,
    interval: 3000,
    images: [],
  });
  const [editBodyRound, setEditBodyRound] = useState(false);
  //(7) Body Half State variables
  const [bodyHalfProps, setBodyHalfProps] = useState({
    images: [],
  });
  const [editBodyHalf, setEditBodyHalf] = useState(false);
  //(8) Brand State variables
  const [brandsProps, setBrandsProps] = useState({
    images: [],
    bg_img: "",
    title: "",
    title_color: "#000000",
  });
  const [editBrands, setEditBrands] = useState(false);
  //(9) Sub Header Grid State variables
  const [subHeaderGridItem, setSubHeaderGridItem] = useState({
    image: "",
    text: "",
  });
  const [subHeaderGridEditIndex, setSubHeaderGridEditIndex] = useState(null);
  //(10) subCategBrands State variables
  const [subCategBrandsProps, setSubCategBrandsProps] = useState({
    images: [],
    bg_img: "",
    title: "",
    title_color: "#000000",
  });
  const [editsubCategBrands, setEditSubCategBrands] = useState(false);
  //(11) Sub Body Grid State variables
  const [subBodyGridItem, setSubBodyGridItem] = useState({
    image: "",
    text: "",
  });
  const [subBodyGridEditIndex, setSubBodyGridEditIndex] = useState(null);
  // products state
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  // Local state for product grid title
  const [gridTitle, setGridTitle] = useState("");
  // Local state for selected product from dropdown
  const [selectedProductId, setSelectedProductId] = useState("");

  ////////////End of State Variables///////////////
  const handleInputChange = (setterFn) => (key, value) => {
    setterFn((prev) => ({ ...prev, [key]: value }));
  };
  const saveStateToComponent = (stateObj, keys = []) => {
    const updatedProps = { ...selectedComponent.props };
    keys.forEach((key) => {
      updatedProps[key] = stateObj[key];
    });

    const updatedComponent = {
      ...selectedComponent,
      props: updatedProps,
    };
    console.log("first", updatedComponent);
    onUpdateComponent(updatedComponent);
  };
  const onVideoTextChange = handleInputChange(setVideoTextProps);
  const onBrandsChange = handleInputChange(setBrandsProps);
  const onSubCategBrandsChange = handleInputChange(setSubCategBrandsProps);
  const onBannerChange = handleInputChange(setBannerProps);
  const onBodyPlainChange = handleInputChange(setBodyPlainProps);
  const onBodyRoundChange = handleInputChange(setBodyRoundProps);
  const onImageTextChange = handleInputChange(setImageTextProps);
  const updateStateWithImage = (uploadCase, imageUrl) => {
    switch (uploadCase) {
      case "banner":
        setBannerProps((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }));
        break;
      case "bodyPlain":
        setBodyPlainProps((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }));
        break;
      case "bodyRound":
        setBodyRoundProps((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }));
        break;
      case "bodyHalf":
        setBodyHalfProps((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }));
        break;
      case "brands":
        setBrandsProps((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }));
        break;
      case "subCategBrands":
        setSubCategBrandsProps((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl],
        }));
        break;
      case "imageText":
        setImageTextProps((prev) => ({
          ...prev,
          image: imageUrl, // only one image
        }));
        break;
      default:
        console.warn("Unknown image upload case:", uploadCase);
        break;
    }
  };
  const handleImageUpload = (input, uploadCase) => {
    // --- Case 1: File input event ---
    if (input?.target?.files) {
      const files = input.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach((file) => {
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target.result;
            updateStateWithImage(uploadCase, imageUrl);

            if (onImageUpload) {
              onImageUpload(selectedComponent.id, imageUrl);
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // Allow re-upload of the same file
      input.target.value = "";
    }

    // --- Case 2: Direct URL ---
    else if (typeof input === "string") {
      const imageUrl = input;
      updateStateWithImage(uploadCase, imageUrl);

      if (onImageUpload) {
        onImageUpload(selectedComponent.id, imageUrl);
      }
    }

    // --- Invalid usage ---
    else {
      console.warn(
        "Invalid arguments passed to handleImageUpload:",
        input,
        uploadCase
      );
    }
  };
  const handleRemoveImage = (componentType, index = null) => {
    switch (componentType) {
      case "banner":
      case "bodyPlain":
      case "bodyRound":
      case "bodyHalf":
      case "brands":
      case "subCategBrands": {
        const setStateForArrayType = {
          banner: setBannerProps,
          bodyPlain: setBodyPlainProps,
          bodyRound: setBodyRoundProps,
          bodyHalf: setBodyHalfProps,
          brands: setBrandsProps,
          subCategBrands: setSubCategBrandsProps,
        }[componentType];

        if (!setStateForArrayType) return;

        setStateForArrayType((prev) => {
          const updatedImages = [...(prev.images || [])];
          if (index !== null && index >= 0 && index < updatedImages.length) {
            updatedImages.splice(index, 1);
          }

          // 🔹 Call context method to sync removal
          if (onImageRemove) {
            onImageRemove(selectedComponent.id, index);
          }

          return { ...prev, images: updatedImages };
        });
        break;
      }

      case "imageText":
        setImageTextProps((prev) => {
          // 🔹 Call context method to sync removal
          if (onImageRemove) {
            onImageRemove(selectedComponent.id, null); // null since it's single image
          }
          return {
            ...prev,
            image: "", // clear single image
          };
        });
        break;

      default:
        console.warn(
          "Invalid image type passed to handleRemoveImage:",
          componentType
        );
        break;
    }
  };
  //handlers for imageRow, subBodyGrid and subHeaderGrid
  const addItem = (selectedComponent, onUpdateComponent) => {
    const newItem = {
      image: "https://via.placeholder.com/100",
      text: "New Item",
    };
    const updatedItems = [...(selectedComponent.props.items || []), newItem];

    onUpdateComponent({
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        items: updatedItems,
      },
    });
  };
  const removeItem = (index, selectedComponent, onUpdateComponent) => {
    const updatedItems = selectedComponent.props.items.filter(
      (_, i) => i !== index
    );
    onUpdateComponent({
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        items: updatedItems,
      },
    });
  };
  const editItem = (index, setEditIndex, setItem, selectedComponent) => {
    setEditIndex(index);
    setItem({ ...selectedComponent.props.items[index] });
  };
  const saveItem = (
    editIndex,
    item,
    setEditIndex,
    setItem,
    selectedComponent,
    onUpdateComponent
  ) => {
    if (editIndex !== null) {
      const updatedItems = [...selectedComponent.props.items];
      updatedItems[editIndex] = item;

      onUpdateComponent({
        ...selectedComponent,
        props: {
          ...selectedComponent.props,
          items: updatedItems,
        },
      });

      setEditIndex(null);
      setItem({ image: "", text: "" });
    }
  };
  const cancelEdit = (setEditIndex, setItem) => {
    setEditIndex(null);
    setItem({ image: "", text: "" });
  };
  // Handle grid title change
  const handleGridTitleChange = (e) => {
    const newTitle = e.target.value;
    setGridTitle(newTitle);
    saveStateToComponent({ gridTitle: newTitle }, ["gridTitle"]);
  };
  // Add selected product to the products list
  // const addProductToGrid = () => {
  //   if (!selectedProductId) return;

  //   const productToAdd = sampleProducts.find((p) => p.id === selectedProductId);
  //   if (!productToAdd) return;

  //   // Check if product already exists in the list
  //   const existingProducts = selectedComponent.props.products || [];
  //   const productExists = existingProducts.some(
  //     (p) => p.id === productToAdd.id
  //   );

  //   if (productExists) {
  //     alert("Product already added to the grid!");
  //     return;
  //   }

  //   const updatedProducts = [...existingProducts, productToAdd];
  //   saveStateToComponent({ products: updatedProducts }, ["products"]);

  //   // Reset selection
  //   setSelectedProductId("");
  // };
  const addProductToGrid = () => {
    if (!selectedProductId) return;

    const productToAdd = products.find(
      (p) => String(p.id) === String(selectedProductId)
    );
    if (!productToAdd) return;

    const existingProducts = selectedComponent.props.products || [];
    const productExists = existingProducts.some(
      (p) => String(p.id) === String(productToAdd.id)
    );

    if (productExists) {
      alert("Product already added to the grid!");
      return;
    }

    const updatedProducts = [...existingProducts, productToAdd];
    saveStateToComponent({ products: updatedProducts }, ["products"]);

    setSelectedProductId(""); // reset
  };

  // Remove product from grid
  const removeProductFromGrid = (productId) => {
    const existingProducts = selectedComponent.props.products || [];
    const updatedProducts = existingProducts.filter((p) => p.id !== productId);
    saveStateToComponent({ products: updatedProducts }, ["products"]);
  };
  // Fetch products from API
  const fetchProducts = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const payload = {
        limit: 20,
        offset: 0,
        query,
        order: "name asc",
        tag_ids: [],
        category_ids: [],
      };

      const response = await getProducts({ payload });
      console.log("response", response);
      const result = response?.data?.result;
      if (result?.code === 200) {
        const apiProducts = result.result || [];

        // Transform API data to match your component structure
        const transformedProducts = apiProducts.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category || "Uncategorized",
          list_price: product.price, // Original price
          pricelist_price: product.discount ?? product.price, // Discounted price if exists
          quantity: product.quantity,
          rating_count: product.rating_count || null, // optional if available
          image: product.image
            ? `${BASE_URL}${product.image}`
            : "/placeholder.png",
        }));

        setProducts(transformedProducts);
        console.log("in fetch api products state", products);
        // For total count, you might need to make a separate API call or get it from response
        // For now, estimating based on returned data
        setTotalProducts(transformedProducts.length);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);
  const debouncedFetch = useCallback(
    debounce((q) => {
      fetchProducts(q);
    }, 500),
    [fetchProducts]
  );
  useEffect(() => {
    console.log("selectedComponent", selectedComponent);
    if (productSearchTerm) {
      debouncedFetch(productSearchTerm);
    } else {
      if (selectedComponent.type === "productsGrid") {
        fetchProducts();
      }
    }
  }, [selectedComponent, debouncedFetch, productSearchTerm, fetchProducts]);

  if (!selectedComponent) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <div className="text-4xl mb-4">👆</div>
        <p className="text-sm">Select a component to edit its properties</p>
      </div>
    );
  }
  const renderComponentProperties = () => {
    switch (selectedComponent.type) {
      case "banner":
        return renderBannerProperties({
          editBanner,
          setEditBanner,
          bannerProps,
          setBannerProps,
          selectedComponent,
          saveStateToComponent,
          onBannerChange,
          handleImageUpload,
          handleRemoveImage,
        });
      case "imageRow":
        return renderImageRowProperties({
          selectedComponent,
          onUpdateComponent,
          imageRowEditIndex,
          setImageRowEditIndex,
          imageRowItem,
          setImageRowItem,
          addItem,
          removeItem,
          editItem,
          saveItem,
          cancelEdit,
        });
      case "subHeaderGrid":
        return renderSubHeaderGridProperties({
          selectedComponent,
          onUpdateComponent,
          subHeaderGridEditIndex,
          setSubHeaderGridEditIndex,
          subHeaderGridItem,
          setSubHeaderGridItem,
          addItem,
          removeItem,
          editItem,
          saveItem,
          cancelEdit,
        });
      case "subBodyGrid":
        return renderSubBodyGridProperties({
          selectedComponent,
          onUpdateComponent,
          subBodyGridEditIndex,
          setSubBodyGridEditIndex,
          subBodyGridItem,
          setSubBodyGridItem,
          addItem,
          removeItem,
          editItem,
          saveItem,
          cancelEdit,
        });
      case "videoText":
        return renderVideoTextProperties({
          editVideoText,
          setEditVideoText,
          videoTextProps,
          setVideoTextProps,
          selectedComponent,
          saveStateToComponent,
          onVideoTextChange,
        });
      case "imageText":
        return renderImageTextProperties({
          editImageText,
          setEditImageText,
          imageTextProps,
          setImageTextProps,
          selectedComponent,
          saveStateToComponent,
          onImageTextChange,
          handleImageUpload,
          handleRemoveImage,
        });
      case "bodyHalf":
        return renderBodyHalfProperties({
          editBodyHalf,
          setEditBodyHalf,
          bodyHalfProps,
          setBodyHalfProps,
          selectedComponent,
          saveStateToComponent,
          handleImageUpload,
          handleRemoveImage,
        });
      case "bodyPlain":
        return renderBodyPlainProperties({
          editBodyPlain,
          setEditBodyPlain,
          bodyPlainProps,
          setBodyPlainProps,
          selectedComponent,
          saveStateToComponent,
          onBodyPlainChange,
          handleImageUpload,
          handleRemoveImage,
        });
      case "bodyRound":
        return renderBodyRoundProperties({
          editBodyRound,
          setEditBodyRound,
          bodyRoundProps,
          setBodyRoundProps,
          selectedComponent,
          saveStateToComponent,
          onBodyRoundChange,
          handleImageUpload,
          handleRemoveImage,
        });
      case "brands":
        return renderBrandsProperties({
          editBrands,
          setEditBrands,
          brandsProps,
          setBrandsProps,
          selectedComponent,
          saveStateToComponent,
          onBrandsChange,
          handleImageUpload,
          handleRemoveImage,
        });
      case "subCategBrands":
        return renderSubCategBrandsProperties({
          editsubCategBrands,
          setEditSubCategBrands,
          subCategBrandsProps,
          setSubCategBrandsProps,
          selectedComponent,
          saveStateToComponent,
          onSubCategBrandsChange,
          handleImageUpload,
          handleRemoveImage,
        });
      case "productsGrid":
        return renderProductsGridProperties({
          gridTitle,
          handleGridTitleChange,
          selectedProductId,
          setSelectedProductId,
          sampleProducts,
          addProductToGrid,
          removeProductFromGrid,
          selectedComponent,
          saveStateToComponent,
          products,
          setProductSearchTerm,
          loading,
        });
      default:
        return renderUnknownComponent();
    }
  };
  const renderNavigationProperties = () => {
    return <NavigationPropertyPanel selectedComponent={selectedComponent} />;
  };
  return (
    <div className="space-y-6 mx-4 mt-4 p-4 bg-gray-50 border-l border-gray-200">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="font-medium text-blue-800 capitalize">
          {selectedComponent.type}
        </h3>
        <p className="text-xs text-blue-600 mt-1">ID: {selectedComponent.id}</p>
      </div>

      <div>{renderNavigationProperties()}</div>
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2 px-4">
          Content Settings
        </h3>
        <p className="text-sm text-gray-600 px-4">
          Configure content for <strong>{selectedComponent.type}</strong>{" "}
          component
        </p>
        {renderComponentProperties()}
      </div>
    </div>
  );
};

export default PropertyPanel;

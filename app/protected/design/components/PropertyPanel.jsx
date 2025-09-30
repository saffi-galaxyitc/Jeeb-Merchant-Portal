import { useCallback, useEffect, useState } from "react";
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
  processImage,
  onRemoveItem,
  processItem,
  processVideo,
  processVideoUpdate,
  itemNavigationUpdate,
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
    bg_image: "",
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
    bg_image: "",
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
  //(12) Products Grid State Variables
  const [productsGridProps, setProductsGridProps] = useState({
    products: [],
    gridTitle: "",
  });
  const [editProductsGrid, setEditProductsGrid] = useState(false);
  //image edit index
  const [editIndex, setEditIndex] = useState(null);

  ////////////End of State Variables///////////////
  const handleToggleEdit = (index) => {
    setEditIndex(editIndex === index ? null : index);
  };
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
    if (updatedComponent?.type === "videoText") {
      if (
        updatedComponent?.props?.navigation &&
        Object.keys(updatedComponent.props.navigation).length > 0 &&
        updatedComponent?.props?.navigation?.id
      ) {
        processVideoUpdate(
          updatedComponent.id,
          updatedComponent?.props?.video_url,
          updatedComponent?.props?.navigation?.id
        );
      } else {
        processVideo(updatedComponent.id, updatedComponent?.props?.video_url);
      }
    }

    onUpdateComponent(updatedComponent);
  };
  const onVideoTextChange = handleInputChange(setVideoTextProps);
  const onBrandsChange = handleInputChange(setBrandsProps);
  const onBannerChange = handleInputChange(setBannerProps);
  const onBodyPlainChange = handleInputChange(setBodyPlainProps);
  const onBodyRoundChange = handleInputChange(setBodyRoundProps);
  const onImageTextChange = handleInputChange(setImageTextProps);
  const onSubCategBrandsChange = handleInputChange(setSubCategBrandsProps);
  const onProductsGridChange = handleInputChange(setProductsGridProps);

  const handleImageUpload = (input, uploadCase) => {
    const process = async (imageUrl) => {
      let itemId = null;
      if (uploadCase === "imageText") {
        itemId = selectedComponent?.props?.navigation?.id || null;
      } else {
        itemId = editIndex
          ? selectedComponent?.props?.imageNavigation?.[editIndex]?.id
          : null;
      }

      await processImage(selectedComponent.id, imageUrl, itemId);
    };

    // Case 1: File input
    if (input?.target?.files) {
      const files = input.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach((file) => {
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => process(event.target.result);
          reader.readAsDataURL(file);
        }
      });

      input.target.value = "";
    }

    // Case 2: Direct URL
    else if (typeof input === "string") {
      process(input);
    } else {
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
        const itemId = selectedComponent?.props?.imageNavigation[index]?.id;
        onRemoveItem(itemId);
        // const setStateForArrayType = {
        //   banner: setBannerProps,
        //   bodyPlain: setBodyPlainProps,
        //   bodyRound: setBodyRoundProps,
        //   bodyHalf: setBodyHalfProps,
        //   brands: setBrandsProps,
        //   subCategBrands: setSubCategBrandsProps,
        // }[componentType];

        // if (!setStateForArrayType) return;

        // setStateForArrayType((prev) => {
        //   const updatedImages = [...(prev.images || [])];
        //   if (index !== null && index >= 0 && index < updatedImages.length) {
        //     updatedImages.splice(index, 1);
        //   }

        //   // 🔹 Call context method to sync removal
        //   if (onImageRemove) {
        //     onImageRemove(selectedComponent.id, index);
        //   }

        //   return { ...prev, images: updatedImages };
        // });
        break;
      }

      case "imageText": {
        const itemId = selectedComponent?.props?.navigation?.id;
        onRemoveItem(itemId);
        // setImageTextProps((prev) => {
        //   // 🔹 Call context method to sync removal
        //   if (onImageRemove) {
        //     onImageRemove(selectedComponent.id, null); // null since it's single image
        //   }
        //   return {
        //     ...prev,
        //     image: "", // clear single image
        //   };
        // });
        break;
      }
      default:
        console.warn(
          "Invalid image type passed to handleRemoveImage:",
          componentType
        );
        break;
    }
  };
  //handlers for imageRow, subBodyGrid and subHeaderGrid
  const addItem = (
    selectedComponent,
    onUpdateComponent,
    setEditIndex,
    setItem
  ) => {
    const items = selectedComponent?.props?.items || [];

    // Create a placeholder item
    const newItem = {
      image: "https://via.placeholder.com/100",
      text: "New Item",
    };

    // Update component locally with placeholder
    const updatedItems = [...items, newItem];
    onUpdateComponent({
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        items: updatedItems,
      },
    });

    // Put the new item in edit mode
    setEditIndex(updatedItems.length - 1); // last index
    setItem(newItem);
  };
  const removeItem = (index, selectedComponent, onUpdateComponent) => {
    const itemId = selectedComponent.props?.items[index]?.navigation?.id;
    console.log("on remove item", itemId);
    onRemoveItem(itemId);
    // const updatedItems = selectedComponent.props.items.filter(
    //   (_, i) => i !== index
    // );
    // onUpdateComponent({
    //   ...selectedComponent,
    //   props: {
    //     ...selectedComponent.props,
    //     items: updatedItems,
    //   },
    // });
  };
  const editItem = (index, setEditIndex, setItem, selectedComponent) => {
    setEditIndex(index);
    setItem({ ...selectedComponent.props.items[index] });
  };
  const saveItem = async (
    item,
    setImageRowEditIndex,
    setImageRowItem,
    selectedComponent,
    onUpdateComponent
  ) => {
    try {
      // console.log("item on save", item);
      // Call API to process/save item
      const result = await processItem(selectedComponent.id, item);

      if (result.success) {
        const updatedComponent = result.updatedComponent;

        // Update state with normalized component
        onUpdateComponent(updatedComponent);

        // Reset edit state
        setImageRowEditIndex(null);
        setImageRowItem({ image: "", text: "" });
      } else {
        console.error("Save failed:", result.error);
      }
    } catch (err) {
      console.error("Error in saveItem:", err);
    }
  };
  const cancelEdit = (setEditIndex, setItem) => {
    setEditIndex(null);
    setItem({ image: "", text: "" });
  };
  //get updated local props
  useEffect(() => {
    if (!selectedComponent?.props) return;

    switch (selectedComponent.type) {
      case "videoText":
        setVideoTextProps({
          video_url: selectedComponent.props.video_url || "",
          title: selectedComponent.props.title || "",
          title_color: selectedComponent.props.title_color || "#000000",
          button_text: selectedComponent.props.button_text || "",
          button_color: selectedComponent.props.button_color || "#ffffff",
        });
        break;

      case "imageRow":
        setImageRowItem({
          image: selectedComponent.props.image || "",
          text: selectedComponent.props.text || "",
        });
        break;

      case "imageText":
        setImageTextProps({
          image: selectedComponent.props.image || "",
          title: selectedComponent.props.title || "",
          title_color: selectedComponent.props.title_color || "#000000",
          button_text: selectedComponent.props.button_text || "",
          button_color: selectedComponent.props.button_color || "#ffffff",
        });
        break;

      case "banner":
        setBannerProps({
          autoPlay: selectedComponent.props.autoPlay || true,
          interval: selectedComponent.props.interval || 3000,
          images: selectedComponent.props.images || [],
        });
        break;

      case "bodyPlain":
        setBodyPlainProps({
          autoPlay: selectedComponent.props.autoPlay ?? true,
          interval: selectedComponent.props.interval || 3000,
          images: selectedComponent.props.images || [],
        });
        break;

      case "bodyRound":
        setBodyRoundProps({
          autoPlay: selectedComponent.props.autoPlay ?? true,
          interval: selectedComponent.props.interval || 3000,
          images: selectedComponent.props.images || [],
        });
        break;

      case "bodyHalf":
        setBodyHalfProps({
          images: selectedComponent.props.images || [],
        });
        break;

      case "brands":
        setBrandsProps({
          images: selectedComponent.props.images || [],
          bg_image: selectedComponent.props.bg_image || "",
          title: selectedComponent.props.title || "",
          title_color: selectedComponent.props.title_color || "#000000",
        });
        break;

      case "subHeaderGrid":
        setSubHeaderGridItem({
          image: selectedComponent.props.image || "",
          text: selectedComponent.props.text || "",
        });
        break;

      case "subCategBrands":
        setSubCategBrandsProps({
          images: selectedComponent.props.images || [],
          bg_image: selectedComponent.props.bg_image || "",
          title: selectedComponent.props.title || "",
          title_color: selectedComponent.props.title_color || "#000000",
        });
        break;

      case "subBodyGrid":
        setSubBodyGridItem({
          image: selectedComponent.props.image || "",
          text: selectedComponent.props.text || "",
        });
        break;

      case "productsGrid":
        setProductsGridProps({
          products: selectedComponent.props.products || [],
          gridTitle: selectedComponent.props.gridTitle || "",
        });
        break;

      default:
        break;
    }
  }, [selectedComponent]);

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
          handleToggleEdit,
          editIndex,
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
          handleToggleEdit,
          editIndex,
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
          handleToggleEdit,
          editIndex,
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
          handleToggleEdit,
          editIndex,
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
          handleToggleEdit,
          editIndex,
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
          handleToggleEdit,
          editIndex,
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
          handleToggleEdit,
          editIndex,
        });
      case "productsGrid":
        return renderProductsGridProperties({
          editProductsGrid,
          setEditProductsGrid,
          productsGridProps,
          setProductsGridProps,
          selectedComponent,
          saveStateToComponent,
          onProductsGridChange,
        });
      default:
        return renderUnknownComponent();
    }
  };
  const renderNavigationProperties = () => {
    return (
      <NavigationPropertyPanel
        selectedComponent={selectedComponent}
        itemNavigationUpdate={itemNavigationUpdate}
      />
    );
  };
  return (
    <div className="space-y-6 mx-4 mt-4 p-4 bg-gray-50 border-l border-gray-200">
      {selectedComponent.type === "productsList" ? (
        <div className="text-sm text-gray-500">
          No editable properties available for this component.
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h3 className="font-medium text-blue-800 capitalize">
              {selectedComponent.type}
            </h3>
            <p className="text-xs text-blue-600 mt-1">
              ID: {selectedComponent.id}
            </p>
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
        </>
      )}
    </div>
  );
};

export default PropertyPanel;

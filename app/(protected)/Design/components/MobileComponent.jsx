"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef } from "react";
import { useJeebContext } from "@/app/context/JeebContext";
import {
  renderImageRow,
  renderSubHeaderGrid,
  renderSubBodyGrid,
  renderProductsGrid,
  renderBanner,
  renderVideoText,
  renderImageText,
  renderBodyHalf,
  renderBodyPlain,
  renderBodyRound,
  renderBrands,
  renderSubCategBrands,
} from "./MobileComponentRenderers";

const MobileComponent = ({
  component,
  isSelected,
  onUpdate,
  onDelete,
  isPreview = false,
}) => {
  const bannerAutoPlayRef = useRef(component.props.autoPlay);
  const bannerIntervalRef = useRef(component.props.interval);
  const bodyPlainAutoPlayRef = useRef(component.props.autoPlay);
  const bodyPlainIntervalRef = useRef(component.props.interval);
  const {
    handleComponentClick,
    updateComponentNavigation,
    updateImageNavigation,
    updateProductNavigation,
    updateItemNavigation,
    allowEditModeNavigation,
  } = useJeebContext();

  // Handle image click
  const handleImageClick = (componentId, imageIndex, targetPageId, enabled) => {
    if (!allowEditModeNavigation) return;
    console.log(
      "handleImageClick.......componentId, imageIndex, targetPageId, enabled",
      componentId,
      imageIndex,
      targetPageId,
      enabled
    );
    handleComponentClick(componentId, {
      type: "image",
      index: imageIndex,
    });
    // Set navigation for an image
    updateImageNavigation(componentId, imageIndex, targetPageId, enabled);
  };

  // Handle item click
  const handleItemClick = (componentId, itemIndex, targetPageId, enabled) => {
    if (!allowEditModeNavigation) return;
    console.log(
      "handleItemClick.......componentId, imageIndex, targetPageId, enabled",
      componentId,
      itemIndex,
      targetPageId,
      enabled
    );
    handleComponentClick(componentId, {
      type: "item",
      index: itemIndex,
    });
    // Set navigation for an item
    updateItemNavigation(componentId, itemIndex, targetPageId, enabled);
  };

  // Handle product click
  const handleProductClick = (
    componentId,
    productIndex,
    targetPageId,
    enabled
  ) => {
    if (!allowEditModeNavigation) return;
    handleComponentClick(componentId, {
      type: "product",
      index: productIndex,
    });
    // Set navigation for a product
    updateProductNavigation(componentId, productIndex, targetPageId, enabled);
  };

  // Handle component click
  const handleClick = (componentId, targetPageId, enabled) => {
    console.log("handle click", componentId, targetPageId, enabled);
    if (!allowEditModeNavigation) return;
    handleComponentClick(componentId, {
      type: "component",
    });
    // Set navigation for component
    updateComponentNavigation(componentId, targetPageId, enabled);
  };

  // Keep refs in sync with latest props at runtime
  useEffect(() => {
    bannerAutoPlayRef.current = component.props.autoPlay;
    bannerIntervalRef.current = component.props.interval;
    // If autoplay is turned off, clear timeout immediately
    if (!component.props.autoPlay) {
      if (bannerSliderRef.current) {
        bannerSliderRef.current.slides && clearTimeout(timeoutId.current);
      }
    } else {
      // If turned on, restart autoplay right away
      if (bannerSliderRef.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
          bannerSliderRef.current.next();
        }, component.props.interval || 3000);
      }
    }
  }, [component.props.autoPlay, component.props.interval]);

  useEffect(() => {
    bodyPlainAutoPlayRef.current = component.props.autoPlay;
    bodyPlainIntervalRef.current = component.props.interval;
    // If autoplay is turned off, clear timeout immediately
    if (!component.props.autoPlay) {
      if (bodyPlainSliderRef.current) {
        bodyPlainSliderRef.current.slides && clearTimeout(timeoutId.current);
      }
    } else {
      // If turned on, restart autoplay right away
      if (bodyPlainSliderRef.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(() => {
          bodyPlainSliderRef.current.next();
        }, component.props.interval || 3000);
      }
    }
  }, [component.props.autoPlay, component.props.interval]);

  const [bannerSliderRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 10,
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        const clearBannerTimeout = () => clearTimeout(timeout);

        const setBannerTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver || !bannerAutoPlayRef.current) return;

          timeout = setTimeout(() => {
            slider.next();
          }, bannerIntervalRef.current || 3000);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearBannerTimeout();
          });

          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            setBannerTimeout();
          });

          setBannerTimeout();
        });

        slider.on("dragStarted", clearBannerTimeout);
        slider.on("animationEnded", setBannerTimeout);
        slider.on("updated", setBannerTimeout);
      },
    ]
  );

  const [bodyPlainSliderRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 1,
        spacing: 10,
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        const clearBodyPlainTimeout = () => clearTimeout(timeout);

        const setBodyPlainTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver || !bodyPlainAutoPlayRef.current) return;

          timeout = setTimeout(() => {
            slider.next();
          }, bodyPlainIntervalRef.current || 3000);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearBodyPlainTimeout();
          });

          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            setBodyPlainTimeout();
          });

          setBodyPlainTimeout();
        });

        slider.on("dragStarted", clearBodyPlainTimeout);
        slider.on("animationEnded", setBodyPlainTimeout);
        slider.on("updated", setBodyPlainTimeout);
      },
    ]
  );

  const [bodyRoundSliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "free-snap",
      slides: {
        perView: 1,
        spacing: 15,
      },
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;

        const clearBodyPlainTimeout = () => clearTimeout(timeout);

        const setBodyPlainTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver || !bodyPlainAutoPlayRef.current) return;

          timeout = setTimeout(() => {
            slider.next();
          }, bodyPlainIntervalRef.current || 3000);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearBodyPlainTimeout();
          });

          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            setBodyPlainTimeout();
          });

          setBodyPlainTimeout();
        });

        slider.on("dragStarted", clearBodyPlainTimeout);
        slider.on("animationEnded", setBodyPlainTimeout);
        slider.on("updated", setBodyPlainTimeout);
      },
    ]
  );

  const [subCategBrandsSliderRef] = useKeenSlider({
    slides: {
      perView: 2,
      spacing: 15,
    },
    perMove: 2,
    mode: "snap",
  });

  const [brandsSliderRef] = useKeenSlider({
    slides: {
      perView: 2,
      spacing: 15,
    },
    perMove: 2,
    mode: "snap",
  });

  const [bodyHalfSliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 15,
    },
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(component.id);
  };

  const renderComponent = () => {
    const commonProps = {
      component,
      handleImageClick,
      handleItemClick,
      handleProductClick,
      handleClick,
    };

    switch (component.type) {
      case "banner":
        return renderBanner({
          ...commonProps,
          bannerSliderRef,
        });

      case "imageRow":
        return renderImageRow(commonProps);

      case "subHeaderGrid":
        return renderSubHeaderGrid(commonProps);

      case "subBodyGrid":
        return renderSubBodyGrid(commonProps);

      case "videoText":
        return renderVideoText(commonProps);

      case "imageText":
        return renderImageText(commonProps);

      case "bodyHalf":
        return renderBodyHalf({
          ...commonProps,
          bodyHalfSliderRef,
        });

      case "bodyPlain":
        return renderBodyPlain({
          ...commonProps,
          bodyPlainSliderRef,
        });

      case "bodyRound":
        return renderBodyRound({
          ...commonProps,
          bodyRoundSliderRef,
        });

      case "brands":
        return renderBrands({
          ...commonProps,
          brandsSliderRef,
        });

      case "subCategBrands":
        return renderSubCategBrands({
          ...commonProps,
          subCategBrandsSliderRef,
        });

      case "productsGrid":
        return renderProductsGrid(commonProps);

      default:
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">
              Unknown component type: {component.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      {renderComponent()}

      {/* Delete button - only show when selected and not in preview */}
      {isSelected && !isPreview && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
        >
          ×
        </button>
      )}

      {/* Selection indicator - only show when not in preview */}
      {isSelected && !isPreview && (
        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          {component.type}
        </div>
      )}
    </div>
  );
};

export default MobileComponent;

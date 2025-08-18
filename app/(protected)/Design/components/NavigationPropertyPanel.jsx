import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Link,
  ExternalLink,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useJeebContext } from "@/app/context/JeebContext";
import { PageCombobox } from "./PageCombobox";

const NavigationPropertyPanel = ({ selectedComponent }) => {
  const {
    pages,
    currentPageId,
    updateImageNavigation,
    updateItemNavigation,
    updateProductNavigation,
    updateComponentNavigation,
    allowEditModeNavigation,
    setAllowEditModeNavigation,
  } = useJeebContext();

  const [expandedSections, setExpandedSections] = useState({});

  if (!selectedComponent) {
    return (
      <div className="p-4 bg-gray-50 border-l border-gray-200">
        <p className="text-gray-500 text-sm">
          Select a component to configure navigation
        </p>
      </div>
    );
  }

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const availablePages = pages.filter((page) => page.id !== currentPageId);

  // Component has direct navigation (videoText, imageText)
  const hasDirectNavigation = ["videoText", "imageText"].includes(
    selectedComponent.type
  );

  // Component has image-based navigation
  const hasImageNavigation = [
    "banner",
    "bodyHalf",
    "bodyPlain",
    "bodyRound",
    "brands",
    "subCategBrands",
  ].includes(selectedComponent.type);

  // Component has item-based navigation
  const hasItemNavigation = [
    "imageRow",
    "subHeaderGrid",
    "subBodyGrid",
  ].includes(selectedComponent.type);

  // Component has product-based navigation
  const hasProductNavigation = ["productsGrid"].includes(
    selectedComponent.type
  );

  const renderPageSelect = (value, onChange, disabled = false) => (
    <PageCombobox
      value={value}
      onChange={onChange}
      availablePages={availablePages}
      disabled={disabled}
    />
  );

  const renderToggle = (enabled, onChange) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
        enabled
          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {enabled ? (
        <ToggleRight className="w-4 h-4" />
      ) : (
        <ToggleLeft className="w-4 h-4" />
      )}
      {/* {enabled ? "Enabled" : "Disabled"} */}
    </button>
  );

  const renderDirectNavigation = () => {
    const navigation = selectedComponent.props.navigation || {
      enabled: false,
      targetPageId: null,
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Component Navigation
          </span>
          {renderToggle(navigation.enabled, (enabled) =>
            updateComponentNavigation(
              selectedComponent.id,
              navigation.targetPageId,
              enabled
            )
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Target Page
          </label>
          {renderPageSelect(
            navigation.targetPageId,
            (targetPageId) =>
              updateComponentNavigation(
                selectedComponent.id,
                targetPageId,
                navigation.enabled
              ),
            !navigation.enabled
          )}
        </div>

        {/* {navigation.enabled && navigation.targetPageId && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <ArrowRight className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">
              Clicks will navigate to:{" "}
              <strong>
                {pages.find((p) => p.id === navigation.targetPageId)?.name}
              </strong>
            </span>
          </div>
        )} */}
      </div>
    );
  };

  const renderImageNavigation = () => {
    const images = selectedComponent.props.images || [];
    const imageNavigation = selectedComponent.props.imageNavigation || [];

    if (images.length === 0) {
      return (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            Add images to configure navigation
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Image Navigation
          </span>
        </div>

        <div className="space-y-3">
          {images.map((image, index) => {
            const navConfig = imageNavigation.find(
              (nav) => nav.imageIndex === index
            ) || { enabled: false, targetPageId: null };

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-8 h-8 object-cover rounded border"
                    />
                    <span className="text-sm font-medium">
                      Image {index + 1}
                    </span>
                  </div>
                  {renderToggle(navConfig.enabled, (enabled) =>
                    updateImageNavigation(
                      selectedComponent.id,
                      index,
                      navConfig.targetPageId,
                      enabled
                    )
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Target Page
                  </label>
                  {renderPageSelect(
                    navConfig.targetPageId,
                    (targetPageId) =>
                      updateImageNavigation(
                        selectedComponent.id,
                        index,
                        targetPageId,
                        navConfig.enabled
                      ),
                    !navConfig.enabled
                  )}
                </div>

                {/* {navConfig.enabled && navConfig.targetPageId && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md mt-2">
                    <ExternalLink className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">
                      →{" "}
                      {pages.find((p) => p.id === navConfig.targetPageId)?.name}
                    </span>
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderItemNavigation = () => {
    const items = selectedComponent.props.items || [];

    if (items.length === 0) {
      return (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            No items to configure navigation
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Item Navigation
          </span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item, index) => {
            const navConfig = item.navigation || {
              enabled: false,
              targetPageId: null,
            };

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-white"
              >
                <div className="flex flex-col items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col justify-items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {index + 1} #
                        </span>
                        {renderToggle(navConfig.enabled, (enabled) =>
                          updateItemNavigation(
                            selectedComponent.id,
                            index,
                            navConfig.targetPageId,
                            enabled
                          )
                        )}
                      </div>
                      <div className="flex items-start gap-2 py-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.text}
                            className="w-8 h-8 object-cover rounded border"
                          />
                        )}
                        {item.text && (
                          <p className="text-md text-gray-500 ">{item.text}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Target Page
                  </label>
                  {renderPageSelect(
                    navConfig.targetPageId,
                    (targetPageId) =>
                      updateItemNavigation(
                        selectedComponent.id,
                        index,
                        targetPageId,
                        navConfig.enabled
                      ),
                    !navConfig.enabled
                  )}
                </div>

                {navConfig.enabled && navConfig.targetPageId && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md mt-2">
                    <ExternalLink className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">
                      →{" "}
                      {pages.find((p) => p.id === navConfig.targetPageId)?.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProductNavigation = () => {
    const products = selectedComponent.props.products || [];
    const productNavigation = selectedComponent.props.productNavigation || [];

    if (products.length === 0) {
      return (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            Add products to configure navigation
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Product Navigation
          </span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {products.map((product, index) => {
            const navConfig = productNavigation.find(
              (nav) => nav.productIndex === index
            ) || { enabled: false, targetPageId: null };

            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-white"
              >
                <div className="flex flex-col items-start mb-3">
                  <div className="flex items-center gap-2">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded border"
                      />
                    )}
                    <div className="flex flex-col justify-items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {index + 1} #
                        </span>
                        {renderToggle(navConfig.enabled, (enabled) =>
                          updateProductNavigation(
                            selectedComponent.id,
                            index,
                            navConfig.targetPageId,
                            enabled
                          )
                        )}
                      </div>
                      {product.name && (
                        <p className="text-md text-gray-500 ">{product.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Target Page
                  </label>
                  {renderPageSelect(
                    navConfig.targetPageId,
                    (targetPageId) =>
                      updateProductNavigation(
                        selectedComponent.id,
                        index,
                        targetPageId,
                        navConfig.enabled
                      ),
                    !navConfig.enabled
                  )}
                </div>

                {/* {navConfig.enabled && navConfig.targetPageId && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md mt-2">
                    <ExternalLink className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-700">
                      →{" "}
                      {pages.find((p) => p.id === navConfig.targetPageId)?.name}
                    </span>
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNavigationSection = (title, content, sectionId) => {
    const isExpanded = expandedSections[sectionId];

    return (
      <div className="border border-gray-200 rounded-lg bg-white">
        <button
          onClick={() => toggleSection(sectionId)}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {isExpanded && <div className="px-3 pb-3">{content}</div>}
      </div>
    );
  };

  if (availablePages.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border-l border-gray-200">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            Create additional pages to enable navigation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border-l border-gray-200 h-full overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          Navigation Settings
        </h3>
        <p className="text-sm text-gray-600">
          Configure click navigation for{" "}
          <strong>{selectedComponent.type}</strong> component
        </p>
      </div>

      <div className="space-y-3">
        {hasDirectNavigation &&
          renderNavigationSection(
            "Component Click",
            renderDirectNavigation(),
            "direct"
          )}

        {hasImageNavigation &&
          renderNavigationSection(
            "Image Navigation",
            renderImageNavigation(),
            "images"
          )}

        {hasItemNavigation &&
          renderNavigationSection(
            "Item Navigation",
            renderItemNavigation(),
            "items"
          )}

        {hasProductNavigation &&
          renderNavigationSection(
            "Product Navigation",
            renderProductNavigation(),
            "products"
          )}
      </div>
      {/* Allow navigation in edit mode */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          Allow Edit Mode navigation
        </h4>
        <div className="flex items-center space-x-2">
          <Switch
            id="allow-navigation"
            checked={allowEditModeNavigation}
            onCheckedChange={setAllowEditModeNavigation}
            className="data-[state=checked]:bg-blue-800"
          />
          <Label
            htmlFor="allow-navigation"
            className="text-sm font-medium text-blue-800"
          >
            On/Off
          </Label>
        </div>
      </div>
      {/* Navigation Summary */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          Navigation Summary
        </h4>
        <div className="text-xs text-blue-700 space-y-1">
          {hasDirectNavigation &&
            selectedComponent.props.navigation?.enabled && (
              <div>✓ Component has click navigation enabled</div>
            )}
          {hasImageNavigation &&
            selectedComponent.props.imageNavigation?.some(
              (nav) => nav.enabled
            ) && (
              <div>
                ✓{" "}
                {
                  selectedComponent.props.imageNavigation.filter(
                    (nav) => nav.enabled
                  ).length
                }{" "}
                image(s) with navigation
              </div>
            )}
          {hasItemNavigation &&
            selectedComponent.props.items?.some(
              (item) => item.navigation?.enabled
            ) && (
              <div>
                ✓{" "}
                {
                  selectedComponent.props.items.filter(
                    (item) => item.navigation?.enabled
                  ).length
                }{" "}
                item(s) with navigation
              </div>
            )}
          {hasProductNavigation &&
            selectedComponent.props.productNavigation?.some(
              (nav) => nav.enabled
            ) && (
              <div>
                ✓{" "}
                {
                  selectedComponent.props.productNavigation.filter(
                    (nav) => nav.enabled
                  ).length
                }{" "}
                product(s) with navigation
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NavigationPropertyPanel;

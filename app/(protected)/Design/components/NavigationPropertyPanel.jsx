import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Link,
  Tag,
  Folder,
  Package,
  ExternalLink,
  ArrowRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useJeebContext } from "@/app/context/JeebContext";
import { PageCombobox } from "./PageCombobox";
import NavigationTypeSelection from "./NavigationTypeSelection";
import ProductSelectorDialog from "../../products/ProductSelectorDialog";

const NavigationPropertyPanel = ({
  selectedComponent,
  itemNavigationUpdate,
  // selectedNavOption,
  // setSelectedNavOption,
}) => {
  const {
    pages,
    currentPageId,
    updateImageNavigation,
    updateItemNavigation,
    updateProductNavigation,
    updateComponentNavigation,
    allowEditModeNavigation,
    setAllowEditModeNavigation,
    updateNavigationTarget,
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

  const renderPageSelect = (value, onChange, navigation = "SubCategory") => (
    <PageCombobox
      value={value}
      onChange={onChange}
      availablePages={availablePages}
      disabled={navigation === "SubCategory" ? false : true}
    />
  );

  const renderDirectNavigation = () => {
    const navigation = selectedComponent.props.navigation || {
      id: false,
      enabled: false,
      navigation: null,
      targetPageId: null,
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Component Navigation
          </span>
        </div>
        <NavigationTypeSelection
          navigation={navigation?.navigation || "SubCategory"}
          itemNavigationUpdate={itemNavigationUpdate}
          componentId={selectedComponent.id}
          itemId={navigation?.id}
        />
        {navigation?.navigation === "SubCategory" ? (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Category Pages
            </label>
            {renderPageSelect(
              navigation.targetPageId,
              // (targetPageId) =>
              //   updateComponentNavigation(
              //     selectedComponent.id,
              //     targetPageId,
              //     navigation.enabled,
              //     navigation.navigation
              //   ),
              (targetPageId) =>
                updateNavigationTarget(
                  selectedComponent.id,
                  targetPageId,
                  navigation?.id
                ),
              navigation.navigation
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Products & Filters
            </label>
            <ProductSelectorDialog
              componentId={selectedComponent.id}
              itemId={navigation?.id}
            />
          </div>
        )}
        {navigation?.navigation === "AllProducts" &&
          navigation?.targetPageId && (
            <div className="flex flex-col gap-3 p-3 border border-gray-200 rounded-md mt-2">
              {/* Products count */}
              {navigation?.products?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">
                      Selected Products:
                    </span>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300">
                    {navigation.products.length}
                  </span>
                </div>
              )}

              {/* Tags */}
              {navigation?.tags?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag size={16} className="text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">
                      Tags:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {navigation.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {navigation?.categories?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Folder size={16} className="text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">
                      Categories
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {navigation.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
            const navConfig = imageNavigation[index] || {
              id: false,
              enabled: false,
              navigation: false,
              targetPageId: null,
            };

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
                </div>
                <NavigationTypeSelection
                  navigation={navConfig?.navigation || "SubCategory"}
                  itemNavigationUpdate={itemNavigationUpdate}
                  componentId={selectedComponent.id}
                  itemId={navConfig?.id}
                />
                {navConfig?.navigation === "SubCategory" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Category Pages
                    </label>
                    {renderPageSelect(
                      navConfig.targetPageId,
                      // (targetPageId) =>
                      // updateImageNavigation(
                      //   selectedComponent.id,
                      //   index,
                      //   targetPageId,
                      //   navConfig.enabled,
                      //   navConfig.navigation
                      // ),
                      (targetPageId) =>
                        updateNavigationTarget(
                          selectedComponent.id,
                          targetPageId,
                          navConfig?.id
                        ),
                      navConfig.navigation
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Products & Filters
                    </label>
                    <ProductSelectorDialog
                      componentId={selectedComponent.id}
                      itemId={navConfig?.id}
                    />
                  </div>
                )}
                {navConfig?.navigation === "AllProducts" &&
                  navConfig?.targetPageId && (
                    <div className="flex flex-col gap-3 p-3 border border-gray-200 rounded-md mt-2">
                      {/* Products count */}
                      {navConfig?.products?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Selected Products:
                            </span>
                          </div>
                          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300">
                            {navConfig.products.length}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {navConfig?.tags?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Tag size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Tags:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {navConfig.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categories */}
                      {navConfig?.categories?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Folder size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Categories
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {navConfig.categories.map((cat) => (
                              <span
                                key={cat.id}
                                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
              id: false,
              enabled: false,
              navigation: null,
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
                <NavigationTypeSelection
                  navigation={navConfig?.navigation || "SubCategory"}
                  itemNavigationUpdate={itemNavigationUpdate}
                  componentId={selectedComponent.id}
                  itemId={navConfig?.id}
                />
                {navConfig?.navigation === "SubCategory" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Category Pages
                    </label>
                    {renderPageSelect(
                      navConfig.targetPageId,
                      // (targetPageId) =>
                      // updateItemNavigation(
                      //   selectedComponent.id,
                      //   index,
                      //   targetPageId,
                      //   navConfig.enabled,
                      //   navConfig.navigation
                      // ),
                      (targetPageId) =>
                        updateNavigationTarget(
                          selectedComponent.id,
                          targetPageId,
                          navConfig?.id
                        ),
                      navConfig.navigation
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Products & Filters
                    </label>
                    <ProductSelectorDialog
                      componentId={selectedComponent.id}
                      itemId={navConfig?.id}
                    />
                  </div>
                )}

                {navConfig?.navigation === "AllProducts" &&
                  navConfig?.targetPageId && (
                    <div className="flex flex-col gap-3 p-3 border border-gray-200 rounded-md mt-2">
                      {/* Products count */}
                      {navConfig?.products?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Selected Products:
                            </span>
                          </div>
                          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300">
                            {navConfig.products.length}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {navConfig?.tags?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Tag size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Tags:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {navConfig.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categories */}
                      {navConfig?.categories?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Folder size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Categories
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {navConfig.categories.map((cat) => (
                              <span
                                key={cat.id}
                                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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
            const navConfig = productNavigation[index] || {
              enabled: false,
              navigation: null,
              targetPageId: null,
            };

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
                      </div>
                      {product.name && (
                        <p className="text-md text-gray-500 ">{product.name}</p>
                      )}
                    </div>
                  </div>
                </div>
                <NavigationTypeSelection
                  navigation={navConfig?.navigation || "SubCategory"}
                  itemNavigationUpdate={itemNavigationUpdate}
                  selectedComponent={selectedComponent}
                />
                {navConfig?.navigation === "SubCategory" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Category Pages
                    </label>
                    {renderPageSelect(
                      navConfig.targetPageId,
                      // (targetPageId) =>
                      //   updateProductNavigation(
                      //     selectedComponent.id,
                      //     index,
                      //     targetPageId,
                      //     navConfig.enabled,
                      //     navConfig.navigation
                      //   ),
                      (targetPageId) =>
                        updateNavigationTarget(
                          selectedComponent.id,
                          targetPageId,
                          navConfig?.id
                        ),
                      navConfig.navigation
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Products & Filters
                    </label>
                    <ProductSelectorDialog />
                  </div>
                )}
                {navConfig?.navigation === "AllProducts" &&
                  navConfig?.targetPageId && (
                    <div className="flex flex-col gap-3 p-3 border border-gray-200 rounded-md mt-2">
                      {/* Products count */}
                      {navConfig?.products?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Selected Products:
                            </span>
                          </div>
                          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300">
                            {navConfig.products.length}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {navConfig?.tags?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Tag size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Tags:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {navConfig.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Categories */}
                      {navConfig?.categories?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Folder size={16} className="text-blue-500" />
                            <span className="text-sm font-medium text-blue-500">
                              Categories
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {navConfig.categories.map((cat) => (
                              <span
                                key={cat.id}
                                className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-500 border border-blue-300"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
        <h4 className="text-sm font-medium text-blue-500 mb-2">
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
            className="text-sm font-medium text-blue-500"
          >
            On/Off
          </Label>
        </div>
      </div>
      {/* Navigation Summary */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-500 mb-2">
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

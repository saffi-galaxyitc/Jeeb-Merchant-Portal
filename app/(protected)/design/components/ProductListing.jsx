"use client";
import React, { useState } from "react";
import {
  Grid3x3,
  List,
  Heart,
  Plus,
  Star,
  Truck,
  ChevronDown,
} from "lucide-react";
import { useJeebContext } from "@/app/context/JeebContext";
import MobileNavBar from "./MobileNavBar";
import { HashLoader } from "react-spinners";

const ProductListing = ({ component }) => {
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState({});
  const [showTagFilters, setShowTagFilters] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { goBack, loadingProducts } = useJeebContext();

  // Extract data from component
  const { data } = component;
  const {
    products = [],
    category_ids = [],
    tag_ids = [],
    gridTitle = "Products",
    count = 0,
  } = data;

  // Filter products based on selected category and tags
  const filteredProducts = products.filter((product) => {
    // Category filter (if implemented on product level)
    if (selectedCategory && selectedCategory !== "All") {
      // Assuming products have category info - adjust based on your data structure
      return true; // Placeholder - implement category filtering logic
    }

    // Tag filter (if implemented on product level)
    const tagFilters = Object.entries(selectedTags);
    if (tagFilters.length > 0) {
      // Implement tag filtering logic based on your requirements
      return true; // Placeholder
    }

    return true;
  });

  const handleProductClick = (productId) => {
    console.log("Product clicked:", productId);
  };

  const handleTagValueChange = (tagId, valueId, checked) => {
    setSelectedTags((prev) => ({
      ...prev,
      [tagId]: {
        ...prev[tagId],
        [valueId]: checked,
      },
    }));
  };

  const ProductImagePlaceholder = () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-1 flex items-center justify-center">
          <Plus className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product, isListView }) => {
    const hasDiscount =
      product.pricelist_price && product.pricelist_price !== product.list_price;
    const displayPrice = hasDiscount
      ? product.pricelist_price
      : product.list_price;
    const isOutOfStock = product.qty_available === 0;

    if (isListView) {
      return (
        <div
          onClick={() => handleProductClick(product.id)}
          className="bg-white border border-gray-200 p-4 flex items-center space-x-4 cursor-pointer hover:shadow-sm transition-shadow duration-200 relative"
        >
          {/* Stock Status Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
              Out of stock
            </div>
          )}

          {/* Product Image */}
          <div className="w-16 h-16 flex-shrink-0 relative">
            {product.image ? (
              <img
                src={`${BASE_URL}${product.image}`}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <ProductImagePlaceholder />
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            {/* Rating */}
            <div className="flex items-center mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">
                {product.rating_avg || 0} ({product.rating_count || 0})
              </span>
            </div>

            {/* Product Name */}
            <h3 className="text-sm font-medium text-black mb-2 leading-tight">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-semibold text-red-600">
                    SAR {displayPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    SAR {product.list_price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-semibold text-gray-900">
                  SAR {product.list_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Express Badge - show if in stock */}
            {!isOutOfStock && (
              <div className="flex items-center mt-2">
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Truck className="w-3 h-3 mr-1" />
                  Express
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end space-y-2">
            <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 cursor-pointer transition-colors duration-200" />
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    // Grid View
    return (
      <div
        onClick={() => handleProductClick(product.id)}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-200 relative"
      >
        {/* Stock Status Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
            Out of stock
          </div>
        )}

        {/* Heart Icon */}
        <div className="flex justify-end mb-2">
          <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 cursor-pointer transition-colors duration-200" />
        </div>

        {/* Product Image */}
        <div className="w-full h-32 mb-3">
          {product.image ? (
            <img
              src={`${BASE_URL}${product.image}`}
              alt={product.name}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <ProductImagePlaceholder />
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 ml-1">
            {product.rating_avg || 0} ({product.rating_count || 0})
          </span>
        </div>

        {/* Product Name */}
        <h4 className="text-sm font-medium text-black mb-2 line-clamp-2 flex-1">
          {product.name}
        </h4>

        {/* Price Section */}
        <div className="mb-2">
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-red-600">
                SAR {displayPrice.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 line-through">
                SAR {product.list_price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-gray-900">
              SAR {product.list_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Express Badge */}
        {!isOutOfStock && (
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Truck className="w-3 h-3 mr-1" />
              Express
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-full transition-colors duration-200 flex items-center justify-center">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className={`${
          loadingProducts ? "flex flex-col items-center justify-center" : ""
        } min-h-screen bg-gray-50`}
      >
        {/* Loader */}
        {loadingProducts ? (
          <div className="flex flex-col items-center space-y-4">
            <HashLoader color="oklch(62.3% 0.214 259.815)" size={50} />
            <p className="text-sm font-medium">Loading products...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <MobileNavBar goBack={goBack} title={gridTitle} />

            {/* Category Filter */}
            <div className="bg-white px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-black">Category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 flex-1 max-w-xs"
                >
                  <option value="">All Categories</option>
                  {category_ids.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tag Filters */}
            {tag_ids.length > 0 && (
              <div className="bg-white px-4 py-3 border-b border-gray-200">
                <button
                  onClick={() => setShowTagFilters(!showTagFilters)}
                  className="flex items-center justify-between w-full text-sm font-medium text-black"
                >
                  <span>Filters</span>
                  <ChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      showTagFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showTagFilters && (
                  <div className="mt-3 space-y-4">
                    {tag_ids.map((tag) => (
                      <div key={tag.id}>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {tag.name}
                        </h4>
                        <div className="space-y-1">
                          {tag.values.map((value) => (
                            <label
                              key={value.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedTags[tag.id]?.[value.id] || false
                                }
                                onChange={(e) =>
                                  handleTagValueChange(
                                    tag.id,
                                    value.id,
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 text-blue-500 rounded"
                              />
                              <span className="text-sm text-gray-600">
                                {value.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Results Header and View Toggle */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <span className="text-gray-600 text-sm">
                {filteredProducts.length} Result
                {filteredProducts.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products List/Grid */}
            <div className="p-4 pb-20">
              {viewMode === "list" ? (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isListView={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isListView={false}
                    />
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductListing;

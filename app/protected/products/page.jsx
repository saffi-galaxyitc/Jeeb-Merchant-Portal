"use client";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  getProductDetails,
  getProducts,
  getTags,
} from "@/DAL/products";
import { debounce } from "lodash";
import { CategoryCombobox } from "./CategoryCombobox";
import HierarchicalTagSelector from "./HierarchicalTagSelector";
import { useProduct } from "@/app/mainContext/ProductContext";

const sortOptions = [
  { value: "name asc", label: "Name (A-Z)" },
  { value: "name desc", label: "Name (Z-A)" },
  { value: "list_price asc", label: "Price (Low to High)" },
  { value: "list_price desc", label: "Price (High to Low)" },
  { value: "qty_available asc", label: "Quantity (Low to High)" },
  { value: "qty_available desc", label: "Quantity (High to Low)" },
];

export default function ProductsPage() {
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  //product states
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  // Enhanced selection states
  const [selectedProducts, setSelectedProducts] = useState(new Set()); // Using Set for better performance
  const [selectAllPages, setSelectAllPages] = useState(false); // Track if all pages are selected
  const [selectAllCurrentPage, setSelectAllCurrentPage] = useState(false); // Track if current page is selected
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  //category states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  //tag states
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  //pagination and sorting states
  const [sortOrder, setSortOrder] = useState("list_price desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  //url and route
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  //product context
  const { removeProduct, setLoadingProduct } = useProduct();

  //////*******************Tag Start******************///////
  // Fetch tags from API
  const fetchTags = useCallback(async (query = "") => {
    setLoadingTags(true);
    try {
      const response = await getTags({
        payload: { limit: 20, offset: 0, query },
      });

      const result = response?.data?.result;
      if (result?.code === 200) {
        setTags(result.result || []);
      } else {
        setTags([]);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTags([]);
    } finally {
      setLoadingTags(false);
    }
  }, []);
  // Initial fetch tags
  useEffect(() => {
    fetchTags();
  }, [fetchTags]);
  // Handle search input
  const handleSearchChange = (value) => {
    setTagSearchTerm(value);
  };
  //////*******************Tag End******************///////

  //////*******************Category Start******************///////
  // Fetch categories from API
  const fetchCategories = useCallback(async (query = "") => {
    setLoadingCategory(true);
    try {
      const response = await getCategories({
        payload: { limit: 20, offset: 0, query },
      });

      const result = response?.data?.result;
      if (result?.code === 200) {
        setCategories(result.result || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategory(false);
    }
  }, []);
  // Debounced search
  const debouncedFetch = useCallback(
    debounce((q) => {
      fetchCategories(q);
    }, 500),
    [fetchCategories]
  );
  useEffect(() => {
    if (categorySearchTerm) {
      debouncedFetch(categorySearchTerm);
    } else {
      fetchCategories();
    }
  }, [categorySearchTerm, debouncedFetch, fetchCategories]);
  //////*******************Category End******************///////

  //////*******************Products List Start******************///////
  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;

      const payload = {
        limit: itemsPerPage,
        offset: offset,
        query: debouncedSearchTerm || "",
        order: sortOrder,
        tag_ids: selectedTags ? selectedTags.map((tag) => tag.id) : [],
        category_ids: selectedCategory ? [parseInt(selectedCategory)] : [],
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
          price: product.price,
          discountPrice: product.discount,
          originalPrice: product.price,
          quantity: product.quantity,
          image: product.image
            ? `${BASE_URL}${product.image}`
            : "/placeholder.png",
        }));

        setProducts(transformedProducts);
        console.log("in fetch api products state", products);

        // Get total count from response metadata if available
        // Otherwise estimate based on returned data
        const totalCount =
          result.total_count ||
          result.count ||
          (transformedProducts.length < itemsPerPage
            ? offset + transformedProducts.length
            : currentPage * itemsPerPage + 1);

        setTotalProducts(totalCount);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    debouncedSearchTerm,
    selectedCategory,
    selectedTags,
    sortOrder,
  ]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Enhanced product selection handlers
  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(productId)) {
        newSelection.delete(productId);
      } else {
        newSelection.add(productId);
      }
      return newSelection;
    });
  };

  // Handle select all on current page
  const handleSelectCurrentPage = () => {
    setSelectedProducts((prev) => {
      const newSelection = new Set(prev);
      const currentPageProducts = products.map((p) => p.id);

      if (selectAllCurrentPage) {
        // Deselect current page products
        currentPageProducts.forEach((id) => newSelection.delete(id));
      } else {
        // Select current page products
        currentPageProducts.forEach((id) => newSelection.add(id));
      }

      return newSelection;
    });
  };

  // Handle select all pages
  const handleSelectAllPages = async () => {
    if (selectAllPages) {
      // Deselect all
      setSelectedProducts(new Set());
      setSelectAllPages(false);
    } else {
      // Select all products across all pages
      try {
        setLoading(true);

        // Fetch all product IDs with current filters
        const payload = {
          limit: totalProducts, // Get all products
          offset: 0,
          query: debouncedSearchTerm || "",
          order: sortOrder,
          tag_ids: selectedTags ? selectedTags.map((tag) => tag.id) : [],
          category_ids: selectedCategory ? [parseInt(selectedCategory)] : [],
          fields: ["id"], // Only fetch IDs for performance
        };

        const response = await getProducts({ payload });
        const result = response?.data?.result;

        if (result?.code === 200) {
          const allProductIds = result.result.map((product) => product.id);
          setSelectedProducts(new Set(allProductIds));
          setSelectAllPages(true);
        }
      } catch (error) {
        console.error("Error selecting all products:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedProducts(new Set());
    setSelectAllPages(false);
  };

  // Update selection states based on current products and selected items
  useEffect(() => {
    if (products.length === 0) {
      setSelectAllCurrentPage(false);
      return;
    }

    // If "select all pages" is active, current page is automatically selected
    if (selectAllPages) {
      setSelectAllCurrentPage(true);
      return;
    }

    const currentPageProductIds = products.map((p) => p.id);
    const selectedOnCurrentPage = currentPageProductIds.filter((id) =>
      selectedProducts.has(id)
    );

    // Update current page selection state
    setSelectAllCurrentPage(
      selectedOnCurrentPage.length === currentPageProductIds.length
    );
  }, [products, selectedProducts, selectAllPages]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change and clear selections if needed
  useEffect(() => {
    setCurrentPage(1);
    // Optionally clear selections when filters change
    // setSelectedProducts(new Set());
    // setSelectAllPages(false);
  }, [debouncedSearchTerm, selectedCategory, selectedTags, sortOrder]);
  //////*******************Products List End******************///////

  const handleProductClick = (id) => {
    console.log("product clicked", id);
    setLoadingProduct(true);

    if (id) {
      router.push(`/products/${id}`);
    } else {
      removeProduct();
      router.push(`/products/new`);
    }

    setLoadingProduct(false);
  };

  // Get sort icon
  const getSortIcon = (column) => {
    const currentSort = sortOrder.split(" ");
    const field = currentSort[0];
    const direction = currentSort[1];

    if (field === column) {
      return direction === "asc" ? (
        <ArrowUp className="w-4 h-4" />
      ) : (
        <ArrowDown className="w-4 h-4" />
      );
    }
    return <ArrowUpDown className="w-4 h-4" />;
  };

  // Handle column sort
  const handleSort = (column) => {
    const currentSort = sortOrder.split(" ");
    const currentField = currentSort[0];
    const currentDirection = currentSort[1];

    if (currentField === column) {
      const newDirection = currentDirection === "asc" ? "desc" : "asc";
      setSortOrder(`${column} ${newDirection}`);
    } else {
      setSortOrder(`${column} asc`);
    }
  };

  // Enhanced selection info
  const getSelectionInfo = () => {
    const selectedCount = selectedProducts.size;
    if (selectedCount === 0) return "No items selected";
    if (selectAllPages) return `All ${totalProducts} items selected`;
    return `${selectedCount} of ${totalProducts} items selected`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black px-6 py-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Products</h1>
          <p className="text-white-400">
            Select products by tags, category, or individually to feature them
            in your app.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Total: {totalProducts} products
          </p>
        </div>
        <Button
          className="bg-black px-6 py-4 text-white border-2 border-blue-600 text-lg font-medium cursor-pointer"
          onClick={() => handleProductClick(null)}
        >
          <Plus className="size-4 mr-2" />
          New Product
        </Button>
      </div>

      {/* Enhanced Selection Banner */}
      {selectedProducts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 px-6 py-3 mx-4 rounded-lg mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-blue-800 font-medium">
              {getSelectionInfo()}
            </span>
            {!selectAllPages &&
              selectedProducts.size > 0 &&
              totalProducts > selectedProducts.size && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllPages}
                  className="text-blue-600 border-blue-600"
                >
                  Select all {totalProducts} products
                </Button>
              )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllSelections}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4 mr-1" />
            Clear selection
          </Button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-gray-100 px-6 py-4 bg-white ml-4 rounded-tl-lg">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <HierarchicalTagSelector
              tags={tags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              searchTerm={tagSearchTerm}
              onSearchChange={handleSearchChange}
              onSearch={fetchTags}
              loading={loadingTags}
              placeholder="Search tags..."
              searchDebounceMs={500}
            />

            <CategoryCombobox
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setSearchTerm={setCategorySearchTerm}
              loading={loadingCategory}
            />
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-48 border border-1 border-gray-700 text-gray-700 bg-gray-100">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge
              variant="secondary"
              className="border border-1 border-gray-700 text-gray-700 bg-gray-100 h-9 px-4"
            >
              {getSelectionInfo()}
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 text-gray-700 bg-gray-100 border border-1 border-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white text-black ml-4 p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white text-black ml-4">
          <Table>
            <TableHeader className="bg-gray-100 border-t border-b border-gray-600 h-16">
              <TableRow className="text-lg">
                <TableHead className="w-12">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectAllCurrentPage}
                      onCheckedChange={handleSelectCurrentPage}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <span className="text-lg">
                      {selectAllPages ? "All" : "Page"}
                    </span>
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Product Name
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("list_price")}
                >
                  <div className="flex items-center gap-2">
                    Price
                    {getSortIcon("list_price")}
                  </div>
                </TableHead>
                <TableHead>Discounts</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("free_qty")}
                >
                  <div className="flex items-center gap-2">
                    Quantities
                    {getSortIcon("free_qty")}
                  </div>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.has(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => handleProductClick(product.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500 text-xs">IMG</span>
                          )}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    <TableCell className="font-semibold">
                      ${product.price}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          ${product.discountPrice}
                        </span>
                        {product.originalPrice !== product.discountPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {Math.floor(product.quantity)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="bg-white px-6 py-4 flex justify-center items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Show page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "secondary"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className={
                  currentPage === pageNum ? "bg-blue-600 hover:bg-blue-700" : ""
                }
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <span className="text-sm text-gray-600 ml-4">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

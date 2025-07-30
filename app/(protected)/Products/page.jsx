"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
// Sample product data
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Electronics",
    tag: "New Arrival",
    price: 999,
    discountPrice: 708,
    originalPrice: 999,
    quantity: 45,
    image: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Nike Air Max 270",
    category: "Footwear",
    tag: "Best Seller",
    price: 149,
    discountPrice: 120,
    originalPrice: 149,
    quantity: 20,
    image: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Galaxy S24 Ultra",
    category: "Electronics",
    tag: "Color Red",
    price: 1199,
    discountPrice: 1000,
    originalPrice: 89,
    quantity: 15,
    image: "/api/placeholder/40/40",
  },
  {
    id: 4,
    name: "Wooden Coffee Table",
    category: "Furniture",
    tag: "Featured",
    price: 89,
    discountPrice: 50,
    originalPrice: 199,
    quantity: 18,
    image: "/api/placeholder/40/40",
  },
  {
    id: 5,
    name: "Apple AirPods Pro",
    category: "Electronics",
    tag: "Discounted",
    price: 199,
    discountPrice: 80,
    originalPrice: 79,
    quantity: 10,
    image: "/api/placeholder/40/40",
  },
  {
    id: 6,
    name: "Levi's Denim Jacket",
    category: "Fashion",
    tag: "New Arrival",
    price: 79,
    discountPrice: 60,
    originalPrice: 899,
    quantity: 9,
    image: "/api/placeholder/40/40",
  },
  {
    id: 7,
    name: "Canon EOS R50",
    category: "Cameras",
    tag: "Top Rated",
    price: 899,
    discountPrice: 709,
    originalPrice: 59,
    quantity: 2,
    image: "/api/placeholder/40/40",
  },
  {
    id: 8,
    name: "Gaming Keyboard RGB",
    category: "Accessories",
    tag: "Flash Deal",
    price: 59,
    discountPrice: 43,
    originalPrice: 59,
    quantity: 12,
    image: "/api/placeholder/40/40",
  },
];

const categories = [
  "All",
  "Electronics",
  "Footwear",
  "Furniture",
  "Fashion",
  "Cameras",
  "Accessories",
];
const tags = [
  "All",
  "New Arrival",
  "Best Seller",
  "Featured",
  "Discounted",
  "Top Rated",
  "Flash Deal",
  "Color Red",
];

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();
  const itemsPerPage = 10;

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesTag = selectedTag === "All" || product.tag === selectedTag;
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle product selection
  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((product) => product.id));
    }
    setSelectAll(!selectAll);
  };
  const handleProductClick = async (id) => {
    console.log("product clicked");
    if (id) {
      router.push(`/products/${id}`);
    } else {
      router.push(`/products/new`);
    }
  };
  // Get tag color
  const getTagColor = (tag) => {
    const colors = {
      "New Arrival": "bg-blue-100 text-blue-800",
      "Best Seller": "bg-green-100 text-green-800",
      Featured: "bg-purple-100 text-purple-800",
      Discounted: "bg-red-100 text-red-800",
      "Top Rated": "bg-yellow-100 text-yellow-800",
      "Flash Deal": "bg-orange-100 text-orange-800",
      "Color Red": "bg-pink-100 text-pink-800",
    };
    return colors[tag] || "bg-gray-100 text-gray-800";
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
        </div>
        <Button
          className="bg-black px-6 py-4 text-white border-2 border-blue-600 text-lg font-medium cursor-pointer"
          onClick={() => handleProductClick(null)}
        >
          <Plus className="size-4 mr-2" />
          New Product
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-100 px-6 py-4 bg-white ml-4 rounded-tl-lg">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-40 border border-1 border-gray-700 text-gray-700 bg-gray-100">
                <SelectValue placeholder="By Tags" value={selectedTag} />
              </SelectTrigger>
              <SelectContent>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40 border border-1 border-gray-700 text-gray-700 bg-gray-100">
                <SelectValue
                  placeholder="By Category"
                  className="text-black-500"
                  value={selectedCategory}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge
              variant="secondary"
              className="border border-1 border-gray-700 text-gray-700 bg-gray-100 h-9 w-40"
            >
              Selected {selectedProducts.length} Items
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 text-gray-700 bg-gray-100 border border-1 border-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white text-black ml-4">
        <Table>
          <TableHeader className="bg-gray-100 border-t border-b border-gray-600 h-16">
            <TableRow className="text-lg">
              <TableHead className="w-12">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-lg">On page</span>
                </div>
              </TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discounts</TableHead>
              <TableHead>Quantities</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* <TableRow className="border-b">
              <TableCell colSpan={8} className="py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Select all
                </Button>
              </TableCell>
            </TableRow> */}
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleProductSelect(product.id)}
                  />
                </TableCell>
                <TableCell
                  onClick={() => handleProductClick(product.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-xs">IMG</span>
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Badge className={getTagColor(product.tag)}>
                    {product.tag}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  ${product.price}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      ${product.discountPrice}
                    </span>
                    <span className="text-gray-500 line-through text-sm">
                      ${product.originalPrice}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {product.quantity.toString().padStart(2, "0")}
                    </span>
                    {/* <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Delete
                      </Button>
                    </div> */}
                  </div>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-6 py-4 flex justify-center items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index + 1}
            variant={currentPage === index + 1 ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentPage(index + 1)}
            className={
              currentPage === index + 1 ? "bg-blue-600 hover:bg-blue-700" : ""
            }
          >
            {index + 1}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

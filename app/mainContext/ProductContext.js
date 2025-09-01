"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [product, setProductState] = useState({});
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Restore from localStorage once on mount
  useEffect(() => {
    const storedProduct = localStorage.getItem("productDetails");
    if (storedProduct) {
      try {
        setProductState(JSON.parse(storedProduct));
      } catch (error) {
        console.error("Error parsing productDetails:", error);
        localStorage.removeItem("productDetails");
      }
    }
  }, []);

  // ✅ Stable remove function
  const removeProduct = useCallback(() => {
    localStorage.removeItem("productDetails");
    setProductState({});
  }, []);

  // ✅ Stable set function
  const setProduct = useCallback(
    (product) => {
      console.log("setProduct", product);
      if (product) {
        localStorage.setItem("productDetails", JSON.stringify(product));
        setProductState(product);
      } else {
        removeProduct();
      }
    },
    [removeProduct] // depends only on removeProduct, which is stable
  );

  return (
    <ProductContext.Provider
      value={{
        product,
        setProduct,
        removeProduct,
        loadingProduct,
        setLoadingProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProduct = () => {
  return useContext(ProductContext);
};

import { useContext } from "react";
import ProductsContext from "../context/ProductsProvider";
import { type UseProductsContextType } from "../context/ProductsProvider";

// Custom hook to encapsulate and return the current Products context value
const useProducts = (): UseProductsContextType => {
  return useContext(ProductsContext);
};

export default useProducts;

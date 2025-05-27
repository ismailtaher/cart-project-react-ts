import { useContext } from "react";
import CartContext from "../context/CartProvider";
import { type UseCartContextType } from "../context/CartProvider";

// Custom hook to encapsulate and return the current cart context value
const useCart = (): UseCartContextType => {
  return useContext(CartContext);
};

export default useCart;

// Import required hooks and types from React
import { createContext, useMemo, useReducer, type ReactElement } from "react";

// Define the shape of a single cart item
export type CartItemType = {
  sku: string; // Unique identifier for the product
  name: string; // Product name
  price: number; // Product price
  qty: number; // Quantity added to cart
};

// Define the shape of the overall cart state
type CartStateType = { cart: CartItemType[] };

// Initial state for the cart - starts with an empty array
const initCartState: CartStateType = { cart: [] };

// Define the possible actions the reducer can handle
const REDUCER_ACTION_TYPE = {
  ADD: "ADD", // Add item to cart
  REMOVE: "REMOVE", // Remove item from cart
  QUANTITY: "QUANTITY", // Update item quantity
  SUBMIT: "SUBMIT", // Empty the cart after order
};

// Export the action type structure
export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

// Define the shape of a reducer action
export type ReducerAction = {
  type: string; // One of the defined action types
  payload?: CartItemType; // Optional payload containing item data
};

// Reducer function to handle cart actions
const reducer = (
  state: CartStateType,
  action: ReducerAction
): CartStateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload) {
        throw new Error("action.payload missing in ADD action");
      }

      const { sku, name, price } = action.payload;

      // Remove existing item with the same SKU
      const filteredCart = state.cart.filter((item) => item.sku !== sku);

      // Check if item already exists to increment quantity
      const itemExists = state.cart.find((item) => item.sku === sku);

      const qty = itemExists ? itemExists.qty + 1 : 1;

      return { ...state, cart: [...filteredCart, { sku, name, price, qty }] };
    }

    case REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) {
        throw new Error("action.payload missing in REMOVE action");
      }

      const { sku } = action.payload;

      // Remove the item from the cart
      const filteredCart = state.cart.filter((item) => item.sku !== sku);

      return { ...state, cart: [...filteredCart] };
    }

    case REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) {
        throw new Error("action.payload missing in QUANTITY action");
      }

      const { sku, qty } = action.payload;

      // Ensure item exists before updating quantity
      const itemExists = state.cart.find((item) => item.sku === sku);

      if (!itemExists) {
        throw new Error("Item must exist in order to update quantity");
      }

      // Update item quantity
      const updateditem = { ...itemExists, qty };

      // Remove old item and add updated item
      const filteredCart = state.cart.filter((item) => item.sku !== sku);

      return { ...state, cart: [...filteredCart, updateditem] };
    }

    case REDUCER_ACTION_TYPE.SUBMIT: {
      // Clear the cart after order is submitted
      return { ...state, cart: [] };
    }

    default:
      throw new Error("Unidentified reducer action type");
  }
};

// Custom hook to provide cart-related logic
const useCartContext = (initCartState: CartStateType) => {
  // useReducer handles all cart state updates
  const [state, dispatch] = useReducer(reducer, initCartState);

  // Memoize the action types to avoid re-creating on every render
  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);

  // Calculate total items in the cart
  const totalItems = state.cart.reduce((prev, item) => prev + item.qty, 0);

  // Calculate total price in USD format
  const totalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(state.cart.reduce((prev, item) => prev + item.qty * item.price, 0));

  // Sort cart items by last 4 digits of SKU (e.g., "item0010" -> 0010)
  const cart = state.cart.sort((a, b) => {
    const itemA = Number(a.sku.slice(-4));
    const itemB = Number(b.sku.slice(-4));
    return itemA - itemB;
  });

  // Return everything needed for consuming the cart context
  return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart };
};

// Define type based on return value of useCartContext
export type UseCartContextType = ReturnType<typeof useCartContext>;

// Initial empty cart context value (for default state)
const initCartContextState: UseCartContextType = {
  dispatch: () => {}, // No-op dispatch/void return
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE, // Action types
  totalItems: 0, // Initial item count
  totalPrice: "", // Initial price string
  cart: [], // Initial cart
};

// Create context to be used throughout the app
export const CartContext =
  createContext<UseCartContextType>(initCartContextState);

// Type definition for the provider's children prop
type ChildrenType = { children?: ReactElement | ReactElement[] };

// Cart context provider to wrap around components that need cart access
export const CartProvider = ({ children }: ChildrenType): ReactElement => {
  return (
    <CartContext.Provider value={useCartContext(initCartState)}>
      {children}
    </CartContext.Provider>
  );
};

// Export context for use in other components
export default CartContext;

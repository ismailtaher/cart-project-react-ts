// Import necessary hooks and types from React
import { createContext, useState, useEffect, type ReactElement } from "react";

// Define the shape of a single product object
export type ProductsType = {
  sku: string; // Stock Keeping Unit (unique identifier for each product)
  name: string; // Name of the product
  price: number; // Price of the product
};

//Initial empty state for the products array
// uncomment this if using useEffect with fetch logic

/* const initState: ProductsType[] = []; */

// Uncomment this block to use static mock data instead of fetching from the server
const initState: ProductsType[] = [
  {
    sku: "item0001",
    name: "Widget",
    price: 9.99,
  },
  {
    sku: "item0002",
    name: "Premium Widget",
    price: 19.99,
  },
  {
    sku: "item0003",
    name: "Deluxe Widget",
    price: 29.99,
  },
];

// Define the context type: an object containing an array of products
export type UseProductsContextType = { products: ProductsType[] };

// Initial state for the context provider (empty products array)
const initContextState: UseProductsContextType = { products: [] };

// Create the context with the initial state
const ProductsContext = createContext<UseProductsContextType>(initContextState);

// Define the expected type for the provider's children prop
type ChildrenType = { children?: ReactElement | ReactElement[] };

// Context Provider component definition
export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
  // State to store the list of products, initialized with an empty array or mock data
  const [products, setProducts] = useState<ProductsType[]>(initState);

  /*   // useEffect runs once after component mounts to fetch product data
  useEffect(() => {
    // Async function to fetch product data from the backend
    const fetchProducts = async (): Promise<ProductsType[]> => {
      const data = await fetch("http://localhost:3500/products")
        .then((res) => {
          // Parse and return JSON response
          return res.json();
        })
        .catch((err) => {
          // Catch and log any errors
          if (err instanceof Error) console.log(err.message);
        });
      return data;
    };

    // Call the fetch function and update the products state
    fetchProducts().then((products) => setProducts(products));
  }, []); // Empty dependency array = runs only once on mount */

  // Provide the products state to all children components using the context
  return (
    <ProductsContext.Provider value={{ products }}>
      {children}
    </ProductsContext.Provider>
  );
};

// Export the context to be used by other components
export default ProductsContext;

import useCart from "../hooks/useCart"; // Access cart context: cart state + dispatch
import useProducts from "../hooks/useProducts"; // Access products context
import { type UseProductsContextType } from "../context/ProductsProvider"; // Typing only
import type { ReactElement } from "react";
import Product from "./Product"; // Product component for rendering each product

const ProductList = () => {
  // Destructure cart-related state and dispatch from context
  const { dispatch, REDUCER_ACTIONS, cart } = useCart();

  // Get products array from context
  const { products } = useProducts();

  // Default content shown while products are being fetched
  let pageContent: ReactElement | ReactElement[] = <p>Loading...</p>;

  // Once products are available
  if (products?.length) {
    // Map over products and render a Product component for each
    pageContent = products.map((product) => {
      // Check if product is already in cart
      const inCart: boolean = cart.some((item) => item.sku === product.sku);

      // Render product with props: product data, dispatch, action types, inCart flag
      return (
        <Product
          key={product.sku}
          product={product}
          dispatch={dispatch}
          REDUCER_ACTIONS={REDUCER_ACTIONS}
          inCart={inCart}
        />
      );
    });
  }

  // Wrap the content in a styled main section
  const content = <main className="main main--products">{pageContent}</main>;

  return content;
};

export default ProductList;

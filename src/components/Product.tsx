import type { ProductsType } from "../context/ProductsProvider"; // Product shape
import type { ReducerActionType, ReducerAction } from "../context/CartProvider"; // For dispatch and action types
import type { ReactElement } from "react";

// Props passed from ProductList
type PropsType = {
  product: ProductsType; // Single product to render
  dispatch: React.ActionDispatch<[action: ReducerAction]>; // Reducer dispatch function
  REDUCER_ACTIONS: ReducerActionType; // Object containing action type strings
  inCart: boolean; // Flag indicating if item is already in cart
};

const Product = ({
  product,
  dispatch,
  REDUCER_ACTIONS,
  inCart,
}: PropsType): ReactElement => {
  // Dynamically resolve image path based on SKU
  // This is the best way to get images' href in vite+react app
  const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url)
    .href;
  console.log(img);

  // Dispatch ADD action with the product and initial qty 1
  const onAddToCart = () =>
    dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, qty: 1 } });

  // Display message if the item is already in the cart
  const itemInCart = inCart ? " → Item in Cart: ✔️ " : null;

  // Final content structure with product details and action
  const content = (
    <article className="product">
      <h3>{product.name}</h3>
      <img src={img} alt={product.name} className="product__img" />
      <p>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
        {itemInCart}
      </p>
      <button onClick={onAddToCart}>Add to Cart</button>
    </article>
  );

  return content;
};

export default Product;

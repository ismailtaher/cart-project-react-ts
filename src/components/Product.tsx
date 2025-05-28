import type { ProductsType } from "../context/ProductsProvider"; // Product shape
import type { ReducerActionType, ReducerAction } from "../context/CartProvider"; // For dispatch and action types
import type { ReactElement } from "react";
import { memo } from "react";

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

/**
 * areProductsEqual is a custom comparison function used with React.memo.
 * It ensures the Product component only re-renders if its 'product' or 'inCart' props change.
 *
 * 1. It compares each key of the previous product with the next one (shallow comparison).
 * 2. Also checks if the 'inCart' boolean has changed.
 * 3. If nothing has changed, the component won't re-render — optimizing performance when rendering many product items.
 */
function areProductsEqual(
  { product: prevProduct, inCart: prevInCart }: PropsType,
  { product: nextProduct, inCart: nextInCart }: PropsType
) {
  return (
    Object.keys(prevProduct).every((key) => {
      return (
        prevProduct[key as keyof ProductsType] ===
        nextProduct[key as keyof ProductsType]
      );
    }) && prevInCart === nextInCart
  );
}

/**
 * MemoizedProduct wraps the Product component using React.memo and a custom comparator.
 * React.memo prevents re-renders of the Product component if the props haven't changed
 * based on the logic defined in areProductsEqual.
 */
const MemoizedProduct = memo<typeof Product>(Product, areProductsEqual);

export default MemoizedProduct;

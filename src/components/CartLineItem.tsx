import type { ChangeEvent, ReactElement } from "react";
import type {
  CartItemType,
  ReducerAction,
  ReducerActionType,
} from "../context/CartProvider";

type PropsType = {
  item: CartItemType;
  dispatch: React.ActionDispatch<[action: ReducerAction]>;
  REDUCER_ACTIONS: ReducerActionType;
};

const CartLineItem = ({ item, dispatch, REDUCER_ACTIONS }: PropsType) => {
  // Image path generated based on SKU
  const img: string = new URL(`../images/${item.sku}.jpg`, import.meta.url)
    .href;

  // Total cost for this line item (qty * price)
  const lineTotal: number = item.qty * item.price;

  // Ensure quantity dropdown always includes at least current qty and up to 20
  const highestQty: number = 20 > item.qty ? 20 : item.qty;
  const optionValues: number[] = [...Array(highestQty).keys()].map(
    (i) => i + 1
  );

  // Render options for quantity select dropdown
  const options: ReactElement[] = optionValues.map((val) => (
    <option key={`opt${val}`} value={val}>
      {val}
    </option>
  ));

  // When quantity is changed, dispatch a QUANTITY update
  const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: REDUCER_ACTIONS.QUANTITY,
      payload: { ...item, qty: Number(e.target.value) },
    });
  };

  // When remove button is clicked, dispatch a REMOVE action
  const onRemoveFromCart = () => {
    dispatch({
      type: REDUCER_ACTIONS.REMOVE,
      payload: item,
    });
  };

  // Final rendered content
  const content = (
    <li className="cart__item">
      <img src={img} alt={item.name} className="cart__img" />
      <div aria-label="item name">{item.name}</div>

      <div aria-label="price per item">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.price)}
      </div>

      <label htmlFor="itemQty" className="offscreen">
        Item Quantity
      </label>
      <select
        name="itemQty"
        id="itemQty"
        className="cart__select"
        value={item.qty}
        aria-label="Item Quantity"
        onChange={onChangeQty}>
        {options}
      </select>

      <div className="cart__item-subtotal" aria-label="line Item Subtotal">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(lineTotal)}
      </div>

      <button
        className="cart__button"
        aria-label="Remove Item from cart"
        title="Remove Item From Cart"
        onClick={onRemoveFromCart}>
        ❌
      </button>
    </li>
  );

  return content;
};

export default CartLineItem;

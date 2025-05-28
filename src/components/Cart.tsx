import useCart from "../hooks/useCart"; // Custom hook to access cart context
import { useState } from "react"; // Local state hook
import CartLineItem from "./CartLineItem"; // Component to display individual cart items

const Cart = () => {
  // Local state to track order confirmation
  const [confirm, setConfirm] = useState<boolean>(false);

  // Destructure values from cart context
  const { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart } = useCart();

  // Function to submit the order
  const onSubmitOrder = () => {
    dispatch({ type: REDUCER_ACTIONS.SUBMIT }); // Clears the cart
    setConfirm(true); // Show thank-you message
  };

  // Conditional UI: show confirmation or cart UI
  const pageContent = confirm ? (
    <h2>Thank you for your order.</h2> // Displayed after order submission
  ) : (
    <>
      <h2 className="offscreen">Cart</h2> {/* For screen readers */}
      <ul className="cart">
        {cart.map((item) => (
          <CartLineItem
            key={item.sku} // SKU used as unique key
            item={item} // Cart item data
            dispatch={dispatch} // Dispatch for handling quantity/removal
            REDUCER_ACTIONS={REDUCER_ACTIONS}
          />
        ))}
      </ul>
      {/* Show total items and price, and button to place order */}
      <div className="cart__totals">
        <p>Total Items: {totalItems}</p>
        <p>Total Price: {totalPrice}</p>
        <button
          className="cart__submit"
          disabled={!totalItems} // Disable if cart is empty
          onClick={onSubmitOrder}>
          Place Order
        </button>
      </div>
    </>
  );

  // Wrap content in main element
  const content = <main className="main--cart">{pageContent}</main>;

  return content;
};

export default Cart;

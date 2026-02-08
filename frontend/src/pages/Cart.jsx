import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <p>Your cart is empty</p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.product._id} className="cart-item">
            <div className="item-info">
              <h3>{item.product.name}</h3>
              <p className="category">{item.product.category}</p>
              <p className="price">${item.product.price.toFixed(2)}</p>
            </div>
            
            <div className="item-actions">
              <div className="quantity-control">
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className="btn btn-small"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="btn btn-small"
                  disabled={item.quantity >= item.product.stock}
                >
                  +
                </button>
              </div>
              
              <p className="subtotal">
                Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
              </p>
              
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h2>Total: ${getCartTotal().toFixed(2)}</h2>
        <button onClick={() => navigate('/checkout')} className="btn btn-primary">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api/axios';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderProducts = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const response = await api.post('/orders', { products: orderProducts });
      
      clearCart();
      navigate(`/orders/${response.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="order-summary">
        <h2>Order Summary</h2>
        
        {cart.map((item) => (
          <div key={item.product._id} className="summary-item">
            <span>{item.product.name}</span>
            <span>Qty: {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        <div className="summary-total">
          <strong>Total:</strong>
          <strong>${getCartTotal().toFixed(2)}</strong>
        </div>
      </div>
      
      <button
        onClick={handleCheckout}
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
};

export default Checkout;

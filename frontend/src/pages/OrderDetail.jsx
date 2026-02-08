import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading order...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="order-detail-page">
      <button onClick={() => navigate('/orders')} className="btn btn-secondary">
        ← Back to Orders
      </button>
      
      <div className="order-detail">
        <h1>Order Details</h1>
        
        <div className="order-info">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`status status-${order.status}`}>{order.status}</span>
          </p>
        </div>
        
        <h2>Items</h2>
        <div className="order-items">
          {order.products.map((item) => (
            <div key={item.product._id} className="order-item">
              <div>
                <h3>{item.product.name}</h3>
                <p>{item.product.description}</p>
              </div>
              <div>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.product.price.toFixed(2)}</p>
                <p>
                  <strong>
                    Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                  </strong>
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="order-total">
          <h2>Total: ${order.totalPrice.toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

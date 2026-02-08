import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/my');
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {orders.length === 0 ? (
        <div>
          <p>You haven't placed any orders yet</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-8)}</h3>
                <span className={`status status-${order.status}`}>
                  {order.status}
                </span>
              </div>
              
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total: ${order.totalPrice.toFixed(2)}</p>
              <p>Items: {order.products.length}</p>
              
              <Link to={`/orders/${order._id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

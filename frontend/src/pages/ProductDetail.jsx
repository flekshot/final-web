import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api/axios';
import { getProductImage, getFallbackProductImage } from '../utils/productImage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.stock < quantity) {
      setError('Not enough stock available');
      return;
    }

    addToCart(product, quantity);
    setSuccess('Added to cart!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate('/products')} className="btn btn-secondary">
        Back to Products
      </button>

      <div className="product-detail">
        <div className="product-info">
          <img
            className="product-image product-image-detail"
            src={getProductImage(product)}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = getFallbackProductImage();
            }}
          />
          <h1>{product.name}</h1>
          <p className="category">Category: {product.category}</p>
          <p className="description">{product.description}</p>
          <p className="price">${Number(product.price).toFixed(2)}</p>
          <p className="stock">Available Stock: {product.stock}</p>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="add-to-cart">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getProductImage, getFallbackProductImage } from '../utils/productImage';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const getShortText = (text, maxLen = 110) => {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return `${text.slice(0, maxLen).trim()}...`;
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-page">
      <h1>Products</h1>

      <div className="filters">
        <form onSubmit={handleSearch} className="filter-form">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />

          <button type="submit" className="btn btn-primary">
            Search
          </button>
          <button type="button" onClick={clearFilters} className="btn btn-secondary">
            Clear
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img
                className="product-image"
                src={getProductImage(product)}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = getFallbackProductImage();
                }}
              />
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="desc">{getShortText(product.description)}</p>
              <p className="price">${Number(product.price).toFixed(2)}</p>
              <p className="stock">Stock: {product.stock}</p>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => openQuickView(product)}
                >
                  Quick View
                </button>
                <Link to={`/products/${product._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {quickViewProduct && (
        <div className="modal-overlay" onClick={closeQuickView}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{quickViewProduct.name}</h2>
              <button type="button" className="modal-close" onClick={closeQuickView}>
                x
              </button>
            </div>
            <div className="modal-body">
              <img
                className="product-image product-image-modal"
                src={getProductImage(quickViewProduct)}
                alt={quickViewProduct.name}
                onError={(e) => {
                  e.currentTarget.src = getFallbackProductImage();
                }}
              />
              <p className="category">Category: {quickViewProduct.category}</p>
              <p className="desc">{quickViewProduct.description}</p>
              <p className="price">${Number(quickViewProduct.price).toFixed(2)}</p>
              <p className="stock">Stock: {quickViewProduct.stock}</p>
            </div>
            <div className="modal-actions">
              <Link
                to={`/products/${quickViewProduct._id}`}
                className="btn btn-primary"
                onClick={closeQuickView}
              >
                Open Details
              </Link>
              <button type="button" className="btn btn-secondary" onClick={closeQuickView}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

import { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/products', formData);
      setSuccess('Product created successfully');
      fetchProducts();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.put(`/products/${editingProduct}`, formData);
      setSuccess('Product updated successfully');
      fetchProducts();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="admin-products-page">
      <h1>Product Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary"
      >
        {showForm ? 'Cancel' : 'Add New Product'}
      </button>
      
      {showForm && (
        <form
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          className="product-form"
        >
          <h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}
      
      <div className="products-table">
        <h2>All Products</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-small btn-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-small btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

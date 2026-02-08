import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Electronics Store
        </Link>
        
        <div className="nav-links">
          <Link to="/products">Products</Link>
          
          {user ? (
            <>
              <Link to="/cart" className="cart-link">
                Cart ({getCartCount()})
              </Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/profile">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin/products">Admin</Link>
              )}
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/cart" className="cart-link">
                Cart ({getCartCount()})
              </Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

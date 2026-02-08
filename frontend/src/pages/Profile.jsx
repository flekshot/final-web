import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await api.put('/users/profile', updateData);
      updateUser(response.data.user);
      setSuccess('Profile updated successfully');
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">New Password (leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      
      <div className="user-info">
        <p><strong>Role:</strong> {user?.role}</p>
        <p><strong>Account Created:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Profile;

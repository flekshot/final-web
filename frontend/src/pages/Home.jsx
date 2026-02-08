import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Welcome to Electronics Store</h1>
        <p>Your one-stop shop for the latest electronics</p>
        <Link to="/products" className="btn btn-primary">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Home;

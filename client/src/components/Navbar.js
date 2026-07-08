import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();
  const Tab = ({ to, children }) => (
    <Link to={to} className={`tab ${pathname === to ? 'active' : ''}`}>{children}</Link>
  );
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">Fashion Closet</div>
        <Tab to="/today">Today</Tab>
        <Tab to="/style-goals">Goals</Tab>
        <Tab to="/">Closet</Tab>
        <Tab to="/upload">Upload</Tab>
        <Tab to="/builder">Stylist</Tab>
        <Tab to="/outfits">Planner</Tab> 
        <Tab to="/trips">Trips</Tab>
        <Tab to="/wishlist">Wishlist</Tab>
        <Tab to="/inspiration">Inspo</Tab>
      </div>
    </header>
  );
}

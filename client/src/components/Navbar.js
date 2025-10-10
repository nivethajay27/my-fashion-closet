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
        <Tab to="/">Items</Tab>
        <Tab to="/builder">Builder</Tab>
        <Tab to="/outfits">Outfits</Tab> 
      </div>
    </header>
  );
}


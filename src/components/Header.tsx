import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ModeToggle } from './ModeToggle';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isDashboard = location.pathname === '/dashboard';
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileOpen(false);
  };

  const closeMenu = () => setIsMobileOpen(false);

  return (
    <header className="py-6 bg-card border-b border-border relative z-50">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">C</span>
            </div>
            <h1 className="text-2xl font-bold">CryptoPal Oracle</h1>
          </Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6">
            <li>
              <Link to="/dashboard" className={`hover:text-primary transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-primary font-semibold' : ''}`}>Dashboard</Link>
            </li>
            <li>
              <Link to="/portfolio" className={`hover:text-primary transition-colors ${location.pathname.startsWith('/portfolio') ? 'text-primary font-semibold' : ''}`}>Tracker</Link>
            </li>
            <li>
              <Link to="/converter" className={`hover:text-primary transition-colors ${location.pathname.startsWith('/converter') ? 'text-primary font-semibold' : ''}`}>Converter</Link>
            </li>
            <li>
              <Link to="/news" className={`hover:text-primary transition-colors ${location.pathname.startsWith('/news') ? 'text-primary font-semibold' : ''}`}>News</Link>
            </li>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <li>
                <button onClick={handleLogout} className="text-destructive hover:text-destructive/80 transition-colors font-medium">Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-primary transition-colors font-medium">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
          <ModeToggle />
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-4">
          <ModeToggle />
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="text-foreground focus:outline-none">
            {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card border-b border-border shadow-2xl z-50 py-4 px-4 flex flex-col gap-4">
          <Link to="/dashboard" onClick={closeMenu} className={`block text-lg hover:text-primary transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-primary font-semibold' : ''}`}>Dashboard</Link>
          <Link to="/portfolio" onClick={closeMenu} className={`block text-lg hover:text-primary transition-colors ${location.pathname.startsWith('/portfolio') ? 'text-primary font-semibold' : ''}`}>Tracker</Link>
          <Link to="/converter" onClick={closeMenu} className={`block text-lg hover:text-primary transition-colors ${location.pathname.startsWith('/converter') ? 'text-primary font-semibold' : ''}`}>Converter</Link>
          <Link to="/news" onClick={closeMenu} className={`block text-lg hover:text-primary transition-colors ${location.pathname.startsWith('/news') ? 'text-primary font-semibold' : ''}`}>News</Link>

          <div className="border-t border-border/50 my-2 pt-4 flex flex-col gap-4">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-left text-lg text-destructive hover:text-destructive/80 transition-colors font-medium">Logout</button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="block text-lg hover:text-primary transition-colors font-medium">Login</Link>
                <Link to="/register" onClick={closeMenu} className="block w-full text-center bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

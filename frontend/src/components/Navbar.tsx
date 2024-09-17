import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    const category = location.state?.category;

    // Check the current path and category to highlight the active tab
    if (path === '/') {
      setActiveCategory(null); // Home
    } else if (path === '/login') {
      setActiveCategory('Login');
    } else if (path === '/register') {
      setActiveCategory('Register');
    } else if (path === '/all-news' && category) {
      setActiveCategory(category); // Highlight the active category
    } else if (path === '/all-news') {
      setActiveCategory('All News'); // Highlight All News
    } else if (path === '/admin/profile') {
      setActiveCategory('Admin Dashboard');
    } else if (path === '/profile') {
      setActiveCategory('Profile');
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setActiveCategory(null); // Reset to Home
    toast.success('Logout successfully!');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    navigate('/all-news', { state: { category } });
    toggleMenu();
  };

  const handleNavigation = (path: string, category?: string | null) => {
    setActiveCategory(category || null);
    navigate(path);
    toggleMenu();
  };

  const getNavButtonClass = (category: string | null) => {
    return activeCategory === category ? 'border-b-2 border-white' : 'hover:underline';
  };

  return (
    <header className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <button onClick={() => handleNavigation('/', null)}>
            Shot News
          </button>
        </div>
        <nav className="hidden md:flex space-x-4">
          <button
            onClick={() => handleNavigation('/', null)}
            className={activeCategory === null ? 'border-b-2 border-white' : 'hover:underline'}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation('/all-news', 'All News')}
            className={getNavButtonClass('All News')}
          >
            All News
          </button>
         
          
          <button
            onClick={() => handleNavigation('/category', 'All Categories')}
            className={getNavButtonClass('All Categories')}
          >
            All Categories
          </button>
          {isAuthenticated && user?.role === 'admin' && (
            <button
              onClick={() => handleNavigation('/admin/profile', 'Admin Dashboard')}
              className={getNavButtonClass('Admin Dashboard')}
            >
              Admin Dashboard
            </button>
          )}
          {isAuthenticated && user?.role === 'subscriber' && (
            <button
              onClick={() => handleNavigation('/profile', 'Profile')}
              className={getNavButtonClass('Profile')}
            >
              Your Profile
            </button>
          )}
        </nav>
        <div className="hidden md:flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation('/login', 'Login')}
                className={getNavButtonClass('Login')}
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation('/register', 'Register')}
                className={getNavButtonClass('Register')}
              >
                Register
              </button>
            </>
          )}
          <div className="relative w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
            {isAuthenticated && user?.name ? user.name.charAt(0).toUpperCase() : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m-7.292 4.408l.83-.837M4 12h1m4.408 7.292l-.837-.83M20 12h-1m-.293-4.707l.83-.83M12 4a8 8 0 100 16 8 8 0 000-16zm0 0v1m0 15v1m8-8h-1m-15 0H4m15-5.292l-.837.83M4.707 16.707l.83-.83" />
              </svg>
            )}
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavigation('/', null)}
              className={activeCategory === null ? 'border-b-2 border-white' : 'hover:underline'}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('/all-news', 'All News')}
              className={getNavButtonClass('All News')}
            >
              All News
            </button>
         
            <button
              onClick={() => handleNavigation('/category', 'All Categories')}
              className={getNavButtonClass('All Categories')}
            >
              All Categories
            </button>
            {isAuthenticated && user?.role === 'admin' && (
              <button
                onClick={() => handleNavigation('/admin/profile', 'Admin Dashboard')}
                className={getNavButtonClass('Admin Dashboard')}
              >
                Admin Dashboard
              </button>
            )}
            {isAuthenticated && user?.role === 'subscriber' && (
              <button
                onClick={() => handleNavigation('/profile', 'Profile')}
                className={getNavButtonClass('Profile')}
              >
                Your Profile
              </button>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login', 'Login')}
                  className={getNavButtonClass('Login')}
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register', 'Register')}
                  className={getNavButtonClass('Register')}
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

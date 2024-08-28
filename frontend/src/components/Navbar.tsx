import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    navigate('/all-news', { state: { category } });
    toggleMenu();
  };

  const getNavButtonClass = (category: string | null) => {
    // Highlight the button if it's the active category
    return activeCategory === category ? 'border-b-2 border-white' : 'hover:underline';
  };

  return (
    <header className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <button
            onClick={() => {
              // setActiveCategory(null); // Clear active category when going to home
              navigate('/');
            }}
            // className={activeCategory === null ? 'border-b-2 border-white' : 'hover:underline'}
          >
            Shot News
          </button>
        </div>
        <nav className="hidden md:flex space-x-4">
          <button
            onClick={() => {
              setActiveCategory(null);
              navigate('/');
            }}
            className={activeCategory === null ? 'border-b-2 border-white' : 'hover:underline'}
          >
            Home
          </button>
          <button
            onClick={() => {
              setActiveCategory('All News');
              navigate('/all-news');
            }}
            className={activeCategory === 'All News' ? 'border-b-2 border-white' : 'hover:underline'}
          >
            All News
          </button>
          <button
            onClick={() => handleCategoryClick('Business')}
            className={getNavButtonClass('Business')}
          >
            Business
          </button>
          <button
            onClick={() => handleCategoryClick('Travel')}
            className={getNavButtonClass('Travel')}
          >
            Travel
          </button>
          <button
            onClick={() => handleCategoryClick('Hollywood')}
            className={getNavButtonClass('Hollywood')}
          >
            Hollywood
          </button>
          <button
            onClick={() => handleCategoryClick('Tech')}
            className={getNavButtonClass('Tech')}
          >
            Technology
          </button>
          <button
            onClick={() => handleCategoryClick('Sports')}
            className={getNavButtonClass('Sports')}
          >
            Sports
          </button>
          <button
            onClick={() => {
              setActiveCategory('All Categories');
              navigate('/category');
            }}
            className={activeCategory === 'All Categories' ? 'border-b-2 border-white' : 'hover:underline'}
          >
            All Categories
          </button>
        </nav>
        <div className="hidden md:flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <button onClick={() => navigate('/admin/profile')} className="hover:underline">Admin Dashboard</button>
              )}
              {user?.role === 'subscriber' && <button onClick={() => navigate('/profile')} className="hover:underline">Profile</button>}
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="hover:underline">Login</button>
              <button onClick={() => navigate('/register')} className="hover:underline">Register</button>
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
              onClick={() => {
                setActiveCategory(null);
                navigate('/');
              }}
              className={activeCategory === null ? 'border-b-2 border-white' : 'hover:underline'}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveCategory('All News');
                navigate('/all-news');
              }}
              className={activeCategory === 'All News' ? 'border-b-2 border-white' : 'hover:underline'}
            >
              All News
            </button>
            <button
              onClick={() => handleCategoryClick('Business')}
              className={getNavButtonClass('Business')}
            >
              Business
            </button>
            <button
              onClick={() => handleCategoryClick('Travel')}
              className={getNavButtonClass('Travel')}
            >
              Travel
            </button>
            <button
              onClick={() => handleCategoryClick('Hollywood')}
              className={getNavButtonClass('Hollywood')}
            >
              Hollywood
            </button>
            <button
              onClick={() => handleCategoryClick('Tech')}
              className={getNavButtonClass('Tech')}
            >
              Technology
            </button>
            <button
              onClick={() => handleCategoryClick('Sports')}
              className={getNavButtonClass('Sports')}
            >
              Sports
            </button>
            <button
              onClick={() => {
                setActiveCategory('All Categories');
                navigate('/category');
              }}
              className={activeCategory === 'All Categories' ? 'border-b-2 border-white' : 'hover:underline'}
            >
              All Categories
            </button>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <button className="hover:underline" onClick={() => navigate('/admin/profile')}>Admin Dashboard</button>
                )}
                <button className="hover:underline" onClick={() => navigate('/profile')}>Profile</button>
                <button onClick={() => handleLogout()} className="hover:underline">Logout</button>
              </>
            ) : (
              <>
                <button className="hover:underline" onClick={() => navigate('/login')}>Login</button>
                <button className="hover:underline" onClick={() => navigate('/register')}>Register</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">Shot News</Link>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link to="/business" className="hover:underline">Business </Link>
          <Link to="/tarvel" className="hover:underline">Travel</Link>
          <Link to="/basketball" className="hover:underline">Hollywood</Link>
          <Link to="/tennis" className="hover:underline">Technology</Link>
          <Link to="/running" className="hover:underline">Sports</Link>
        </nav>
        <div className="hidden md:flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="hover:underline">Admin Dashboard</Link>
              )}
              <Link to="/profile" className="hover:underline">Profile</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
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
            <Link to="/cycling" className="hover:underline" onClick={toggleMenu}>Cycling</Link>
            <Link to="/football" className="hover:underline" onClick={toggleMenu}>Football</Link>
            <Link to="/basketball" className="hover:underline" onClick={toggleMenu}>Basketball</Link>
            <Link to="/tennis" className="hover:underline" onClick={toggleMenu}>Tennis</Link>
            <Link to="/running" className="hover:underline" onClick={toggleMenu}>Running</Link>
            <Link to="/badminton" className="hover:underline" onClick={toggleMenu}>Badminton</Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="hover:underline" onClick={toggleMenu}>Admin Dashboard</Link>
                )}
                <Link to="/profile" className="hover:underline" onClick={toggleMenu}>Profile</Link>
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="hover:underline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline" onClick={toggleMenu}>Login</Link>
                <Link to="/register" className="hover:underline" onClick={toggleMenu}>Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

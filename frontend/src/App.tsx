import React from 'react';
import { Route,  Routes,useLocation } from 'react-router-dom';
import './App.css';

// Import components
import HomePage from './pages/HomePage';
import NewsDetails from './pages/NewsDetails';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Import protected routes
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Import layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import CategoryPage from './pages/CategoryPage';
import AllNews from './pages/AllNews';

function App() {
  const location = useLocation();

  return (
    <div className='bg-gray-100'>
  <AuthProvider>
      <>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/all-news" element={<AllNews />} />


          {/* <Route path="profile" element={<UserProfile />} /> */}
          
          
          {/* Protected Routes */}
          <Route
            path="/admin/*"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          
          {/* <Route path="/create-news" element={<AdminRoute><CreateNewsPage /></AdminRoute>} />
          <Route path="/manage-news" element={ <AdminRoute><ManageNews /></AdminRoute>} />
          <Route
            path="/manage-category"
            element={<AdminRoute><ManageCategories /></AdminRoute>}
          />
          <Route path="/manage-comments" element={<AdminRoute><ManageCommentsPage /></AdminRoute>} /> */}

          <Route
            path="/profile"
            element={<ProtectedRoute><UserProfile /></ProtectedRoute>}
          />

          {/* <Route
            path="/profile"
            element={<UserProfile />}
          /> */}

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!location.pathname.includes('/admin') && <Footer />}
      </>
      
    </AuthProvider>
    </div>
  
  );
}

export default App;

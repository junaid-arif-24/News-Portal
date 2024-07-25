import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:id" element={<NewsDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/admin/*"
            element={<AdminRoute><AdminDashboard /></AdminRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute><UserProfile /></ProtectedRoute>}
          />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;

import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";

// Import components
import HomePage from "./pages/HomePage";
import NewsDetails from "./pages/NewsDetails";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Import protected routes
import {
  ProtectedRoute,
  ProtectedRouteAuth,
} from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Import layout components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import CategoryPage from "./pages/CategoryPage";
import AllNews from "./pages/AllNews";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      document.title = "Home - Shot News";
    } else if (location.pathname.includes("/admin")) {
      document.title = "Admin Dashboard - Shot News";
    } else if (location.pathname === "/login") {
      document.title = "Login - Shot News";
    } else if (location.pathname === "/register") {
      document.title = "Register - Shot News";
    } else if (location.pathname === "/category") {
      document.title = "Category - Shot News";
    } else if (location.pathname === "/all-news") {
      document.title = "All News - Shot News";
    } else {
      document.title = "Shot News"; // Default title
    }
  }, [location]);

  return (
    <div className="bg-gray-100">
      <AuthProvider>
        <>
          <Navbar />
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/news/:id" element={<NewsDetails />} />

              <Route path="/category" element={<CategoryPage />} />
              <Route path="/all-news" element={<AllNews />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* <Route path="profile" element={<UserProfile />} /> */}

              {/* Protected Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <ProtectedRouteAuth>
                    <Login />
                  </ProtectedRouteAuth>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRouteAuth>
                    <Register />
                  </ProtectedRouteAuth>
                }
              />

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {!location.pathname.includes("/admin") && <Footer />}
        </>
      </AuthProvider>
    </div>
  );
}

export default App;

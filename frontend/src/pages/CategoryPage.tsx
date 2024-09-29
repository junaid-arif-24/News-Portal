import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { icons } from "../utils/icons"; // Adjust the import path
import { Category } from "../types";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchSubscribedCategories();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchSubscribedCategories = async () => {
    try {
      if (!isAuthenticated) {
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/api/categories/subscribed-categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubscribedCategories(
        response.data.map((category: Category) => category._id)
      );
    } catch (error) {
      console.error("Error fetching subscribed categories", error);
    }
  };

  const handleSubscribe = async (categoryId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/categories/subscribe`,
        { categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Subscribed successfully");
      setSubscribedCategories([...subscribedCategories, categoryId]);
    } catch (error) {
      console.error("Error subscribing", error);
    }
  };

  const handleUnsubscribe = async (categoryId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to unsubscribe");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/categories/unsubscribe`,
        { categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Unsubscribed successfully");
      setSubscribedCategories(
        subscribedCategories.filter((id) => id !== categoryId)
      );
    } catch (error) {
      console.error("Error unsubscribing", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader loading={loading} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      {categories.length === 0 ? (
        <div className="flex justify-center items-center h-24">
          <p className="text-gray-700">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => navigate(`/category/${category.name}`)}
              className="bg-white rounded-lg cursor-pointer items-center shadow-md flex h-24 transition-transform transform hover:scale-105"
            >
              <div className="p-4 flex flex-col justify-between w-full">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold mb-1">{category.name}</h2>
                  <div className="flex items-center">
                    <p className="text-black font-bold w-10 h-10 rounded-full flex justify-center items-center bg-blue-400">
                      {category.newsCount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

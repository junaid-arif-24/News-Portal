import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { icons } from "../utils/icons"; // Adjust the import path
import { Category } from "../types/DataProvider";
import {
  fetchCategories,
  fetchSubscribedCategories,
  subscribeCategory,
  unsubscribeCategory,
} from "../services/api"; // Import from api.ts

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await handleFetchCategories();
      await handleFetchSubscribedCategories();
      setLoading(false);
    };
    fetchData();
  }, [isAuthenticated, user ]);

  const handleFetchCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleFetchSubscribedCategories = async () => {
    try {
      if (!isAuthenticated) return;
      const data = await fetchSubscribedCategories();
      const subscribedCategories = data.map((category: Category) => category._id);
      setSubscribedCategories(() => subscribedCategories); 
   
    } catch (error) {
      toast.error("Error fetching subscribed categories");
    }
  };
  // Subscribe to a category
  const handleSubscribe = async (categoryId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }
    try {
      await subscribeCategory(categoryId);
      setSubscribedCategories([...subscribedCategories, categoryId]);
      toast.success("Subscribed successfully");
    } catch (error) {
      toast.error("Error subscribing");
    }
  };

  // Unsubscribe from a category
  const handleUnsubscribe = async (categoryId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to unsubscribe");
      navigate("/login");
      return;
    }
    try {
      await unsubscribeCategory(categoryId);
      setSubscribedCategories(
        subscribedCategories.filter((id) => id !== categoryId)
      );
      toast.success("Unsubscribed successfully");

    } catch (error) {
      toast.error("Error unsubscribing");
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
                {user?.role === "subscriber" && (
                  <div className="flex justify-between mt-1">
                    {subscribedCategories.includes(category._id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the parent onClick from firing
                          handleUnsubscribe(category._id);
                        }}
                        className="bg-gray-500 hover:bg-gray-700 text-white text-sm font-bold py-2 px-4 rounded"
                      >
                        Unsubscribe
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the parent onClick from firing
                          handleSubscribe(category._id);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4 rounded"
                      >
                        Subscribe
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

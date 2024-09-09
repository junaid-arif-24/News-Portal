import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { icons } from "../utils/icons"; // Adjust the import path

interface Category {
  _id: string;
  name: string;
  description: string;
}

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
        <div className="flex flex-wrap -mx-2">
          {categories.map((category) => (
            <div
              key={category._id}
              className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
            >
              <div
                onClick={() =>
                  navigate(`/all-news`, { state: { category: category.name } })
                }
                className="rounded-lg cursor-pointer shadow-md bg-white p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {category.name}
                    </h2>
                    <p className="text-gray-700">{category.description}</p>
                  </div>
                  <div className="bg-white shadow-lg p-2 rounded-full  self-center">
                    {/* Render the icon with size h-12 w-12 */}
                    {icons[category.name]
                      ? icons[category.name]({ size: "h-10 w-10" })
                      : icons["Default"]({ size: " h-10 w-10" })}
                  </div>
                </div>
                {user?.role === "subscriber" && (
                  <div className="flex justify-between mt-4">
                    {subscribedCategories.includes(category._id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the parent onClick from firing
                          handleUnsubscribe(category._id);
                        }}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Unsubscribe
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the parent onClick from firing
                          handleSubscribe(category._id);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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

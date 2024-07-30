import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
interface Category {
  _id: string;
  name: string;
  description: string;
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (categoryId: string) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/user/subscribe`,
        { categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Subscribed successfully');
    } catch (error) {
      console.error('Error subscribing', error);
    }
  };

  const handleUnsubscribe = async (categoryId: string) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/user/unsubscribe`,
        { categoryId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Unsubscribed successfully');
    } catch (error) {
      console.error('Error unsubscribing', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
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
            <div key={category._id} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
              <div className="rounded-lg shadow-md bg-white p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                  <p className='text-gray-700'>{category.description}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleSubscribe(category._id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Subscribe
                  </button>
                  <button
                    onClick={() => handleUnsubscribe(category._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Unsubscribe
                  </button>
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
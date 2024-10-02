import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NewsList from "../components/NewsList";
import { icons } from "../utils/icons";
import { CategoryNewsSkeleton } from "../components/Skeletons"; // Import skeleton
import { useAuth } from "../context/AuthContext";
import { Category, News } from "../types";




function CategoryNews() {
  const { cat_name } = useParams<{ cat_name: string }>();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const {user} = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const fetchFilteredNews = async () => {
    setIsLoadingNews(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`, {
        params: cat_name ? { category: cat_name , visibility: user?.role ==="admin" ? undefined: "public"} : {},
      });
      setNewsList(response.data);
    } catch (error) {
      console.error("Error fetching news", error);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await axios.get<Category[]>(
        `${API_BASE_URL}/api/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchFilteredNews();
  }, [cat_name]);

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoadingNews || isLoadingCategories) {
    return <CategoryNewsSkeleton />; // Display skeleton while loading
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full">
        <h1 className="text-lg font-bold m-3 underline">{`${cat_name} News`}</h1>
        <NewsList newsList={newsList} category={true} isLoading={isLoadingNews} />
      </div>

      <div className="md:w-1/2 p-3">
        <h1 className="text-lg font-bold m-3 underline">Categories</h1>
        <div className="w-full p-4 space-y-8 max-h-full md:h-[calc(100vh-50px)] overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => navigate(`/category/${category.name}`)}
              className="bg-[#DDEEFF] rounded-lg cursor-pointer items-center shadow-md flex h-14 transition-transform transform hover:scale-105"
            >
              <div className="p-4 flex flex-col justify-between w-full">
                <div className="flex justify-between items-center">
                 
                    <h2 className="text-lg font-bold mb-1">{category.name}</h2>
                    <p className="text-black font-bold w-10 h-10 rounded-full flex justify-center items-center bg-blue-400">
                      {
                        category.newsCount || category.newsCount
                      }
                    </p>
                  
                
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryNews;

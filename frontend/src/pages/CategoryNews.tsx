import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NewsList from "../components/NewsList";
import { icons } from "../utils/icons";
import { CategoryNewsSkeleton } from "../components/Skeletons"; // Import skeleton

interface News {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  time: string;
  tags: string[];
  visibility: string;
  date: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
}

function CategoryNews() {
  const { cat_name } = useParams<{ cat_name: string }>();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const fetchFilteredNews = async () => {
    setIsLoadingNews(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`, {
        params: cat_name ? { category: cat_name } : {},
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
        <div className="w-full p-4 space-y-4 max-h-full md:h-[calc(100vh-50px)] overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => navigate(`/category/${category.name}`)}
              className="bg-[#DDEEFF] rounded-lg cursor-pointer shadow-md flex h-28 transition-transform transform hover:scale-105"
            >
              <div className="p-4 flex flex-col justify-between w-full">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold mb-1">{category.name}</h2>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                  <div className="bg-white shadow-lg p-2 rounded-full self-center">
                    {icons[category.name]
                      ? icons[category.name]({ size: "h-10 w-10" })
                      : icons["Default"]({ size: "h-10 w-10" })}
                  </div>
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

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NewsList from "../components/NewsList";
import { icons } from "../utils/icons";
import { CategoryNewsSkeleton } from "../components/Skeletons"; // Import skeleton
import { useAuth } from "../context/AuthContext";
import { Category, News } from "../types/DataProvider";
import { fetchCategories, fetchNews } from "../services/api";
import CategoryList from "../components/CategoryList";
import { toast } from "react-toastify";




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
      const filters = cat_name
        ? { category: cat_name, visibility: user?.role === "admin" ? undefined : "public" }
        : {};
      const newsData = await fetchNews(filters); // Use the API function
      setNewsList(newsData);
    } catch (error) {
      toast.error("Error fetching news");
    } finally {
      setIsLoadingNews(false);
    }
  };

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const categoryData = await fetchCategories(); // Use the API function
      setCategories(categoryData);
    } catch (error) {
      toast.error("Error fetching categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchFilteredNews();
  }, [cat_name]);

  useEffect(() => {
    loadCategories();
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
             <CategoryList
             key={category._id}
             category={category}
             onClick={() => navigate(`/category/${category.name}`)}
           />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryNews;

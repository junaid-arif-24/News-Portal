import  { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SearchFilters from "../components/SearchFilters";
import Loader from "../components/Loader";
import NewsList from "../components/NewsList";
import { useAuth } from "../context/AuthContext";

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

function AllNews() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const location = useLocation();
  const category = location.state?.category || "";

  const fetchFilteredNews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`, {
        params: {
          visibility: "public" ,
        },
      });
      setNewsList(response.data);
    } catch (error) {
      console.error("Error fetching news", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchFilteredNews();
  }, [category]);

  return (
    <>
      <SearchFilters setNewsList={setNewsList} />
      <h1 className="text-lg font-bold m-3 underline  "> "All News"</h1>

     
        <NewsList newsList={newsList}  isLoading={isLoading} />
     
    </>
  );
}

export default AllNews;

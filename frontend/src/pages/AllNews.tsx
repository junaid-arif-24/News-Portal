import  { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import SearchFilters from "../components/SearchFilters";
import Loader from "../components/Loader";
import NewsList from "../components/NewsList";
import { useAuth } from "../context/AuthContext";
import { News } from "../types";
import { fetchNews } from "../services/api";



function AllNews() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchFilteredNews = async () => {
    setIsLoading(true);
    try {
      // Use fetchNews from the separate API file
      const news = await fetchNews({
        visibility: "public",
      });
      setNewsList(news);
    } catch (error) {
      console.error("Error fetching news", error);
    } finally {
      setIsLoading(false);
    }
  };

  

  useEffect(() => {
    fetchFilteredNews();
  }, []);

  return (
    <>
      <SearchFilters setNewsList={setNewsList} />
      <h1 className="text-lg font-bold m-3 underline  "> "All News"</h1>

     
        <NewsList newsList={newsList}  isLoading={isLoading} />
     
    </>
  );
}

export default AllNews;

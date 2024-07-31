import React, { useEffect, useState } from 'react';
import SearchFilters from '../components/SearchFilters';
import NewsList from '../components/NewsList';
import LatestNews from '../components/LatestNews';
import axios from 'axios';
import Loader from '../components/Loader';
interface News {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  time: string;
  tags: string[];
  visibility: string;
  date: string;
}


const HomePage: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const fetchFilteredNews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`, {
        
      });
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredNews();  
  }, []);

  return (
    <div>
     
     {isLoading ? <Loader loading={isLoading} /> : <LatestNews />} 

      <SearchFilters setNewsList={setNewsList} />
      {isLoading ? <Loader loading={isLoading} /> : <NewsList newsList={newsList} />} 
     
    </div>
  );
};

export default HomePage;

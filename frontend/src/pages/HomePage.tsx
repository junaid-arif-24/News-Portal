import React, { useEffect, useState } from 'react';
import NewsList from '../components/NewsList';
import LatestNews from '../components/LatestNews';
import axios from 'axios';
import TrendingNews from '../components/TrendingNews';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    <div className='m-0 p-0'>
     
      <LatestNews />
      <TrendingNews />


      {/* <SearchFilters setNewsList={setNewsList} /> */}
      <NewsList newsList={newsList} isLoading={isLoading} />
      <p onClick={()=>{navigate('/all-news')}} className='text-blue-500 underline text-xl cursor-pointer text-right mx-5'>{`see all ->`}</p>
     
    </div>
  );
};

export default HomePage;

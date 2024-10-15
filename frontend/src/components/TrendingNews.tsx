import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { calculateReadingTime, formatDate, formatTime } from '../utils/helper';
import parse from 'html-react-parser';
import { TrendingNewsSkeleton } from './Skeletons';
import CategoryIcon from '@mui/icons-material/Category';
import { News } from '../types/DataProvider';
import { fetchTrendingNews } from '../services/api';
import NewsCard from './NewsCard';
import { toast } from 'react-toastify';



const TrendingNews: React.FC = () => {
  const [trendingNews, setTrendingNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const handleFetchTrendingNews = async () => {
      try {
        const responseData = await fetchTrendingNews();
        setTrendingNews(responseData);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching trending news');
        setLoading(false);
      }
    };

    handleFetchTrendingNews();
  }, []);

  // Function to handle navigation
  const handleReadMore = (id: string) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="mx-auto p-5">
      <h1 className="text-lg font-bold mb-3 underline">Trending News</h1>
      {loading ? (
        <TrendingNewsSkeleton /> // Show skeleton when data is loading
      ) : trendingNews.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-4xl font-semibold text-gray-700">No trending news available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingNews.slice(0, 4).map((news) => (
             <NewsCard
             key={news._id}
             news={news}
             onClick={() => handleReadMore(news._id)}
           />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingNews;

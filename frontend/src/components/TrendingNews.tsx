import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { calculateReadingTime, formatDate, formatTime } from '../utils/helper';
import parse from 'html-react-parser';
import { TrendingNewsSkeleton } from './Skeletons';
import CategoryIcon from '@mui/icons-material/Category';
import { News } from '../types';
import { fetchTrendingNews } from '../services/api';



const TrendingNews: React.FC = () => {
  const [trendingNews, setTrendingNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const handleFetchTrendingNews = async () => {
      try {
        const response = await fetchTrendingNews();
        setTrendingNews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending news', error);
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
            <div
              key={news._id}
              onClick={() => handleReadMore(news._id)}
              className="bg-white cursor-pointer rounded-md shadow-md flex flex-col gap-1 transition-transform transform hover:scale-105"
            >
              <img
                src={news.images[0] || '/default-image.jpg'} // Provide a default image if none exists
                alt={news.title || 'News Image'} // Provide a default alt text
                className="w-full h-40 object-cover mb-1"
              />
              <div className="p-2 pt-0">
                <div className="flex justify-between text-xs text-right">
                  <p className='text-orange-600 font-bold text-xs flex'>
                    <CategoryIcon sx={{ fontSize: 16 }} />
                    {news.category?.name || 'No Category'} {/* Handle null category */}
                    <span className="text-gray-600 ml-1">
                      &bull; {calculateReadingTime(news.description || '')} min read
                    </span>
                  </p>
                  <p className='font-bold text-blue-600'>
                    &bull; {formatDate(news.date || '')} at {formatTime(news.time || '')}
                  </p>
                </div>
                <h3 className="text-lg font-semibold mb-2">{news.title || 'No Title'}</h3>
                <div className="text-gray-600 text-sm mb-2">
                  {parse(news.description?.substring(0, 100) || 'No description available...')}...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingNews;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatTime } from '../utils/helper';

interface News {
  _id: string;
  title: string;
  description: string;
  images: string[];
  date: string;
  time: string; // Include time in the News interface
  tags: string[];
  category: string;
}

const TrendingNews: React.FC = () => {
  const [trendingNews, setTrendingNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/news/trending`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTrendingNews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending news', error);
        setLoading(false);
      }
    };

    fetchTrendingNews();
  }, []);

  // Function to handle navigation
  const handleReadMore = (id: string) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 underline">Trending News</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-4xl font-semibold text-gray-700">Loading...</p>
        </div>
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
              src={news.images[0]}
              alt={news.title}
              className="w-full h-40 object-cover mb-1"
            />
            <div className="p-2 pt-0">
            <div className="text-gray-500 text-xs text-right ">
                  <p>&bull; {formatDate(news.date)} at {formatTime(news.time)}</p>
                </div>
              <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {news.description.substring(0, 100)}....
              </p>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingNews;

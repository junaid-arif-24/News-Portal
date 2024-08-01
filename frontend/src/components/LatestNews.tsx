import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {formatDate, formatTime} from '../utils/helper';
import { useNavigate } from 'react-router-dom';
// Adjust the News interface based on the API response
interface News {
  _id: string;
  title: string;
  description: string;
  images: string[];
  time: string;
  date: string;
  category: string;
  visibility: string;
}

const LatestNews: React.FC = () => {
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ;
  const navigate  = useNavigate();
  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await axios.get<News[]>(`${API_BASE_URL}/api/news/latest`);
      setLatestNews(response.data);
    } catch (error) {
      console.error('Error fetching latest news', error);
    }
  };

  // Check if there is at least one news item to display
  if (latestNews.length === 0) {
    return  <div className="flex justify-center items-center h-64">
    <p className="text-4xl font-semibold text-gray-700">No news available</p>
  </div>
  }

  return (
    <div className="bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 underline">Latest News</h1>

      <div className="container mx-auto">
        {/* Main News Section */}
        <div className="md:flex">
          {/* Main Featured News */}
          <div className="md:w-2/3 p-4">
            <div onClick={() => navigate(`/news/${latestNews[0]._id}`)} className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
              {latestNews[0].images.length > 0 && (
                <img src={latestNews[0].images[0]} alt={latestNews[0].title} className="w-full h-80 object-cover rounded-lg mb-4" />
              )}
              <div className="flex justify-between items-center mb-2">
                {/* Span for author has been removed as it's not in the API response */}
                <span className="text-gray-500">&bull; {formatDate(latestNews[0].date)} at {formatTime(latestNews[0].time)}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{latestNews[0].title}</h2>
              <p className="text-gray-700">{latestNews[0].description.substring(0, 100)}</p>
            </div>
          </div>
          {/* Side News */}
          <div className="md:w-1/3 p-4 space-y-4 max-h-[calc(100vh-110px)] overflow-y-auto">
            {latestNews.slice(1, 4).map((news) => (
              <div onClick={() => navigate(`/news/${news._id}`)} key={news._id} className="bg-white p-4 rounded-lg cursor-pointer shadow-md flex">
                {news.images.length > 0 && (
                  <img src={news.images[0]} alt={news.title} className="w-1/3 h-24 object-cover rounded-lg mr-4" />
                )}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">&bull; { formatDate(news.date)} at {formatTime(news.time)}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{news.title}</h3>
                  <p className="text-gray-600 text-sm">{news.description.substring(0, 100)}</p>
                </div>
              </div>
            ))}
            {latestNews.length > 4 && (
              <div className="bg-white p-4 rounded-lg shadow-md flex justify-center items-center">
                <p className="text-gray-600">More news...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;

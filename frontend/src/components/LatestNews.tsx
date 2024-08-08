import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate, formatTime } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';
import { LatestNewsSkeleton } from './Skeletons'; // Import the custom skeleton

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
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestNews();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const response = await axios.get<News[]>(`${API_BASE_URL}/api/news/latest`);
      setLatestNews(response.data);
    } catch (error) {
      console.error('Error fetching latest news', error);
    } finally {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  };

  if (isLoading) {
    return <LatestNewsSkeleton />; // Show skeleton when data is loading
  }

  if (latestNews.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-4xl font-semibold text-gray-700">No news available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-5 py-2 mb-5">
      <h1 className="text-lg font-bold mb-1 underline">Latest News</h1>
      <div className="mx-auto">
        <div className="md:flex md:max-h-[calc(100vh-30px)]">
          {/* Main Featured News Slider */}
          <div className="md:w-2/3 p-4">
            <Carousel animation="slide" interval={5000} duration={300} navButtonsAlwaysVisible>
              {latestNews.slice(0, 3).map((news) => (
                <Paper 
                  key={news._id}
                  onClick={() => navigate(`/news/${news._id}`)}
                  className="bg-white md:h-[calc(100vh-30px)] p-0 rounded-lg shadow-md cursor-pointer"
                >
                  {news.images.length > 0 && (
                    <img
                      src={news.images[0]}
                      alt={news.title}
                      className="w-full h-96 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">&bull; {formatDate(news.date)} at {formatTime(news.time)}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{news.title}</h2>
                    <p className="text-gray-700">{parse(news.description.substring(0, 100))}</p>
                  </div>
                </Paper>
              ))}
            </Carousel>
          </div>
          {/* Side News */}
          <div className="w-full md:w-1/3 p-4 space-y-4 max-h-full overflow-y-auto">
            {latestNews.slice(4, 8).map((news) => (
              <div
                onClick={() => navigate(`/news/${news._id}`)}
                key={news._id}
                className="bg-white p-1 rounded-lg cursor-pointer shadow-md flex h-36"
              >
                {news.images.length > 0 && (
                  <img
                    src={news.images[0]}
                    alt={news.title}
                    className="w-1/3 object-cover rounded-l-lg h-full"
                  />
                )}
                <div className="p-2 flex flex-col justify-between w-2/3">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">{news.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-xs">&bull; {formatDate(news.date)} at {formatTime(news.time)}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{news.description.substring(0, 100)}....</p>
                </div>
              </div>
            ))}
            {latestNews.length > 8 && (
              <div
                onClick={() => navigate('/all-news')}
                className="bg-white p-4 rounded-lg shadow-md flex cursor-pointer justify-center items-center"
              >
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

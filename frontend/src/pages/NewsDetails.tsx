import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from '../components/Comments';
import { toast } from 'react-toastify';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';

interface Category {
  _id: string;
  name: string;
}

interface News {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  images: string[];
  category: Category;
  tags: string[];
  visibility: string;
  views: number;
}

const fetchRelatableNews = async (newsId: string, setRelatableNews: React.Dispatch<React.SetStateAction<News[]>>) => {
  try {
    const response = await axios.get<News[]>(`${process.env.REACT_APP_API_BASE_URL}/api/news/relatable/${newsId}`);
    setRelatableNews(response.data);
  } catch (error) {
    console.error('Error fetching relatable news', error);
  }
};

const fetchTrendingNews = async (setTrendingNews: React.Dispatch<React.SetStateAction<News[]>>) => {
  try {
    const response = await axios.get<News[]>(`${process.env.REACT_APP_API_BASE_URL}/api/news/trending`);
    setTrendingNews(response.data);
  } catch (error) {
    console.error('Error fetching trending news', error);
  }
};

const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [relatableNews, setRelatableNews] = useState<News[]>([]);
  const [trendingNews, setTrendingNews] = useState<News[]>([]);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('token');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await axios.get<News>(`${API_BASE_URL}/api/news/${id}`);
        setNews(response.data);

        // Check if news is saved
        const savedResponse = await axios.get(`${API_BASE_URL}/api/news/${id}/saved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const savedNewsIds = savedResponse.data.savedNews.map((news: any) => news._id);
        setIsSaved(savedNewsIds.includes(id));
      } catch (error) {
        console.error('Error fetching news details', error);
      }
    };
    fetchNewsDetails();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchRelatableNews(id, setRelatableNews);
    }
  }, [id]);

  useEffect(() => {
    fetchTrendingNews(setTrendingNews);
  }, []);

  function formatDate(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save news');
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await axios.post(`${API_BASE_URL}/api/news/${id}/unsave`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('News has been unsaved');
      } else {
        await axios.post(`${API_BASE_URL}/api/news/${id}/save`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('News has been saved');
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving news', error);
      toast.error('Failed to save/unsave news');
    }
  };

  if (!news) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-4 flex flex-wrap lg:flex-nowrap">
      <div className="w-full lg:w-3/4 p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{news.title}</h1>
              <p className="text-gray-600 mt-2">
                {formatDate(news.date)} &bull; {news.time} &bull; {news.views} views
              </p>
            </div>
            <button
              onClick={handleSaveToggle}
              className={`text-2xl ${isSaved ? 'text-red-500' : 'text-gray-500'}`}
              aria-label={isSaved ? 'Unsave' : 'Save'}
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>
          <div className="mb-4">
            {news.images.map((image, index) => (
              <img key={index} src={image} alt={`news-${index}`} className="w-full rounded mb-4" />
            ))}
          </div>
          <div className="mb-4 text-lg">
            {parse(news.description)}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Category:</span> {news.category.name}
          </div>
          <div className="mb-4">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Tags:</span>
              <div className="flex flex-wrap">
                {news.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Visibility:</span> {news.visibility}
          </div>

          {/* Relatable News Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Relatable News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatableNews.map((newsItem) => (
                <div
                  key={newsItem._id}
                  className="bg-gray-100 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                  onClick={() => navigate(`/news/${newsItem._id}`)}
                >
                  <img src={newsItem.images[0]} alt={newsItem.title} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">{newsItem.category.name}</span>
                      <span className="text-sm text-gray-500">{formatDate(newsItem.date)}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{newsItem.title}</h3>
                    <p className="text-gray-600 text-sm">{newsItem.description.substring(0, 50)}....</p>
                    <span className="text-blue-500 hover:underline text-sm mt-2 block">Read more</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {id ? <Comments newsId={id} /> : null}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/4 p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Trending News</h2>
          <div className="space-y-4">
            {trendingNews.map((newsItem) => (
              <div
                key={newsItem._id}
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => navigate(`/news/${newsItem._id}`)}
              >
                <img src={newsItem.images[0]} alt={newsItem.title} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{newsItem.title}</h3>
                  <p className="text-gray-600 text-sm">{newsItem.description.substring(0, 50)}...</p>
                  <span className="text-blue-500 hover:underline text-sm mt-2 block">Read more</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;

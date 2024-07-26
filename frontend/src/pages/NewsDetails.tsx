import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from '../components/Comments';

interface News {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  images: string[];
  category: string;
  tags: string[];
  visibility: string;
  views: number;
}

const fetchTrendingNews = async (setTrendingNews: React.Dispatch<React.SetStateAction<News[]>>) => {
  try {
    const response = await axios.get<News[]>('/api/news/trending');
    setTrendingNews(response.data);
  } catch (error) {
    console.error('Error fetching trending news', error);
  }
};

const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [trendingNews, setTrendingNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await axios.get<News>(`/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news details', error);
      }
    };
    fetchNewsDetails();
  }, [id]);

  useEffect(() => {
    fetchTrendingNews(setTrendingNews);
  }, []);

  if (!news) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{news.title}</h1>
          <p className="text-gray-600 mt-2">
            {news.date} &bull; {news.time} &bull; {news.views} views
          </p>
        </div>
        <div className="mb-4">
          {news.images.map((image, index) => (
            <img key={index} src={image} alt={`news-${index}`} className="w-full h-auto rounded mb-4" />
          ))}
        </div>
        <div className="mb-4">
          <p className="text-lg">{news.description}</p>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Category:</span> {news.category}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Tags:</span> {news.tags.join(', ')}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Visibility:</span> {news.visibility}
        </div>

        {/* Trending News Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Trending News</h2>
            <a href="/trending-news" className="text-red-500 hover:underline">See all &rarr;</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingNews.map((trendingNewsItem) => (
              <div key={trendingNewsItem._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={trendingNewsItem.images[0]} alt={trendingNewsItem.title} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{trendingNewsItem.category}</span>
                    <span className="text-sm text-gray-500">{trendingNewsItem.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{trendingNewsItem.title}</h3>
                  <p className="text-gray-600 text-sm">{trendingNewsItem.description}</p>
                  <a href={`/news/${trendingNewsItem._id}`} className="text-blue-500 hover:underline text-sm mt-2 block">Read more</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {id ? <Comments newsId={id} /> : null}
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;

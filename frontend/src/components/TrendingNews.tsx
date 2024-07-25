import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface News {
  _id: string;
  title: string;
  description: string;
}

const TrendingNews: React.FC = () => {
  const [trendingNews, setTrendingNews] = useState<News[]>([]);

  useEffect(() => {
    fetchTrendingNews();
  }, []);

  const fetchTrendingNews = async () => {
    try {
      const response = await axios.get<News[]>('/api/news/trending');
      setTrendingNews(response.data);
    } catch (error) {
      console.error('Error fetching trending news', error);
    }
  };

  return (
    <div>
      <h2>Trending News</h2>
      <ul>
        {trendingNews.map(news => (
          <li key={news._id}>
            <h3>{news.title}</h3>
            <p>{news.description}</p>
            <a href={`/news/${news._id}`}>Read more</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingNews;

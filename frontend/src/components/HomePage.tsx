import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the types for news items and API responses
interface News {
  _id: string;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get<News[]>('/api/news');
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news', error);
    }
  };

  return (
    <div>
      <h1>Latest News</h1>
      <ul>
        {newsList.map(news => (
          <li key={news._id}>
            <h2>{news.title}</h2>
            <p>{news.description}</p>
            <a href={`/news/${news._id}`}>Read more</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;

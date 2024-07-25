import React, { useState } from 'react';
import SearchFilters from '../components/SearchFilters';
import NewsList from '../components/NewsList';
import TrendingNews from '../components/TrendingNews';
interface News {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  tags: string[];
  visibility: string;
  date: string;
}

const HomePage: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);

  return (
    <div>
      <h1>Latest News</h1>
      <SearchFilters setNewsList={setNewsList} />
      <TrendingNews />
      <NewsList newsList={newsList} />
    </div>
  );
};

export default HomePage;

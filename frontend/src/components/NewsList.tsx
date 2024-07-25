import React from 'react';
import { newsData } from '../data';

interface News {
  _id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
}

const NewsList: React.FC = () => {
  const newsList: News[] = newsData;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">All News</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newsList.slice(0, 8).map((news) => (
          <div key={news._id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src="https://via.placeholder.com/300x200"
              alt={news.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{news.description}</p>
            <a
              href={`/news/${news._id}`}
              className="text-blue-500 hover:underline text-sm"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
      <div className="text-right mt-4">
        <a href="/news" className="text-blue-500 hover:underline">
          See more
        </a>
      </div>
    </div>
  );
};

export default NewsList;

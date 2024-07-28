import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Comments from '../components/Comments';
import { toast } from 'react-toastify';

interface Category {
  _id: string;
  name: string;
}
interface News {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: Category;
  tags: string[];
  visibility: string;
  date: string;
  time: string;
}

const ManageNews: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [searchDescription, setSearchDescription] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchTags, setSearchTags] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [searchVisibility, setSearchVisibility] = useState<string>('public');
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get<News[]>(`${API_BASE_URL}/api/news`, {
        params: {
          title: searchTitle,
          description: searchDescription,
          date: searchDate,
          tags: searchTags,
          category: searchCategory,
          visibility: searchVisibility,
        },
      });
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news', error);
    }
  };

  const handleEdit = (news: News) => {
    navigate('/create-news', { state: news  });
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("News deleted successfully");
  
      fetchNews();
    } catch (error) {
      console.error('Error deleting news', error);
      toast.error('Error deleting news');
    }
  };

  function formatDate(date :string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
  
    return `${day}-${month}-${year}`;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage News</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => navigate('/create-news')}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Create News
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-2">Search News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={searchTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTitle(e.target.value)
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={searchDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchDescription(e.target.value)
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchDate(e.target.value)
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={searchTags}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTags(e.target.value)
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={searchCategory}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchCategory(e.target.value)
            }
            className="p-2 border rounded"
          />
          <select
            value={searchVisibility}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSearchVisibility(e.target.value)
            }
            className="p-2 border rounded"
          >
            <option value="">Select Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <button
          onClick={fetchNews}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
  {newsList && newsList.length > 0 ? (
    newsList.map((news) => (
      <div key={news._id} className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold">{news.title}</h2>
        <p className="text-gray-600 ">{news.description.substring(0, 300)}.....</p>
        <div className="mt-2 flex flex-wrap">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="text-gray-500 text-sm">
          {formatDate(news.date)} at {news.time} | {news.category.name} | {news.visibility}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => handleEdit(news)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => handleDelete(news._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  ) : (
    <div className="flex items-center justify-center h-64 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold text-gray-700">No News Available</h2>
    </div>
  )}
</div>

      {selectedNews && <Comments newsId={selectedNews._id} />}
    </div>
  );
};

export default ManageNews;

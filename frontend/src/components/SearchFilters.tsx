import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Visibility } from '@mui/icons-material';

interface SearchFiltersProps {
  setNewsList: React.Dispatch<React.SetStateAction<any[]>>;
}

interface Category {
  _id: string;
  name: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ setNewsList }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { user } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetching categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  // Fetching filtered news
  const fetchFilteredNews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/news`, {
        params: {
          title,
          description,
          date,
          tags,
          category,
          Visibility: "public"
        },
      });
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news', error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
  }, []);

  useEffect(() => {
    if (refreshing) {
      fetchFilteredNews().then(() => setRefreshing(false));
    }
  }, [refreshing]);

  const handleRefresh = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTags('');
    setCategory('');
    setRefreshing(true);
  };

  return (
    <div className="bg-white shadow-md p-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
        />
        <input
          type="date"
          value={date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
        />
        <select
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
          className="border bg-white rounded-md p-2 w-full md:w-auto"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2 w-full md:w-auto">
        <button
          onClick={fetchFilteredNews}
          className="bg-green-500 text-white rounded-md px-4 py-2 w-full md:w-auto"
        >
          Go
        </button>
        <button
          onClick={handleRefresh}
          className="bg-green-500 text-white rounded-md px-4 py-2 w-full md:w-auto"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;

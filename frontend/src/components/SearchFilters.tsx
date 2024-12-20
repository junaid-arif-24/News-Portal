import React, { useState, ChangeEvent, useEffect } from 'react';
import { Category } from '../types/DataProvider';
import { fetchCategories, fetchNews } from '../services/api';
import { toast } from 'react-toastify';

export interface SearchFiltersProps {
  setNewsList: React.Dispatch<React.SetStateAction<any[]>>;
}




const SearchFilters: React.FC<SearchFiltersProps> = ({ setNewsList }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
 

  // Fetching categories
  const getCategories = async () => {
    try {
      const data = await fetchCategories(); // Using fetchCategories from api.ts
      setCategories(data);
    } catch (error) {
      toast.error('Error fetching categories');
    }
  };

  // Fetching filtered news
  const fetchFilteredNews = async () => {
    try {
      const data = await fetchNews({
        title,
        description,
        date,
        tags,
        category,
        visibility: "public",
      });
      setNewsList(data);
    } catch (error) {
      toast.error('Error fetching news');
    }
  };

  useEffect(() => {
    getCategories(); // Fetch categories when the component mounts
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

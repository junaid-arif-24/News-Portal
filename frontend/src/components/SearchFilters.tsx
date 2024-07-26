import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

interface SearchFiltersProps {
  setNewsList: React.Dispatch<React.SetStateAction<any[]>>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ setNewsList }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const fetchFilteredNews = async () => {
    try {
      const response = await axios.get('/api/news', {
        params: {
          title,
          description,
          date,
          tags,
          category
        }
      });
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold">Standard</h2>
        <button className="text-gray-500">
          <FaSearch />
        </button>
      </div>
      <div className="flex flex-wrap items-center space-x-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="date"
          value={date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={fetchFilteredNews}
          className="bg-blue-500 text-white rounded-md px-4 py-2"
        >
          Go
        </button>
        
      </div>
    </div>
  );
};

export default SearchFilters;
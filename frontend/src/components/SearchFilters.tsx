import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Search Filters</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
      />
      <button onClick={fetchFilteredNews}>Search</button>
    </div>
  );
};

export default SearchFilters;

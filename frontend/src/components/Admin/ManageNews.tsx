import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Comments from '../Comments';

// Define the types for news items and API responses
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

const ManageNews: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('public');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [searchDescription, setSearchDescription] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get<News[]>('/api/news', {
        params: {
          title: searchTitle,
          description: searchDescription,
          date: searchDate
        }
      });
      setNewsList(response.data);
    } catch (error) {
      console.error('Error fetching news', error);
    }
  };

  const createNews = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    images.forEach((image) => formData.append('images', image));
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('visibility', visibility);

    try {
      const response = await axios.post<News>('/api/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewsList([...newsList, response.data]);
      setTitle('');
      setDescription('');
      setImages([]);
      setCategory('');
      setTags('');
      setVisibility('public');
    } catch (error) {
      console.error('Error creating news', error);
    }
  };

  return (
    <div>
      <h1>Manage News</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
      ></textarea>
      <input
        type="file"
        multiple
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
            setImages(Array.from(e.target.files));
          }
        }}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTags(e.target.value)}
      />
      <select value={visibility} onChange={(e: ChangeEvent<HTMLSelectElement>) => setVisibility(e.target.value)}>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <button onClick={createNews}>Create News</button>
      <div>
        <h2>Search News</h2>
        <input
          type="text"
          placeholder="Title"
          value={searchTitle}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={searchDescription}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchDescription(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchDate(e.target.value)}
        />
        <button onClick={fetchNews}>Search</button>
      </div>
      <ul>
        {newsList.map(news => (
          <li key={news._id}>
            <h2>{news.title}</h2>
            <p>{news.description}</p>
            <button onClick={() => setSelectedNews(news)}>Manage Comments</button> {/* Added button to manage comments */}
            <button>Delete</button>
          </li>
        ))}
      </ul>
      {selectedNews && <Comments newsId={selectedNews._id} />} 
    </div>
  );
};

export default ManageNews;

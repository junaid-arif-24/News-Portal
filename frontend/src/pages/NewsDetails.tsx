import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface News {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  images: string[];
  category: string;
  tags: string[];
  visibility: string;
  views: number;
}

const fetchRelatedNews = async (categoryId: string, id: string, setRelatedNews: React.Dispatch<React.SetStateAction<News[]>>) => {
  try {
    const response = await axios.get<News[]>('/api/news', { params: { category: categoryId } });
    setRelatedNews(response.data.filter(n => n._id !== id));
  } catch (error) {
    console.error('Error fetching related news', error);
  }
};

const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await axios.get<News>(`/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news details', error);
      }
    };
    fetchNewsDetails();
  }, [id]);

  useEffect(() => {
    if (news?.category && id) {
      fetchRelatedNews(news.category, id, setRelatedNews);
    }
  }, [news, id]);

  if (!news) return <div>Loading...</div>;

  return (
    <div>
      <h1>{news.title}</h1>
      <p>{news.description}</p>
      <p>{news.date}</p>
      <p>{news.time}</p>
      <div>
        {news.images.map((image, index) => (
          <img key={index} src={image} alt={`news-${index}`} />
        ))}
      </div>
      <p>Category: {news.category}</p>
      <p>Tags: {news.tags.join(', ')}</p>
      <p>Visibility: {news.visibility}</p>
      <p>Views: {news.views}</p>
      <div>
        <h2>Related News</h2>
        <ul>
          {relatedNews.map((relatedNewsItem) => (
            <li key={relatedNewsItem._id}>
              <h3>{relatedNewsItem.title}</h3>
              <p>{relatedNewsItem.description}</p>
              <a href={`/news/${relatedNewsItem._id}`}>Read more</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Comments</h2>
        {/* Add Comment Component Here */}
      </div>
    </div>
  );
};

export default NewsDetails;

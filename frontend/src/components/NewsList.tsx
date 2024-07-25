import React from 'react';

interface News {
  _id: string;
  title: string;
  description: string;
}

interface NewsListProps {
  newsList: News[];
}

const NewsList: React.FC<NewsListProps> = ({ newsList }) => {
  return (
    <div>
      <h1>All News</h1>
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

export default NewsList;

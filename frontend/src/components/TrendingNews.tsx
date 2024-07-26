import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface News {
  _id: string;
  title: string;
  description: string;
  image: string;
  time: string;
  author: string;
}

const TrendingNews: React.FC = () => {
  const [, setTrendingNews] = useState<News[]>([]);

  useEffect(() => {
    fetchTrendingNews();
  }, []);

  const fetchTrendingNews = async () => {
    try {
      const response = await axios.get<News[]>('/api/news/trending');
      setTrendingNews(response.data);
    } catch (error) {
      console.error('Error fetching trending news', error);
    }
  };

  // For testing, let's use static data
  const staticData: News[] = [
    {
      _id: '1',
      title: 'Record-Breaking Performance Propels Team to Dominant Win',
      description: 'Team A secures a significant victory with record-breaking performance.',
      image: 'https://media-cldnry.s-nbcnews.com/image/upload/mpx/2704722219/2024_07/tdy_news_7a_keir_oly_240722-je55gs.jpg',
      time: '40 minutes ago',
      author: 'Basketball',
    },
    {
      _id: '2',
      title: 'Player X\'s heroics lead team to victory against rivals',
      description: 'In a passionate match against his eternal rival, Player X shows his prowess by scoring...',
      image: 'https://via.placeholder.com/600x400',
      time: '10 minutes ago',
      author: 'John William Smith',
    },
    {
      _id: '3',
      title: 'Team sets new scoring high in blowout win',
      description: 'Team scored more points in this game than they ever have before, setting a new record for more...',
      image: 'https://via.placeholder.com/600x400',
      time: '8 minutes ago',
      author: 'Bob Costas',
    },
    {
      _id: '4',
      title: 'NBA players give back in local charity event',
      description: 'The private "give back" implies that the players are showing gratitude or a sense of read more...',
      image: 'https://via.placeholder.com/600x400',
      time: '6 minutes ago',
      author: 'Stephen A. Smith',
    },
    {
      _id: '5',
      title: 'Another headline for testing scrolling',
      description: 'This is a test description to check scrolling functionality in the side news section.',
      image: 'https://via.placeholder.com/600x400',
      time: '5 minutes ago',
      author: 'Testing Author',
    }
  ];

  return (
    <div className="bg-gray-100 p-6 ">
      <div className="container mx-auto">
        {/* Main News Section */}
        <div className="md:flex">
          {/* Main Featured News */}
          <div className="md:w-2/3 p-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <img src={staticData[0].image} alt={staticData[0].title} className="w-full h-80 object-center rounded-lg mb-4" />
              <div className="flex justify-between items-center mb-2">
                <span className="text-orange-500 font-semibold">{staticData[0].author}</span>
                <span className="text-gray-500">{staticData[0].time}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{staticData[0].title}</h2>
              <p className="text-gray-700">{staticData[0].description}</p>
            </div>
          </div>
          {/* Side News */}
          <div className="md:w-1/3 p-4 space-y-4 max-h-[calc(100vh-110px)] overflow-y-auto">
            {staticData.slice(1, 4).map((news) => (
              <div key={news._id} className="bg-white p-4 rounded-lg shadow-md flex">
                <img src={news.image} alt={news.title} className="w-1/3 h-24 object-cover rounded-lg mr-4" />
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">{news.time}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{news.title}</h3>
                  <p className="text-gray-600 text-sm">{news.description}</p>
                </div>
              </div>
            ))}
            {staticData.length > 4 && (
              <div className="bg-white p-4 rounded-lg shadow-md flex justify-center items-center">
                <p className="text-gray-600">More news...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingNews;

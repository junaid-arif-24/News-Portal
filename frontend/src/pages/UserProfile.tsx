import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate, formatTime } from '../utils/helper'; // Adjust the import according to your project structure

interface Subscription {
  _id: string;
  name: string;
}

interface SavedNews {
  _id: string;
  title: string;
  date: string;
  time: string;
  images: string[];
  category: {
    name: string;
  };
}

interface UserProf {
  email: string;
  name: string;
  subscriptions: Subscription[];
  savedNews: SavedNews[];
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProf | null>(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile', error);
    }
  };

  if (!profile) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <div className="w-full flex gap-28 mb-10">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Name:</h2>
            <p className="text-gray-700">{profile.name}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Email:</h2>
            <p className="text-gray-700">{profile.email}</p>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-2">Subscriptions:</h2>
          {profile.subscriptions.length === 0 ? (
            <div className="flex justify-center items-center h-24">
              <p className="text-gray-700 text-3xl">No subscriptions found.</p>
            </div>
          ) : (
            <ul className="list-disc list-inside">
              {profile.subscriptions.map((sub) => (
                <li key={sub._id} className="text-gray-700">{sub.name}</li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Saved News:</h2>
          {profile.savedNews.length === 0 ? (
            <div className="flex justify-center items-center h-24">
              <p className="  text-gray-700 ">No saved news found.</p>
            </div>
          ) : (
            <div className="flex flex-wrap -mx-2">
              {profile.savedNews.map((news) => (
                <div key={news._id} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4">
                  <div className="rounded-lg shadow-md bg-slate-200 overflow-hidden">
                    <img
                      src={news.images[0]}
                      alt={news.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <a href={`/news/${news._id}`} className="text-blue-500 hover:underline text-lg font-semibold">
                        {news.title}
                      </a>
                      <p className="text-gray-500 text-sm">
                        {formatDate(news.date)} at {formatTime(news.time)}
                      </p>
                      <p className="text-gray-700 mt-2">Category: {news.category.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

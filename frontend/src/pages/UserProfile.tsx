import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Subscription {
  _id: string;
  name: string;
}

interface SavedNews {
  _id: string;
  title: string;
}

interface UserProf {
  email: string;
  subscriptions: Subscription[];
  savedNews: SavedNews[];
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProf | null>({
    email : "Junaid",
    subscriptions : [{
      _id : "1",
      name : "Ilman"
    },
    {
      _id : "2",
      name : "Adnan"
    }],
    savedNews : [{
      _id : "1",
      title : "one and only"
    },
    {
      _id : "2",
      title : "two and only"
    }]  
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Email:</h2>
          <p className="text-gray-700">{profile.email}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Subscriptions</h2>
          <ul className="list-disc list-inside">
            {profile.subscriptions.map((sub) => (
              <li key={sub._id} className="text-gray-700">{sub.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Saved News</h2>
          <ul className="list-disc list-inside">
            {profile.savedNews.map((news) => (
              <li key={news._id} className="text-gray-700">
                <a href={`/news/${news._id}`} className="text-blue-500 hover:underline">
                  {news.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

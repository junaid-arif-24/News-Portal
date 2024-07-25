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
  const [profile, setProfile] = useState<UserProf | null>(null);

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

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {profile.email}</p>
      <h2>Subscriptions</h2>
      <ul>
        {profile.subscriptions.map(sub => (
          <li key={sub._id}>{sub.name}</li>
        ))}
      </ul>
      <h2>Saved News</h2>
      <ul>
        {profile.savedNews.map(news => (
          <li key={news._id}>
            <a href={`/news/${news._id}`}>{news.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
